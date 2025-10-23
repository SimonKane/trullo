# Examinationsuppgift - Trullo

## Mål

Målet är att skapa ett REST-API för en projekthanterings-applikation vid namn Trullo. API\:et ska möjliggöra att användare (User) kan skapa uppgifter (Task) och planera projekt. Databasen ska vara antingen SQL eller NoSQL.

### Teoretiska resonemang

- Motivera ditt val av databas
- Redogör vad de olika teknikerna (ex. verktyg, npm-paket, etc.) gör i applikationen
- Redogör översiktligt hur applikationen fungerar

### Krav för Godkänt

- REST-API\:et använder **Node.js, Express och TypeScript**
- **SQL- eller NoSQL-databas**
  - Om SQL → använd t.ex. Prisma med migrationer. Om NoSQL (MongoDB & Mongoose) → definiera relevanta scheman och modeller.
- Datamodellen har objektet `Task` med följande fält

  - `id`
  - `title`
  - `description`
  - `status` (tillåtna värden: `"to-do"`, `"in progress"`, `"blocked"`, `"done"`)
  - `assignedTo` (**referens till `User.id`, kan vara `null`**)
    Om värdet inte är `null` måste användaren finnas (validera i endpointen innan skrivning).
  - `createdAt` (**sätts automatiskt på serversidan**)
  - `finishedAt` (**sätts automatiskt när `status` uppdateras till `"done"`; annars `null`**)

- Datamodellen har objektet `User` med följande fält

  - `id`
  - `name`
  - `email` (**unik, giltigt format**)
  - `password` (**minst 8 tecken**, lagras **inte** i klartext, använd bcrypt ex.)

- Möjlighet att **skapa, läsa, uppdatera och ta bort** en `User`
- Möjlighet att **skapa, läsa, uppdatera och ta bort** en `Task`
- En `User` kan **tilldelas** en `Task` via fältet `assignedTo`
- **Grundläggande validering och felhantering**
  Vid ogiltig indata → `400`, resurs saknas → `404`, unikhetskonflikt (t.ex. e-post) → `409`, internt fel → `500`.

### Vidareutveckling för Väl Godkänt

Följande urval är exempel på vidareutveckling. Egna förslag välkomnas.

- Applikationen är **robust** med genomtänkt **felhantering och validering** (viktigast för VG)
- Utveckla datamodellen med fler fält och objekt
  – t.ex. `tags` på `Task`, `Project` (Trello-liknande board) där `Task` tillhör ett projekt
- **Authentication & Authorization**

  - Implementera autentisering med **JWT**
  - Endast autentiserade användare kan ändra sina uppgifter
  - **Rollhantering** (t.ex. `role: "admin"`) som kan administrera alla användare/uppgifter
  - **Färdigställare / audit (`finishedBy`)**
    - Lägg till fältet `finishedBy: User.id | null` på `Task` (**VG**).
    - Sätts **automatiskt på serversidan** när en task byter status från något annat till `"done"`; klienten ska **inte** skicka detta fält.
    - Använd den inloggade användaren från JWT (t.ex. `req.user.id`).

- **Kryptera lösenord** i databasen (hash + salt)
- Implementera möjlighet för användaren att **nollställa och välja nytt lösenord**

### Inlämning

- Lägg en textfil med svaren från **Teoretiska resonemang** i roten av repo (t.ex. `README.md`)
- Lämna in länk till git-repo (t.ex. GitHub) i Canvas
- Inlämning senast **måndagen den 29\:e september kl. 23:59**
- Bifoga en kort **körguide** i `README.md` (hur man startar, env-variabler). En enkel `env.example` uppskattas.

**Seed-data:**
Repo får gärna också innehålla:

- En scriptad seed (t.ex. `npm run seed`) som skapar **minst 2 users** (varav 1 admin om du gör VG-auth) och **minst 4 tasks** med blandade statusar.
- Lösenord i seed ska **hashas** (inte i klartext i DB).
- `assignedTo` i seed ska peka på befintlig user (eller vara `null`).
- (Om auth) dokumentera testkonto i `README.md` (t.ex. `admin@example.com` / `Passw0rd!`).
- Beskriv hur man kör seed i `README.md`.
