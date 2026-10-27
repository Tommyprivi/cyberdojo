-- Verifica pubblica di un certificato: dato il codice, restituisce solo nome (con l'iniziale del cognome), corso, cintura e data.
-- La tabella certificates è protetta per riga: la pagina pubblica /verifica/<codice> passa da questa funzione in sola lettura.
CREATE OR REPLACE FUNCTION public.verify_certificate(p_code text)
RETURNS TABLE (holder text, course text, belt text, issued_at timestamp)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    trim(split_part(u.name, ' ', 1) || ' ' || coalesce(left(nullif(split_part(u.name, ' ', 2), ''), 1) || '.', '')),
    c.course, c.belt, c.issued_at
  FROM certificates c JOIN "user" u ON u.id = c.user_id
  WHERE c.public_code = p_code AND length(p_code) BETWEEN 8 AND 64
$$;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cyberdojo_app') THEN
    GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO cyberdojo_app;
    GRANT SELECT, INSERT ON TABLE public.certificates TO cyberdojo_app;
  END IF;
END
$$;
