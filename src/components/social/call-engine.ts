import { getCallIceServers, pollCallSignals, sendCallSignal } from "@/app/actions/call";
import {
  AUDIO_CONSTRAINTS,
  CALL_GONE_TEXT,
  createChatLimiter,
  deriveStatus,
  describeMediaError,
  generateSid,
  isPolite,
  nextPollDelay,
  parseDataMessage,
  reduceInitialBatch,
  routeSignal,
  sanitizeChatText,
  videoConstraints,
  type CallStatus,
  type IncomingSignal,
  type RouteState,
} from "@/lib/social/call-client";
import { CALL_NOT_AVAILABLE, type IceServer, type SignalKind } from "@/lib/social/call-protocol";

/**
 * Motore WebRTC 1 contro 1, sottile e senza React. Nessun audio, video o chat passa dai nostri server:
 * i media e la chat vanno direttamente tra i due browser; il database vede solo messaggi tecnici di connessione.
 * Schema «perfect negotiation». La logica da provare con i test sta in src/lib/social/call-client.ts.
 */

export type ChatLine = { id: number; mine: boolean; text: string };

export type CallSnapshot = {
  phase: "starting" | "active" | "ended";
  status: CallStatus;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  micOn: boolean;
  camOn: boolean;
  remoteMicOn: boolean;
  remoteCamOn: boolean;
  canSwitchCamera: boolean;
  facing: "user" | "environment";
  /** Errore grave (niente microfono, browser non adatto, chiamata chiusa dal server): la chiamata non parte. */
  fatalError: string | null;
  /** Avviso leggero (ad esempio fotocamera non disponibile): la chiamata continua. */
  notice: string | null;
  chat: ChatLine[];
};

const HELLO_EVERY_MS = 5000;
const CHAT_KEEP = 100;

export class CallEngine {
  private readonly sid = generateSid();
  private readonly friendshipId: string;
  private readonly onChange: (s: CallSnapshot) => void;

  private iceServers: IceServer[] = [];
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private facing: "user" | "environment" = "user";
  private videoSender: RTCRtpSender | null = null;

  private route: RouteState = { remoteSid: null };
  private makingOffer = false;
  private ignoreOffer = false;
  private pendingIce: RTCIceCandidateInit[] = [];
  private iceRestarts = 0;
  private remoteLeft = false;
  private connectStartedAt = 0;

  private cursor = 0;
  private firstPollDone = false;
  private lastActivityAt = Date.now();
  private lastHelloAt = 0;
  private errors = 0;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private statusTimer: ReturnType<typeof setInterval> | null = null;
  private sendChain: Promise<void> = Promise.resolve();
  private processing: Promise<void> = Promise.resolve();

  private closed = false;
  private started = false;
  private chat: ChatLine[] = [];
  private chatSeq = 0;
  private readonly sendLimiter = createChatLimiter();
  private readonly receiveLimiter = createChatLimiter();

  private micOn = true;
  private camOn = false;
  private remoteMicOn = true;
  private remoteCamOn = false;
  private canSwitchCamera = false;
  private fatalError: string | null = null;
  private notice: string | null = null;
  private lastKey = "";

  constructor(friendshipId: string, onChange: (s: CallSnapshot) => void) {
    this.friendshipId = friendshipId;
    this.onChange = onChange;
  }

  // ---------- avvio e chiusura ----------

  async start(): Promise<void> {
    if (this.started || this.closed) return;
    this.started = true;
    this.emit(true);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
      this.fail(describeMediaError(null));
      return;
    }
    try {
      const ice = await getCallIceServers(this.friendshipId);
      if (this.closed) return;
      if (!ice.ok) {
        this.fail(ice.error === CALL_NOT_AVAILABLE ? CALL_GONE_TEXT : ice.error);
        return;
      }
      this.iceServers = ice.iceServers;
    } catch {
      this.fail("Non riesco a contattare CyberDojo. Controlla la connessione e ricarica la pagina.");
      return;
    }
    try {
      const audio = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS, video: false });
      if (this.closed) {
        audio.getTracks().forEach((t) => t.stop());
        return;
      }
      this.localStream = audio;
    } catch (e) {
      this.fail(describeMediaError(e as { name?: string }));
      return;
    }
    document.addEventListener("visibilitychange", this.onVisibility);
    this.statusTimer = setInterval(() => this.emit(), 1000);
    this.emit(true);
    void this.sendHello();
    void this.tick();
  }

  /** Chiude tutto: saluta l'altro (se può), spegne microfono e fotocamera davvero, ferma i timer. */
  async hangUp(): Promise<void> {
    if (this.closed) return;
    const wasActive = this.localStream !== null;
    this.closed = true;
    document.removeEventListener("visibilitychange", this.onVisibility);
    if (this.pollTimer) clearTimeout(this.pollTimer);
    if (this.statusTimer) clearInterval(this.statusTimer);
    if (wasActive) {
      try {
        await Promise.race([sendCallSignal({ friendshipId: this.friendshipId, kind: "bye", payload: { sid: this.sid } }), new Promise((r) => setTimeout(r, 1500))]);
      } catch {
        /* pazienza: l'altro lo vedrà dal collegamento che cade */
      }
    }
    this.releaseMedia();
    this.chat = [];
    this.emit(true);
  }

  /** Scheda che si chiude: saluto con sendBeacon (le azioni server non si possono chiamare da qui) e spegnimento dei dispositivi. */
  onPageHide = (): void => {
    if (this.closed) return;
    if (this.localStream && typeof navigator.sendBeacon === "function") {
      try {
        navigator.sendBeacon("/api/call/bye", new Blob([JSON.stringify({ friendshipId: this.friendshipId, sid: this.sid })], { type: "application/json" }));
      } catch {
        /* niente da fare */
      }
    }
    this.closed = true;
    if (this.pollTimer) clearTimeout(this.pollTimer);
    if (this.statusTimer) clearInterval(this.statusTimer);
    this.releaseMedia();
  };

  private releaseMedia(): void {
    try {
      this.dc?.close();
    } catch {
      /* già chiuso */
    }
    try {
      this.pc?.close();
    } catch {
      /* già chiuso */
    }
    this.dc = null;
    this.pc = null;
    this.videoSender = null;
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.remoteStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
    this.remoteStream = null;
  }

  private fail(message: string): void {
    this.fatalError = message;
    this.closed = true;
    document.removeEventListener("visibilitychange", this.onVisibility);
    if (this.pollTimer) clearTimeout(this.pollTimer);
    if (this.statusTimer) clearInterval(this.statusTimer);
    this.releaseMedia();
    this.emit(true);
  }

  // ---------- controlli ----------

  toggleMic(): void {
    const track = this.localStream?.getAudioTracks()[0];
    if (!track) return;
    this.micOn = !track.enabled;
    track.enabled = this.micOn;
    this.sendState();
    this.emit(true);
  }

  async toggleCamera(): Promise<void> {
    if (this.closed || !this.localStream) return;
    if (this.camOn) {
      this.stopVideo();
      this.camOn = false;
      this.sendState();
      this.emit(true);
      return;
    }
    await this.startVideo(this.facing);
  }

  async switchCamera(): Promise<void> {
    if (this.closed || !this.camOn) return;
    const next = this.facing === "user" ? "environment" : "user";
    // Prima si ferma la fotocamera in uso: molti telefoni non ne aprono due insieme.
    this.stopVideo(false);
    await this.startVideo(next);
  }

  private stopVideo(clearSender = true): void {
    const stream = this.localStream;
    if (!stream) return;
    for (const t of stream.getVideoTracks()) {
      t.stop();
      stream.removeTrack(t);
    }
    if (clearSender && this.videoSender) void this.videoSender.replaceTrack(null).catch(() => undefined);
  }

  private async startVideo(facing: "user" | "environment"): Promise<void> {
    const stream = this.localStream;
    if (!stream) return;
    try {
      const cam = await navigator.mediaDevices.getUserMedia({ video: videoConstraints(facing), audio: false });
      if (this.closed) {
        cam.getTracks().forEach((t) => t.stop());
        return;
      }
      const track = cam.getVideoTracks()[0];
      stream.addTrack(track);
      this.facing = facing;
      this.camOn = true;
      this.notice = null;
      if (this.pc) {
        if (this.videoSender) await this.videoSender.replaceTrack(track);
        else this.videoSender = this.pc.addTrack(track, stream); // fa partire la rinegoziazione
      }
      void this.refreshDevices();
      this.sendState();
    } catch (e) {
      this.camOn = false;
      this.notice = describeMediaError(e as { name?: string });
    }
    this.emit(true);
  }

  private async refreshDevices(): Promise<void> {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      this.canSwitchCamera = list.filter((d) => d.kind === "videoinput").length > 1;
    } catch {
      this.canSwitchCamera = false;
    }
    this.emit(true);
  }

  // ---------- chat (canale dati diretto) ----------

  sendChat(raw: string): string | null {
    const text = sanitizeChatText(raw);
    if (!text) return "Scrivi qualcosa prima di inviare.";
    if (!this.dc || this.dc.readyState !== "open") return "La chat si apre quando siete collegati.";
    if (!this.sendLimiter.take("me")) return "Stai scrivendo troppo in fretta: aspetta qualche secondo.";
    try {
      this.dc.send(JSON.stringify({ t: "chat", text }));
    } catch {
      return "Non sono riuscito a inviare il messaggio.";
    }
    this.pushChat(true, text);
    return null;
  }

  private pushChat(mine: boolean, text: string): void {
    this.chat = [...this.chat, { id: ++this.chatSeq, mine, text }].slice(-CHAT_KEEP);
    this.emit(true);
  }

  private sendState(): void {
    if (this.dc?.readyState === "open") {
      try {
        this.dc.send(JSON.stringify({ t: "state", mic: this.micOn, cam: this.camOn }));
      } catch {
        /* ignora */
      }
    }
  }

  // ---------- segnalazione ----------

  private onVisibility = (): void => {
    if (this.closed) return;
    if (document.hidden) {
      if (this.pollTimer) clearTimeout(this.pollTimer);
      this.pollTimer = null;
    } else {
      this.lastActivityAt = Date.now();
      void this.tick();
    }
  };

  private schedule(): void {
    if (this.pollTimer) clearTimeout(this.pollTimer);
    this.pollTimer = null;
    const delay = nextPollDelay({ now: Date.now(), lastActivityAt: this.lastActivityAt, errors: this.errors, hidden: typeof document !== "undefined" && document.hidden, closed: this.closed });
    if (delay !== null) this.pollTimer = setTimeout(() => void this.tick(), delay);
  }

  private async tick(): Promise<void> {
    if (this.closed || document.hidden) return;
    if (this.pollTimer) clearTimeout(this.pollTimer);
    this.pollTimer = null;
    try {
      const r = await pollCallSignals({ friendshipId: this.friendshipId, after: this.cursor });
      if (this.closed) return;
      if (!r.ok) {
        if (r.error === CALL_NOT_AVAILABLE) {
          this.fail(CALL_GONE_TEXT);
          return;
        }
        this.errors += 1;
      } else {
        this.errors = 0;
        let batch: IncomingSignal[] = r.signals;
        if (batch.length) {
          this.cursor = Math.max(this.cursor, ...batch.map((m) => m.seq));
          this.lastActivityAt = Date.now();
        }
        if (!this.firstPollDone) {
          this.firstPollDone = true;
          batch = reduceInitialBatch(batch);
        }
        for (const m of batch) this.processing = this.processing.then(() => this.handle(m)).catch(() => undefined);
        await this.processing;
      }
    } catch {
      this.errors += 1;
    }
    if (this.closed) return;
    if (!this.route.remoteSid && Date.now() - this.lastHelloAt >= HELLO_EVERY_MS) void this.sendHello();
    this.emit();
    this.schedule();
  }

  private async sendHello(): Promise<void> {
    this.lastHelloAt = Date.now();
    await this.send("hello", { sid: this.sid });
  }

  /** Invii in fila (l'ordine conta: offerta prima dei candidati). Nuovi tentativi solo per offerte e risposte. */
  private send(kind: SignalKind, payload: Record<string, unknown>): Promise<void> {
    const job = this.sendChain.then(async () => {
      if (this.closed && kind !== "bye") return;
      const attempts = kind === "offer" || kind === "answer" ? 3 : 1;
      for (let i = 0; i < attempts; i++) {
        try {
          const r = await sendCallSignal({ friendshipId: this.friendshipId, kind, payload });
          if (r.ok) {
            this.lastActivityAt = Date.now();
            return;
          }
          if (r.error === CALL_NOT_AVAILABLE) {
            this.fail(CALL_GONE_TEXT);
            return;
          }
        } catch {
          /* riprova */
        }
        await new Promise((res) => setTimeout(res, 800 * (i + 1)));
      }
    });
    this.sendChain = job.catch(() => undefined);
    return job.catch(() => undefined);
  }

  private async handle(m: IncomingSignal): Promise<void> {
    if (this.closed) return;
    const { state, action } = routeSignal(this.route, m);
    this.route = state;
    switch (action.type) {
      case "peer":
        this.remoteLeft = false;
        this.createPeer();
        void this.sendHello();
        break;
      case "bye":
        this.remoteLeft = true;
        this.closePeer();
        break;
      case "offer":
      case "answer":
        await this.onDescription(action.payload.description as RTCSessionDescriptionInit);
        break;
      case "ice":
        await this.onCandidate(action.payload.candidate as RTCIceCandidateInit | null);
        break;
      default:
        break;
    }
    this.emit(true);
  }

  // ---------- WebRTC (perfect negotiation) ----------

  private closePeer(): void {
    try {
      this.dc?.close();
    } catch {
      /* già chiuso */
    }
    try {
      this.pc?.close();
    } catch {
      /* già chiuso */
    }
    this.pc = null;
    this.dc = null;
    this.videoSender = null;
    this.remoteStream = null;
    this.pendingIce = [];
    this.remoteCamOn = false;
  }

  private createPeer(): void {
    this.closePeer();
    const stream = this.localStream;
    if (!stream) return;
    const pc = new RTCPeerConnection({ iceServers: this.iceServers as RTCIceServer[] });
    this.pc = pc;
    this.makingOffer = false;
    this.ignoreOffer = false;
    this.iceRestarts = 0;
    this.connectStartedAt = Date.now();
    this.remoteStream = new MediaStream();

    for (const track of stream.getTracks()) {
      const sender = pc.addTrack(track, stream);
      if (track.kind === "video") this.videoSender = sender;
    }

    // Canale dati «negoziato»: lo crea ognuno dei due con lo stesso id, senza scambio di eventi. Chat diretta, mai dai nostri server.
    const dc = pc.createDataChannel("chat", { negotiated: true, id: 1, ordered: true });
    this.dc = dc;
    dc.onopen = () => {
      this.sendState();
      this.emit(true);
    };
    dc.onclose = () => this.emit(true);
    dc.onmessage = (ev) => {
      const msg = parseDataMessage(ev.data);
      if (!msg) return;
      if (msg.type === "state") {
        this.remoteMicOn = msg.mic;
        this.remoteCamOn = msg.cam;
        this.emit(true);
      } else if (this.receiveLimiter.take("them")) {
        this.pushChat(false, msg.text);
      }
    };

    pc.ontrack = (ev) => {
      const rs = this.remoteStream;
      if (rs && !rs.getTracks().includes(ev.track)) rs.addTrack(ev.track);
      ev.track.onended = () => {
        rs?.removeTrack(ev.track);
        this.emit(true);
      };
      this.emit(true);
    };
    pc.onicecandidate = (ev) => {
      if (ev.candidate && ev.candidate.candidate) void this.send("ice", { sid: this.sid, candidate: ev.candidate.toJSON() });
    };
    pc.onnegotiationneeded = async () => {
      try {
        this.makingOffer = true;
        await pc.setLocalDescription();
        const d = pc.localDescription;
        if (d && this.pc === pc) await this.send("offer", { sid: this.sid, description: { type: "offer", sdp: d.sdp } });
      } catch {
        /* la prossima negoziazione riprova */
      } finally {
        this.makingOffer = false;
      }
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") this.errors = 0;
      this.emit(true);
    };
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "failed" && this.iceRestarts < 2) {
        this.iceRestarts += 1;
        pc.restartIce();
      }
      this.emit(true);
    };
  }

  private async onDescription(description: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.pc;
    const remoteSid = this.route.remoteSid;
    if (!pc || !remoteSid || !description) return;
    const polite = isPolite(this.sid, remoteSid);
    const collision = description.type === "offer" && (this.makingOffer || pc.signalingState !== "stable");
    this.ignoreOffer = !polite && collision;
    if (this.ignoreOffer) return;
    try {
      await pc.setRemoteDescription(description);
      for (const c of this.pendingIce.splice(0)) await pc.addIceCandidate(c).catch(() => undefined);
      if (description.type === "offer") {
        await pc.setLocalDescription();
        const d = pc.localDescription;
        if (d) await this.send("answer", { sid: this.sid, description: { type: "answer", sdp: d.sdp } });
      }
    } catch {
      /* descrizione non applicabile: si aspetta la prossima */
    }
  }

  private async onCandidate(candidate: RTCIceCandidateInit | null): Promise<void> {
    const pc = this.pc;
    if (!pc || !candidate) return;
    if (!pc.remoteDescription) {
      this.pendingIce.push(candidate);
      return;
    }
    try {
      await pc.addIceCandidate(candidate);
    } catch {
      if (!this.ignoreOffer) {
        /* candidato non valido: si scarta */
      }
    }
  }

  // ---------- stato per l'interfaccia ----------

  private currentStatus(): CallStatus {
    const pc = this.pc;
    return deriveStatus({
      remotePresent: this.route.remoteSid !== null || this.remoteLeft,
      remoteLeft: this.remoteLeft,
      connectionState: pc?.connectionState ?? "new",
      iceConnectionState: pc?.iceConnectionState ?? "new",
      connectingForMs: this.connectStartedAt ? Date.now() - this.connectStartedAt : 0,
    });
  }

  private emit(force = false): void {
    const status = this.currentStatus();
    const key = `${status}|${this.closed}|${this.fatalError}`;
    if (!force && key === this.lastKey) return;
    this.lastKey = key;
    this.onChange({
      phase: this.closed ? "ended" : this.localStream ? "active" : "starting",
      status,
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      micOn: this.micOn,
      camOn: this.camOn,
      remoteMicOn: this.remoteMicOn,
      remoteCamOn: this.remoteCamOn,
      canSwitchCamera: this.canSwitchCamera,
      facing: this.facing,
      fatalError: this.fatalError,
      notice: this.notice,
      chat: this.chat,
    });
  }
}
