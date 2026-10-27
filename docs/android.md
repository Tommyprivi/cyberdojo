# App Android (APK)

L'app Android è il sito CyberDojo impacchettato (TWA): un solo codice, si aggiorna da sola con il sito.
Costruita con Bubblewrap (strumento di Google). Gratis. Il Play Store (25 $ una volta sola) è facoltativo: l'APK si installa anche a mano.

## Cosa serve sul computer
- **Java JDK 17**: `winget install EclipseAdoptium.Temurin.17.JDK` (poi riaprire il terminale).
- **Android SDK**: lo scarica Bubblewrap da solo alla prima esecuzione. In alternativa, Android Studio (installa l'SDK in `C:\Users\<utente>\AppData\Local\Android\Sdk`).

## Come si costruisce
1. Il sito deve essere raggiungibile (il file `manifest.webmanifest` lo è anche in manutenzione).
2. Chiave di firma (una volta sola, da conservare per sempre: senza, non si può aggiornare l'app):
   `keytool -genkeypair -v -keystore android/cyberdojo.keystore -alias cyberdojo -keyalg RSA -keysize 2048 -validity 10000`
   La password va in `android/keystore-pass.txt` (cartella ignorata da git). **Fare una copia della chiave e della password in un posto privato.**
3. Costruire: dalla cartella `android/`, `npx -y @bubblewrap/cli build` (usa `twa-manifest.json`). Produce `app-release-signed.apk` (da installare) e `app-release-bundle.aab` (per il Play Store).
4. Verifica dei collegamenti (per togliere la barra dell'indirizzo): copiare l'impronta SHA-256 della chiave (`keytool -list -v -keystore android/cyberdojo.keystore`) in `public/.well-known/assetlinks.json`, poi ripubblicare il sito.

## Limiti
- Con l'indirizzo `*.vercel.app` la verifica può essere fragile: con il dominio proprio (cyberdojo.it) è più solida.
- Le notifiche push funzionano come nel sito (stesse chiavi VAPID).
