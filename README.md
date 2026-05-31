# 🍺 DrinkTracker — Guía Completa de Instalación y Despliegue

Stack: **Ionic + Angular** (frontend) · **Node.js + Express** (backend) · **MongoDB Atlas** (base de datos) · **Firebase Hosting** (despliegue frontend) · **Firebase Functions / Railway / Render** (backend)

---

## 📁 Estructura del Proyecto

```
drinktracker/
├── backend/          → API REST Node.js + Express + MongoDB
└── frontend/         → App Ionic + Angular
```

---

## ⚙️ PARTE 1 — Backend (Node.js + MongoDB)

### 1.1 Requisitos previos
- Node.js >= 18
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuita)
- npm o yarn

### 1.2 Instalación
```bash
cd backend
npm install
```

### 1.3 Variables de entorno
Crea el archivo `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/drinktracker?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-app.web.app
```

### 1.4 Obtener la URI de MongoDB Atlas
1. Ve a [cloud.mongodb.com](https://cloud.mongodb.com)
2. Crea un cluster gratuito (M0)
3. En **Database Access**: crea usuario y contraseña
4. En **Network Access**: añade `0.0.0.0/0` (para permitir todas las IPs)
5. En **Connect** → **Drivers**: copia la URI de conexión

### 1.5 Ejecutar en desarrollo
```bash
cd backend
npm run dev
```
La API correrá en `http://localhost:3000`

### 1.6 Endpoints de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | ❌ |
| POST | `/api/auth/login` | Login y obtener JWT | ❌ |
| GET | `/api/auth/me` | Perfil del usuario actual | ✅ |
| GET | `/api/drinks/my` | Mis contadores de bebidas | ✅ |
| POST | `/api/drinks/add` | Añadir bebida(s) | ✅ |
| POST | `/api/drinks/reset` | Resetear mis contadores | ✅ |
| GET | `/api/drinks/totals` | Totales globales de todos | ✅ |

---

## ⚙️ PARTE 2 — Frontend (Ionic + Angular)

### 2.1 Requisitos previos
```bash
npm install -g @ionic/cli @angular/cli
```

### 2.2 Instalación
```bash
cd frontend
npm install
```

### 2.3 Configurar la URL del backend
Edita `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  firebaseConfig: { /* ver sección Firebase */ }
};
```

Para producción, edita `environment.prod.ts` con la URL real del backend desplegado.

### 2.4 Ejecutar en desarrollo
```bash
cd frontend
ionic serve
```

### 2.5 Build para producción
```bash
cd frontend
ionic build --prod
```
Los archivos se generan en `frontend/www/`

---

## ⚙️ PARTE 3 — Firebase (Hosting del Frontend)

### 3.1 Instalar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 3.2 Crear proyecto en Firebase
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un nuevo proyecto (ej: `drinktracker-app`)
3. Activa **Authentication** → Email/Password *(opcional, nosotros usamos JWT propio)*
4. En **Project Settings** copia la `firebaseConfig`

### 3.3 Inicializar Firebase en el proyecto
```bash
cd frontend
firebase init hosting
```
Respuestas:
- **Which project?** → selecciona tu proyecto
- **Public directory?** → `www`
- **Single-page app?** → `Yes`
- **Overwrite index.html?** → `No`

### 3.4 Desplegar
```bash
cd frontend
ionic build --prod
firebase deploy --only hosting
```
Tu app estará en `https://<project-id>.web.app`

---

## ⚙️ PARTE 4 — Desplegar el Backend

### Opción A: Railway (recomendado, gratuito)
1. Ve a [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona la carpeta `backend` como root
4. Añade las variables de entorno en Railway Dashboard
5. Railway te da una URL tipo `https://drinktracker-backend.up.railway.app`

### Opción B: Render (gratuito)
1. Ve a [render.com](https://render.com)
2. **New Web Service** → conecta tu repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Añade las variables de entorno

### Opción C: Firebase Functions (dentro del mismo proyecto)
```bash
firebase init functions
# Node.js 18, TypeScript o JS
# Copia el código del backend a functions/
firebase deploy --only functions
```

---

## 📱 PARTE 5 — Build para Android e iOS

### Android
```bash
cd frontend
ionic capacitor add android
ionic capacitor build android
# Abre en Android Studio:
ionic capacitor open android
```

### iOS (requiere Mac + Xcode)
```bash
cd frontend
ionic capacitor add ios
ionic capacitor build ios
ionic capacitor open ios
```

### Actualizar tras cambios
```bash
ionic build --prod
ionic capacitor copy android
ionic capacitor copy ios
```

---

## 🔒 Seguridad en Producción

- Cambia `JWT_SECRET` por una cadena aleatoria larga (mínimo 64 caracteres)
- Restringe `FRONTEND_URL` en el CORS del backend a tu dominio real
- En MongoDB Atlas, restringe las IPs permitidas a las de tu servidor backend
- Activa HTTPS (automático en Firebase Hosting y Railway/Render)

---

## 🐛 Problemas Frecuentes

**CORS error en producción**: asegúrate de que `FRONTEND_URL` en el backend coincide exactamente con tu dominio Firebase.

**JWT inválido**: verifica que `JWT_SECRET` es idéntico en desarrollo y producción.

**MongoDB connection refused**: comprueba que la IP del servidor está en la whitelist de Atlas.

**Ionic build falla**: ejecuta `npm install` y comprueba la versión de Node (>=18).
