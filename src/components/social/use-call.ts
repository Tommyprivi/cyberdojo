"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CallEngine, type CallSnapshot } from "./call-engine";

const INITIAL: CallSnapshot = {
  phase: "starting",
  status: "waiting",
  localStream: null,
  remoteStream: null,
  micOn: true,
  camOn: false,
  remoteMicOn: true,
  remoteCamOn: false,
  canSwitchCamera: false,
  facing: "user",
  fatalError: null,
  notice: null,
  chat: [],
};

/** Collega la pagina al motore della chiamata e spegne tutto (dispositivi, timer) quando la pagina si chiude o si lascia. */
export function useCall(friendshipId: string) {
  const [snap, setSnap] = useState<CallSnapshot>(INITIAL);
  const engine = useRef<CallEngine | null>(null);

  useEffect(() => {
    const e = new CallEngine(friendshipId, setSnap);
    engine.current = e;
    const onHide = () => e.onPageHide();
    // Pagina ripresa dalla cache del browser: i dispositivi sono già spenti, si riparte da zero.
    const onShow = (ev: PageTransitionEvent) => {
      if (ev.persisted) window.location.reload();
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("pageshow", onShow);
    void e.start();
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("pageshow", onShow);
      void e.hangUp();
      engine.current = null;
    };
  }, [friendshipId]);

  const toggleMic = useCallback(() => engine.current?.toggleMic(), []);
  const toggleCamera = useCallback(() => void engine.current?.toggleCamera(), []);
  const switchCamera = useCallback(() => void engine.current?.switchCamera(), []);
  const hangUp = useCallback(async () => {
    await engine.current?.hangUp();
  }, []);
  const sendChat = useCallback((text: string): string | null => engine.current?.sendChat(text) ?? "La chat non è pronta.", []);

  return { snap, toggleMic, toggleCamera, switchCamera, hangUp, sendChat };
}
