# Costruisce, firma e pubblica l'APK Android di CyberDojo (vedi docs/android.md).
# Uso (da PowerShell, nella cartella del progetto):  .\scripts\costruisci-apk.ps1 -Versione 1.0.1 -Codice 2
# Servono: Java 17, SDK in %USERPROFILE%\.bubblewrap\android_sdk, android\cyberdojo.keystore e android\keystore-pass.txt.
param([Parameter(Mandatory)][string]$Versione, [Parameter(Mandatory)][int]$Codice)
$ErrorActionPreference = "Continue"   # npx scrive messaggi normali su stderr: non sono errori; i controlli sono sotto
$root = Split-Path $PSScriptRoot -Parent
$jdk = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
$sdk = "$env:USERPROFILE\.bubblewrap\android_sdk"
Set-Location "$root\android"

# versione nel manifesto dell'app
$m = Get-Content twa-manifest.json -Raw | ConvertFrom-Json
$m.appVersion = $Versione
$m.appVersionCode = $Codice
[IO.File]::WriteAllText("$PWD\twa-manifest.json", ($m | ConvertTo-Json -Depth 10), (New-Object Text.UTF8Encoding $false))

$env:JAVA_HOME = $jdk
$env:ANDROID_HOME = $sdk
$env:PATH = "$PWD;$env:PATH"   # Bubblewrap cerca gradlew.bat nel PATH
$pw = (Get-Content keystore-pass.txt -Raw).Trim()
$env:BUBBLEWRAP_KEYSTORE_PASSWORD = $pw
$env:BUBBLEWRAP_KEY_PASSWORD = $pw
$env:CI = "1"

# Un Gradle rimasto acceso da una costruzione precedente blocca i file e fa fallire «update»: lo si chiude prima.
Get-Process java -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*Eclipse Adoptium*" } | Stop-Process -Force
Start-Sleep 2
"" | npx -y @bubblewrap/cli update --skipVersionUpgrade | Out-Null
if (-not (Test-Path .\gradlew.bat)) { throw "Rigenerazione del progetto fallita: manca gradlew.bat" }
# Compilazione con Gradle diretto e allineamento: la firma automatica di Bubblewrap si ferma per gli spazi nel percorso di Java.
Remove-Item app-release-*.apk, app-release-*.idsig -ErrorAction SilentlyContinue   # mai riusare file vecchi
Remove-Item app\build\outputs\apk -Recurse -Force -ErrorAction SilentlyContinue
& .\gradlew.bat assembleRelease --console=plain
$grezzo = "app\build\outputs\apk\release\app-release-unsigned.apk"
if (-not (Test-Path $grezzo)) { throw "Compilazione fallita: Gradle non ha prodotto $grezzo" }
& "$sdk\build-tools\36.1.0\zipalign.exe" -f -p 4 $grezzo app-release-unsigned-aligned.apk
if (-not (Test-Path app-release-unsigned-aligned.apk)) { throw "Allineamento fallito" }

$env:APKPW = $pw
& "$jdk\bin\java.exe" -Xmx1024M -Xss1m -jar "$sdk\build-tools\36.1.0\lib\apksigner.jar" sign --ks ./cyberdojo.keystore --ks-key-alias cyberdojo --ks-pass env:APKPW --key-pass env:APKPW --out ./app-release-signed.apk ./app-release-unsigned-aligned.apk
$cert = & "$jdk\bin\java.exe" -jar "$sdk\build-tools\36.1.0\lib\apksigner.jar" verify --print-certs ./app-release-signed.apk | Select-String 'SHA-256 digest'
Remove-Item Env:APKPW
if (-not (Test-Path app-release-signed.apk)) { throw "Firma fallita: manca app-release-signed.apk" }
$hex = ($cert.Line -split ':\s*')[-1].Trim().ToUpper()
$fp = (($hex -split '(.{2})' | Where-Object { $_ }) -join ':')

Set-Location $root
node node_modules/tsx/dist/cli.mjs scripts/aggiorna-release-apk.mts android/app-release-signed.apk $Versione $fp
Write-Host "Fatto: APK $Versione pubblicato in public/downloads. Ora: commit, push e pubblicazione del sito."
