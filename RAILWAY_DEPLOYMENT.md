# Deployment Guide - Railway

## 🚀 Snabbguide

### Steg 1: Deploy Backend

1. Skapa nytt projekt i Railway för backend
2. Sätt miljövariabler (se nedan)
3. Railway bygger och deployar automatiskt
4. **Kopiera backend URL** (t.ex. `https://backend-xxx.up.railway.app`)

### Steg 2: Deploy Frontend

1. Skapa nytt projekt i Railway för frontend
2. Sätt `VITE_API_URL` till din backend URL (från Steg 1)
3. Railway bygger och deployar automatiskt
4. **Kopiera frontend URL** (t.ex. `https://frontend-xxx.up.railway.app`)

### Steg 3: Uppdatera Backend CORS

1. Gå tillbaka till backend-projektet i Railway
2. Lägg till miljövariabel: `FRONTEND_URL=<din-frontend-url>`
3. Backend kommer redeploya automatiskt

✅ Klart! Din app ska nu fungera.

---

## Backend Setup

### 1. Bygg och Deploy Backend

Backend är konfigurerad för CommonJS och Railway deployment:

**Railway kommer automatiskt att köra:**

```bash
npm install
npm run build    # tsc && tsc-alias
npm start        # node dist/index.js
```

### 2. Miljövariabler för Backend (Railway)

Sätt följande miljövariabler i Railway Dashboard för backend-projektet:

```env
MONGODB_URI=din-mongodb-connection-string
JWT_SECRET=din-jwt-secret
JWT_EXPIRES_IN=1h
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://din-frontend.up.railway.app
```

**Viktigt:** `FRONTEND_URL` måste vara din faktiska Railway frontend URL för CORS att fungera.

### 3. Notera Backend URL

Efter deploy, kopiera din Railway backend URL, t.ex.:

```
https://trullo-backend-production.up.railway.app
```

---

## Frontend Setup

### 1. Lokal Utveckling

För lokal utveckling finns en `.env` fil:

```env
VITE_API_URL=http://localhost:3000
```

### 2. Miljövariabler för Frontend (Railway)

I Railway Dashboard för frontend-projektet, sätt:

```env
VITE_API_URL=https://trullo-backend-production.up.railway.app
```

**Viktigt:** Använd din faktiska Railway backend URL (utan trailing slash).

### 3. Deploy Frontend

Railway kommer automatiskt att köra:

```bash
npm install
npm run build
npm run preview  # eller annan serve-command
```

---

## CORS-konfiguration

Se till att backend's CORS-inställningar tillåter din frontend URL:

I `backend/src/index.ts`, uppdatera `corsOptions`:

```typescript
const corsOptions = {
  origin: [
    "http://localhost:5173", // Lokal utveckling
    "https://din-frontend.up.railway.app", // Production
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204,
};
```

---

## Felsökning

### ERR_CONNECTION_REFUSED

- Kontrollera att `VITE_API_URL` är korrekt satt i Railway frontend
- Verifiera att backend faktiskt körs och är tillgänglig

### CORS-fel

- Lägg till frontend URL i backend's CORS whitelist
- Kontrollera att `credentials: true` är satt på både frontend och backend

### 500 Internal Server Error

- Kontrollera Railway logs för backend
- Verifiera att alla miljövariabler är korrekta
- Kolla MongoDB-connection
