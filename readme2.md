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
