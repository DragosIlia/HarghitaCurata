# Harghita Curata

Duplicat tehnic al `ADICetateniMobile/Mobile`, cu Angular 22.2.1, Ionic 9.0.6, Capacitor 8.5.2 si Google Maps 8.0.1. Codul sursa original nu a fost modificat. Versiunile exacte sunt fixate in `package-lock.json`.

## Test cu backendul HarghitaCurata local

Backendul folosit de aceasta copie este acum `BE/Herc/Apollo.Customization.HarghitaCurata`. Profilul Visual Studio **Apollo.Customization.HarghitaCurata** foloseste `http://0.0.0.0:5001`. Profilul **IIS Express** foloseste alte porturi. Configurati o baza SQL Server Harghita de test si un secret JWT inainte de folosirea API-ului; la pornire, `Program.Main` executa automat migrari EF Core daca exista conexiune.

1. Porniti profilul **Apollo.Customization.HarghitaCurata** in Visual Studio si verificati `http://localhost:5001/swagger`. Consultati [configurarea backendului](../../BE/Herc/Apollo.Customization.HarghitaCurata/README.md).
2. In acest folder rulati `npm ci` si `npm start`. Mediul de dezvoltare din `src/environments/environment.ts` foloseste `http://localhost:5001/api/` in browser si in simulatorul iOS.
3. Pentru emulatorul Android rulati `npm run build`, `npx cap sync`, apoi `android/gradlew.bat assembleDebug` cu JDK 21. Aplicatia va folosi `http://10.0.2.2:5001/api/`. Buildul debug permite HTTP local.
4. Pe un telefon fizic inlocuiti gazda API din `environment.ts` cu adresa LAN a calculatorului si permiteti traficul in firewall. `localhost` si `10.0.2.2` nu indica PC-ul de pe telefonul fizic.

Folositi Node.js 22.22.3+ sau 24.15+. `npm run build:production` utilizeaza in continuare API-ul Bihor din `environment.prod.ts`, pana la configurarea backendului de productie Harghita. Nu distribuiti acel build ca produs final Harghita.

## Compatibilitatea API verificata in cod

Am comparat metoda HTTP si ruta pentru **34 apeluri** din aplicatie cu controllerele backendului. Copia include `GET /api/guide/get` si `POST /api/centres/get-items-by-id`, deci toate cele **34 de rute** au acum corespondent. Aceasta verificare este statica.

Ruta pentru centru foloseste fractiile asociate centrului si detaliile lor. Modelul nu contine materiale reciclabile individuale; daca acestea sunt necesare, trebuie adaugate date si model propriu. Comparatia statica nu dovedeste compatibilitatea tuturor payloadurilor, a conturilor sau a bazei de date.

## Pluginuri si servicii externe

- Importurile active din `src` au fost comparate cu `package.json`: **0 pluginuri lipsa**. `npx cap doctor` confirma versiunile Capacitor 8.5.2 si proiectul Android; pe acest PC nu este instalat Xcode.
- Butonul „Distribuie” din profil foloseste acum `@capacitor/share` 8.0.2. Geocodarea si navigatia folosesc pluginuri Capacitor 8; dependentele Cordova vechi au fost eliminate.
- `npm audit --omit=dev` raporteaza **0 vulnerabilitati** in dependentele de productie ale aplicatiei mobile. Buildul backendului avertizeaza separat ca .NET 6 nu mai este suportat si ca versiunea folosita de `System.IdentityModel.Tokens.Jwt` are o vulnerabilitate moderata.
- Google Maps necesita chei proprii cu billing pentru Web, Android si iOS. Cheia Web/iOS este inca preluata din aplicatia Bihor si poate fi restrictionata. Pentru Android setati `GOOGLE_MAPS_ANDROID_KEY` in mediu inainte de build; fara ea harta nativa nu se poate incarca. Actualitatea datelor cartografice depinde de serviciul Google, nu doar de versiunea pluginului.
- Notificarile push necesita proiect Firebase/APNs pentru noul ID `ro.harghitacurata.app`. `android/app/google-services.json` si configuratia iOS nu sunt prezente; pluginul este instalat, dar push nu poate fi considerat functional.
- Logo, iconuri, emailul de suport, termenii si politica de confidentialitate provin inca din aplicatia Bihor. Inlocuiti-le inainte de publicare. Linkul iOS App Store nu exista inca.

## Plati

Pentru taxe, servicii reale sau bunuri fizice recomand **Stripe Checkout**: backendul creeaza sesiunea si valideaza plata prin webhook, iar aplicatia deschide pagina gazduita de Stripe. Plata nu a fost implementata deoarece produsul, suma si beneficiarul nu au fost definite. Pentru continut sau abonamente digitale consumate in aplicatie trebuie evaluate separat regulile App Store si Google Play.

Tariful standard afisat de Stripe Romania la 1 octombrie 2026 pentru carduri standard SEE este **1,5% + 1 leu** pe tranzactie; verificati [preturile oficiale](https://stripe.com/en-ro/pricing) la implementare.

## Verificari executate

- Build web de dezvoltare si productie: reusite.
- `npx cap sync` pentru Android/iOS: reusit.
- APK Android debug cu JDK 21: reusit.
- Build backend `.NET`: reusit, cu cele doua avertismente de mai sus.
- Nu au fost testate live API-ul, autentificarea, harta, push sau iOS pe dispozitiv. Niciun backend nu asculta pe portul 5001 la momentul auditului.
