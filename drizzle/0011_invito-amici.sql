-- Invito per WhatsApp e «Studia insieme». Solo funzioni, nessuna tabella nuova.
-- Regola intoccabile: minori (14-17) e adulti non si mescolano mai. Tutte le funzioni leggono l'utente da app.user_id
-- (impostato da withUser) e confrontano age_group di entrambi.

-- Anteprima di un invito: chi sta invitando, se il codice è valido per chi guarda. Nessuna scrittura.
-- Soprannome e avatar escono solo se il proprietario ha scelto di mostrarsi agli amici. Se chi guarda ha già un profilo social,
-- la fascia d'età deve coincidere e non ci devono essere blocchi. Il server ripete il controllo di fascia per chi non ha ancora il profilo.
CREATE OR REPLACE FUNCTION public.friend_invite_preview(p_code text)
RETURNS TABLE (nickname text, avatar text, age_group text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH u AS (SELECT nullif(current_setting('app.user_id', true), '') AS uid),
  me AS (SELECT sp.user_id, sp.public_id, sp.age_group FROM social_profiles sp, u WHERE sp.user_id = u.uid)
  SELECT CASE WHEN t.show_to_friends THEN t.nickname END,
         CASE WHEN t.show_to_friends THEN t.avatar END,
         t.age_group
  FROM social_profiles t, u
  WHERE u.uid IS NOT NULL
    AND t.friend_code = p_code AND t.accept_requests AND t.nickname IS NOT NULL
    AND t.user_id <> u.uid
    AND NOT EXISTS (SELECT 1 FROM me WHERE me.age_group <> t.age_group)
    AND NOT EXISTS (
      SELECT 1 FROM me, social_blocks b
      WHERE b.kind = 'user'
        AND ((b.user_id = me.user_id AND b.target_id = t.public_id) OR (b.user_id = t.user_id AND b.target_id = me.public_id))
    )
$$;--> statement-breakpoint

-- Amicizia immediata con il codice di chi invita. Crea la riga 'accepted' (requester = chi usa il link, addressee = proprietario del codice)
-- SOLO se: chi usa il link ha un soprannome, il proprietario accetta richieste e ha un soprannome, stessa age_group, utenti diversi,
-- nessun blocco in nessuna direzione, nessuna amicizia già esistente. Altrimenti non restituisce nulla (il motivo non si rivela).
-- Il trigger friendships_guard ripete età e limiti (30 amici). Restituisce solo l'id dell'amicizia e, se il nuovo amico si mostra, soprannome e avatar.
CREATE OR REPLACE FUNCTION public.friend_accept_by_code(p_code text)
RETURNS TABLE (friendship_id text, nickname text, avatar text)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid text := nullif(current_setting('app.user_id', true), '');
  me public.social_profiles;
  t public.social_profiles;
  fid text;
BEGIN
  IF uid IS NULL OR p_code IS NULL THEN RETURN; END IF;
  SELECT * INTO me FROM public.social_profiles AS sp WHERE sp.user_id = uid;
  IF me.user_id IS NULL OR me.nickname IS NULL THEN RETURN; END IF;
  SELECT * INTO t FROM public.social_profiles AS sp
    WHERE sp.friend_code = p_code AND sp.accept_requests AND sp.nickname IS NOT NULL;
  IF t.user_id IS NULL OR t.user_id = uid THEN RETURN; END IF;
  IF t.age_group <> me.age_group THEN RETURN; END IF;
  IF EXISTS (
    SELECT 1 FROM public.social_blocks AS b
    WHERE b.kind = 'user'
      AND ((b.user_id = me.user_id AND b.target_id = t.public_id) OR (b.user_id = t.user_id AND b.target_id = me.public_id))
  ) THEN RETURN; END IF;
  IF EXISTS (
    SELECT 1 FROM public.friendships AS f
    WHERE (f.requester_id = uid AND f.addressee_id = t.user_id) OR (f.requester_id = t.user_id AND f.addressee_id = uid)
  ) THEN RETURN; END IF;
  fid := gen_random_uuid()::text;
  INSERT INTO public.friendships (id, requester_id, addressee_id, status, created_at, accepted_at)
    VALUES (fid, uid, t.user_id, 'accepted', (now() AT TIME ZONE 'UTC'), (now() AT TIME ZONE 'UTC'));
  RETURN QUERY SELECT fid, CASE WHEN t.show_to_friends THEN t.nickname END, CASE WHEN t.show_to_friends THEN t.avatar END;
END
$$;--> statement-breakpoint

-- «Studia insieme»: dati per decidere se una chiamata è consentita, per UNA amicizia di chi chiede.
-- Restituisce stato, fascia d'età di entrambi, se c'è un blocco e il soprannome dell'amico (solo se si mostra agli amici).
-- Nessuna riga se l'amicizia non esiste o non è di chi chiede. Sola lettura.
CREATE OR REPLACE FUNCTION public.friend_call_info(p_friendship text)
RETURNS TABLE (status text, my_age_group text, their_age_group text, blocked boolean, their_nickname text, my_nickname text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT sp.user_id, sp.public_id, sp.age_group, sp.nickname
    FROM social_profiles sp WHERE sp.user_id = nullif(current_setting('app.user_id', true), '')
  )
  SELECT f.status, me.age_group, o.age_group,
         EXISTS (
           SELECT 1 FROM social_blocks b
           WHERE b.kind = 'user'
             AND ((b.user_id = me.user_id AND b.target_id = o.public_id) OR (b.user_id = o.user_id AND b.target_id = me.public_id))
         ),
         CASE WHEN o.show_to_friends THEN o.nickname END,
         me.nickname
  FROM friendships f
  JOIN me ON me.user_id IN (f.requester_id, f.addressee_id)
  JOIN social_profiles o ON o.user_id = CASE WHEN f.requester_id = me.user_id THEN f.addressee_id ELSE f.requester_id END
  WHERE f.id = p_friendship
$$;--> statement-breakpoint

REVOKE ALL ON FUNCTION public.friend_invite_preview(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.friend_accept_by_code(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.friend_call_info(text) FROM PUBLIC;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cyberdojo_app') THEN
    GRANT EXECUTE ON FUNCTION public.friend_invite_preview(text) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.friend_accept_by_code(text) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.friend_call_info(text) TO cyberdojo_app;
  END IF;
END
$$;
