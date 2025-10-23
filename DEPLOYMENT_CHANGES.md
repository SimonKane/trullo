# Ändringar för Railway Deployment

## Sammanfattning

Fixat `ERR_CONNECTION_REFUSED` felet genom att konfigurera frontend att använda miljövariabler för API URL istället för hårdkodad localhost.

---

## ✅ Ändringar i Frontend

### 1. Ny fil: `trullo-frontend/src/config.ts`

- Exporterar `API_BASE_URL` som läser från `VITE_API_URL` miljövariabel
- Fallback till `http://localhost:3000` för lokal utveckling

### 2. Uppdaterade komponenter (10 API-anrop):

- ✅ `src/auth/LoginPage.tsx` - Login endpoint
- ✅ `src/components/KanbanBoard.tsx` - GET/POST/DELETE/PUT tasks
- ✅ `src/components/EditTaskModal.tsx` - PUT task, GET users
- ✅ `src/components/AddTaskModal.tsx` - GET users
- ✅ `src/components/TaskCard.tsx` - GET user by ID

Alla använder nu `${API_BASE_URL}` istället för `http://localhost:3000`

### 3. Nya miljöfiler:

- `.env` - Lokal utveckling (localhost:3000)
- `.env.example` - Template med instruktioner

---

## ✅ Ändringar i Backend

### 1. Uppdaterad CORS i `backend/src/index.ts`

- Stöder dynamisk origin-validering
- Läser `FRONTEND_URL` från miljövariabler
- Tillåter både localhost och Railway production URL

### 2. Uppdaterad `backend/.env.example`

- Lagt till `FRONTEND_URL` kommentar för CORS

---

## 📋 Railway Deployment Checklist

### Backend miljövariabler (Railway):

```env
MONGODB_URI=<din-mongodb-uri>
JWT_SECRET=<din-secret>
JWT_EXPIRES_IN=1h
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://din-frontend.up.railway.app
```

### Frontend miljövariabler (Railway):

```env
VITE_API_URL=https://din-backend.up.railway.app
```

---

## 🔍 Felsökning

### Om du fortfarande får ERR_CONNECTION_REFUSED:

1. ✅ Kontrollera att `VITE_API_URL` är korrekt satt i Railway (frontend)
2. ✅ Kolla att backend faktiskt körs i Railway logs
3. ✅ Verifiera att backend URL inte har trailing slash

### Om du får CORS-fel:

1. ✅ Sätt `FRONTEND_URL` i backend Railway miljövariabler
2. ✅ Kontrollera att URL:en matchar exakt (inga trailing slashes)
3. ✅ Vänta tills backend redeployat efter miljövariabel-ändring

### Om du får 500 Internal Server Error:

1. ✅ Kolla Railway logs för backend
2. ✅ Verifiera MongoDB connection string
3. ✅ Kontrollera att alla backend miljövariabler är satta

---

## 📚 Dokumentation

Se `RAILWAY_DEPLOYMENT.md` för fullständig deployment-guide.
