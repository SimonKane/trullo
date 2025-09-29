## - Motivering av databasen:

Jag har valt att köra på en NoSQL-databas i form av MongoDB tillsammans med Mongoose. Detta valet för mig var ganska enkelt då jag tycker det tillvägagångssättet är väldigt anpassningsbart och rörligt till skillnad mot en SQL-databas. Sedan har jasg sedan tidigare hållit på en del med SQL samt tillhörande ORM. Så detta var något nytt för mig och därför körde jag på det spåret. Även om jag kan gilla tydligheten med en SQL-databas så känns det lättare att kunna strukturera om och ändra utan att hålla på med massa migrationer osv.

## - Redogörelse av npm-paket

Jag har valt att gå ganska basic och använt mig av de verktyg och metoder vi gått igenom hittills. I brist på tid har jag inte äventyrat och gett mig iväg på nya spår direkt.

Med hjälp av Express har jag skött routingen för mitt REST-API med hjälp av json-parsing och CORS. Jag har valt att inte köra med express egna middleware utan har skrivit min egen [Auth-middleware](./backend/src/middleware/auth.ts). Denna middleware kollar om användaren är authorized samt så skickar den med i token payload vilken roll användaren har. Så jag sedan i controllern kan använda mig av roll och jämnföra inloggade användarens id mot id:n i parametern.

Vid inloggning som sker via [Login-controller](./backend/src/controllers/authController.ts) så skapas en JWT-token (jsonwebtoken) som sedan är tänkt att användas i frontend för autentisering, antingen genom att sparas i **cookies** (HttpOnly) vilket skulle göra applikationen mindre sårbar och säkrare, alternativt i **localStorage** vilket gör applikationen lättare att hantera i demonstrationssyfte.

Jag använder mig av MongoDB via mongoose.
Bcrypt för att hasha lösenordet med saltrounds på 10. i mina responses har jag försökt vara noga med att inte skicka tillbaka användarens lösenord i någon av controller-funktionerna. Dels genom att sätta `select:false`i modellen på password [UserModel](./backend/src/models/userModel.ts). Men också i min [Reset Password-funktion](./backend/src/controllers/userControllers.ts) genom att i detta fall lägga en `select({password: 0}) // select("-password") `.

Använder mig av dotenv för att kunna ha variablar i min env-fil. Har en env.example-fil

Har försökt så gott jag kan att skriva under typescripts regler och lagar. Sedan var tanken att använda nodemon men pga strul så kör jag `"dev": "tsx watch --clear-screen=false src/index.ts"` istället.

## Redigör översiktligt hur applikationen fungerar

Min applikation för närvarande följer uppgiftens krav utan att egentligen sticka ut på något sätt. Jag sköter felhantering med förhoppningsvis korrekta statuskoder i responsen. Jag kollar även ifall ID är korrekt entligt mongooses `ts isValidObjectId`. För att validera en användares email så ligger en regex, som jag inte djupågende kan redogöra, i user-modellen.

Jag hashar lösenord med hjälp av Bcrypt, vilket sker innan lagring så att användarens "input" inte råkar följa med. Som tidigare nämnnt så skickar jag inte heller med password i någon respons för att undvika att det läcker. De som för tillfället kan ändra lösenord är den inloggade användaren som kan ändra sitt eget, vilket kollas med hjälp av token payload och id i parametern. Samt Admin som har tillgång att ändra allas. Detta görs i usercontroller

```ts
const { id } = req.params;
const loggedInUserId = (req as any).userId;
const role = (req as any).role;

if (role !== "admin" && loggedInUserId !== id) {
  return res.status(403).json({ message: "Not allowed to update this user" });
}
```

[Update User Controller](./backend/src/controllers/userControllers.ts)

Jag fick lite problem med indexeringen av user samt task-table. Så i min [index.ts](./backend/src/index.ts) har jag använt mig ag `ts await Promise.all([User.init(), Task.init()]);`. vilket gör att appen inte körs eller att request mot databasen börjar göras innan mongoose har kontrollerat schemat och skapar index om definieringar så som "unique" i detta fall har gjorts i modeller innan den kör igång. Detta förhindrar att exempelvis 2 användare med samma mail kan sparas innan ett unikt index finns.

I övrigt så följer appen kanska straight forward logic. Man kan logga in, antingen så har man rollen admin eller user. När man loggar in så skapas en token där inloggat id samt role från användaren sparas. Detta kan användas mot endpoints som använder sig av olika controllers. En admin kan uppdatera alla användare medan en user kan endast uppdatera sin egen information. Båda typerna av användare kan skapa tasks som i sin tur kan tilldelas en användare. Detta sker genom att man kan uppdatera task och ändra "assignedTo" med en användares ID för att koppla dom samman. Om en tasks status ändras så har jag en kodsnippet som kollar efter ändringen. Och om ändringen klarmarkerar ("done") en task så sätts även en tidpunkt där den blev klarmarkerat samt av vem, dvs vem som var inloggad och ändrade status.

```ts
if (data.status && data.status === "done") {
  data.finishedAt = new Date();
  data.finishedBy = (req as any).userId;
} else if (data.status && data.status !== "done") {
  data.finishedAt = null;
  data.finishedBy = null;
}
```

från [Update task controller](./backend/src/controllers/taskControllers.ts).

Tanken är att jag vill lägga till en registrerings-endpoint som skapar en användare. Men för tillfället kommer detta ske via en seed-fil. Instruktioner kommer nedan. Jag har även en tanke att göra en frontend likt ett klassiskt kanban board, där man ska kunna dra tasks mellan olika statuskolumner. Och beroende på vart man lägger en task så ska den uppdatera sin status beroende på föräldrakolumnens titel. För tillfället är det här jag har hunnit med och hoppas och vill fortsätta bygga på denna. Tycker det var en bra ingång till att lära sig relationer och på ett enkelt sätt kunna manövrera ändringar och struktur inom en NoSQL-databas.

### Körinstruktioner

För att testa endast backend så gå in i backendmappen och installera dependencies

```bash
cd backend
npm install
```

Det finns en env.example-fil som visar hur env.filen ska vara uppbyggd. [`.env.example`](./.env.example)

Sedan har jag en seed-fil som skapar 2 stycken användare där en är admin och en är vanlig user. Seed-filen har jag själv inte skrivit och har också använt mig av Faker.js för att generera olika task-titles

```bash
npm run seed
```

Så har du inloggningsuppfifterna:

Admin Email: trullo.admin@example.com
Admin Password: Passw0rd!

---

User Email: trullo.user@example.com
User Password: Passw0rd!

I brist på tid hann jag tyvärr inte en "register"-endpoint. Men däremot ska login funka.

### Frontend

Jag har även startat upp en frontend där tanken att all logik ska kunna göras via mina backend-endpoints. Då detta inte var ett krav så kommer jag fortsätta bygga på den. Men för tillfället så hämtas alla tasks och visas i respektive spalt efter status. Om tasken har en "assignedTo" så visas även denna. Man kan även "drag and drop" (med hjälp av ett library i npm) mellan spalterna och då ändras status på tasken. Just nu kan vem som helst som testar min frontend byta status på task. Dock i consolen dyker det upp ett "Not authorized"-error. Så alltså är man inte authorized på backend vilket gör att de intar sin ordinare status när man gör en reload på sidan. Alltså reggas ändringen för tillfället inte i databasen.

För att köra både frontend och backend har jag ett script i frontend-mappen (glöm ej `npm install` i backend):

```bash
cd trullo-frontend
npm install
npm run dev:both
```
