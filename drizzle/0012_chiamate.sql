-- «Studia insieme» dentro CyberDojo: segnalazione WebRTC via database (niente server WebSocket).
-- La tabella contiene SOLO messaggi tecnici di connessione (offerta, risposta, candidati di rete): mai audio, video o chat
-- (la chat passa direttamente tra i due browser). I messaggi si cancellano dopo 15 minuti.
-- Regola intoccabile: chiamata solo tra AMICI ACCETTATI, entrambi 'adulti', senza blocchi. Il controllo si ripete a ogni invio e a ogni lettura.
-- Nessuna policy RLS per il ruolo applicativo: la tabella si tocca solo dalle due funzioni SECURITY DEFINER qui sotto.

CREATE TABLE "call_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seq" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
	"friendship_id" text NOT NULL,
	"from_user" text NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "call_signals_kind_ck" CHECK ("kind" IN ('hello', 'offer', 'answer', 'ice', 'bye')),
	CONSTRAINT "call_signals_payload_object_ck" CHECK (jsonb_typeof("payload") = 'object'),
	CONSTRAINT "call_signals_payload_size_ck" CHECK (octet_length("payload"::text) <= 16384)
);--> statement-breakpoint
ALTER TABLE "call_signals" ADD CONSTRAINT "call_signals_from_user_fk" FOREIGN KEY ("from_user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Se l'amicizia finisce, i suoi messaggi spariscono con lei.
ALTER TABLE "call_signals" ADD CONSTRAINT "call_signals_friendship_fk" FOREIGN KEY ("friendship_id") REFERENCES "public"."friendships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Il cursore di lettura è «seq» (numero crescente, senza doppioni anche con messaggi nello stesso istante).
CREATE INDEX "call_signals_friendship_seq_idx" ON "call_signals" ("friendship_id", "seq");--> statement-breakpoint
CREATE INDEX "call_signals_created_idx" ON "call_signals" ("created_at");--> statement-breakpoint
ALTER TABLE "call_signals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- Controllo unico, usato da invio e lettura: restituisce l'id di chi chiede SOLO se la chiamata è consentita, altrimenti NULL.
-- Riusa friend_call_info (amicizia dell'utente di app.user_id, fascia d'età di entrambi, blocchi). Non è chiamabile dall'app.
CREATE OR REPLACE FUNCTION public.call_signal_guard(p_friendship text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid text := nullif(current_setting('app.user_id', true), '');
  info record;
BEGIN
  IF uid IS NULL OR p_friendship IS NULL THEN RETURN NULL; END IF;
  SELECT * INTO info FROM public.friend_call_info(p_friendship) LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF info.status <> 'accepted' OR info.blocked IS DISTINCT FROM false THEN RETURN NULL; END IF;
  IF info.my_age_group IS DISTINCT FROM 'adulti' OR info.their_age_group IS DISTINCT FROM 'adulti' THEN RETURN NULL; END IF;
  RETURN uid;
END
$$;--> statement-breakpoint

-- Invio di un messaggio di segnalazione. Restituisce il numero progressivo («seq»), oppure NULL se la chiamata non è consentita
-- (il motivo non si rivela). Errori espliciti: call_signal_invalid (tipo o contenuto non validi o troppo grande, max 16 KB),
-- call_signal_rate (troppi messaggi: massimo 90 al minuto per persona e amicizia).
-- A ogni invio cancella TUTTI i messaggi più vecchi di 15 minuti.
CREATE OR REPLACE FUNCTION public.call_signal_send(p_friendship text, p_kind text, p_payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid text := public.call_signal_guard(p_friendship);
  recent integer;
  new_seq bigint;
BEGIN
  IF uid IS NULL THEN RETURN NULL; END IF;
  IF p_kind IS NULL OR p_kind NOT IN ('hello', 'offer', 'answer', 'ice', 'bye') THEN
    RAISE EXCEPTION 'call_signal_invalid' USING ERRCODE = '22023';
  END IF;
  IF p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object' OR octet_length(p_payload::text) > 16384 THEN
    RAISE EXCEPTION 'call_signal_invalid' USING ERRCODE = '22023';
  END IF;
  -- Un invio alla volta per amicizia: il conteggio del ritmo non si aggira con richieste parallele.
  PERFORM pg_advisory_xact_lock(hashtext('call_signal:' || p_friendship));
  DELETE FROM public.call_signals WHERE created_at < now() - interval '15 minutes';
  SELECT count(*) INTO recent FROM public.call_signals AS s
    WHERE s.friendship_id = p_friendship AND s.from_user = uid AND s.created_at > now() - interval '1 minute';
  IF recent >= 90 THEN
    RAISE EXCEPTION 'call_signal_rate' USING ERRCODE = '54000';
  END IF;
  INSERT INTO public.call_signals (friendship_id, from_user, kind, payload, created_at)
    VALUES (p_friendship, uid, p_kind, p_payload, clock_timestamp())
    RETURNING seq INTO new_seq;
  RETURN new_seq;
END
$$;--> statement-breakpoint

-- Lettura dei messaggi dell'ALTRA persona (mai i propri), con seq maggiore di p_after, dei soli ultimi 15 minuti, al massimo 100,
-- in ordine. Se la chiamata non è consentita (amicizia finita, blocco, fascia d'età) non restituisce nulla. Sola lettura.
CREATE OR REPLACE FUNCTION public.call_signal_poll(p_friendship text, p_after bigint)
RETURNS TABLE (seq bigint, kind text, payload jsonb, sent_at timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid text := public.call_signal_guard(p_friendship);
BEGIN
  IF uid IS NULL THEN RETURN; END IF;
  RETURN QUERY
    SELECT s.seq, s.kind, s.payload, s.created_at
    FROM public.call_signals AS s
    WHERE s.friendship_id = p_friendship
      AND s.from_user <> uid
      AND s.seq > coalesce(p_after, 0)
      AND s.created_at > now() - interval '15 minutes'
    ORDER BY s.seq
    LIMIT 100;
END
$$;--> statement-breakpoint

REVOKE ALL ON TABLE public.call_signals FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.call_signal_guard(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.call_signal_send(text, text, jsonb) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.call_signal_poll(text, bigint) FROM PUBLIC;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cyberdojo_app') THEN
    -- La tabella NON è accessibile all'app: solo le funzioni (e call_signal_guard resta interna).
    REVOKE ALL ON TABLE public.call_signals FROM cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.call_signal_send(text, text, jsonb) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.call_signal_poll(text, bigint) TO cyberdojo_app;
  END IF;
END
$$;
