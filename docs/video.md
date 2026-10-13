# Video nelle lezioni

Ogni lezione **pubblicata** deve avere un video (regola del lint). Le bozze possono ancora non averlo.

## Come aggiungerlo
1. Nel frontmatter:
   ```yaml
   video:
     provider: youtube
     id: "XXXXXXXXXXX"      # 11 caratteri, dal link youtube.com/watch?v=...
     start: 30             # secondi
     end: 210              # secondi, massimo 10 minuti dopo start
     channel: "Nome del canale"
     title: "Titolo breve mostrato sul riquadro"   # facoltativo
     lang: it              # "it" (predefinito) oppure "en": per l'inglese si attivano i sottotitoli italiani
   ```
2. Nel corpo, nella schermata giusta (di solito la spiegazione): `<Video />`.
3. `pnpm lint:content` controlla che frontmatter e corpo coincidano.
4. `pnpm check:videos` chiede a YouTube se il video esiste, se l'incorporamento è attivo e se il canale coincide con `channel`. Un video non incorporabile va sostituito: l'incorporamento non si può forzare.

## Quali canali
- Preferire canali **italiani**. In alternativa canali **inglesi** con sottotitoli italiani buoni o traccia audio doppiata in italiano.
- Il doppiaggio non si può forzare dall'incorporamento: se il video ha più tracce audio, lo studente sceglie l'italiano dall'ingranaggio di YouTube. Indicarlo nel testo della lezione.

## Regole
- Solo player ufficiale, dominio `youtube-nocookie.com`. Il video si carica solo quando l'utente clicca.
- Mai scaricare, ricaricare altrove o ricopiare le trascrizioni.
- Il canale è sempre citato sotto il video, con il link "Apri su YouTube" (serve anche se l'incorporamento è disattivato).
- Prima di inserire un video: guardarlo, verificare che sia corretto tecnicamente e che l'incorporamento sia attivo.
- Il controllo periodico dei video spariti o non più incorporabili è nell'epic E9.
