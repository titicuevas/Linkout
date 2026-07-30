# Guía de Despliegue en Railway

Esta guía te ayuda a desplegar **Linkout** en Railway. El frontend es el servicio principal; el backend es **opcional** (solo health-check).

## Prerrequisitos

1. **Cuenta en Railway**: [railway.app](https://railway.app)
2. **Cuenta en Supabase**: [supabase.com](https://supabase.com)
3. **Repositorio en GitHub**: el código debe estar en un repositorio accesible

> Motivación y Retos se generan **en el navegador**, sin API de IA ni clave de Gemini.

## Estructura del Despliegue

- **Frontend** (obligatorio): aplicación React con Vite
- **Backend** (opcional): Express con `GET /` / health-check

## Paso 1: Variables de entorno

### Frontend (`.env`)

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
# Opcional: solo si despliegas el health-check
# VITE_BACKEND_URL=https://tu-backend-service.railway.app
```

### Backend (opcional, `backend/.env`)

```env
CORS_ORIGIN=https://tu-frontend.up.railway.app
PORT=4000
```

## Paso 2: Desplegar el Frontend

1. En [Railway Dashboard](https://railway.app/dashboard) crea un proyecto y conecta el repo de GitHub
2. Usa la **carpeta raíz** como directorio del servicio
3. Configura las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
4. Railway ejecutará `npm install` y `npm run build`, y servirá los estáticos

### Auth / reset de contraseña

En Supabase → Authentication → URL Configuration, añade la Redirect URL de producción:

```
https://tu-frontend.up.railway.app/reset-password
```

## Paso 3: Backend opcional

Si quieres mantener el health-check:

1. Crea otro servicio apuntando a la carpeta `backend`
2. Configura `PORT` y, si quieres, `CORS_ORIGIN`
3. Verifica con:

```bash
curl https://tu-backend-service.railway.app/
```

Los endpoints antiguos de Motivación/Retos responden `410 Gone` a propósito: ya no se usan.

## Paso 4: Verificar el Frontend

1. Visita la URL del frontend
2. Comprueba:
   - Registro / inicio de sesión
   - Candidaturas (incluidas notas personales)
   - Diario personal
   - Motivación y retos (locales, sin backend)

## Solución de Problemas

### Build failed
- Revisa dependencias en `package.json` y logs de build en Railway

### Environment variables not found
- Confirma que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` existen en el servicio frontend

### Reset password no funciona
- Añade `/reset-password` a las Redirect URLs de Supabase Auth

---

¡Con esto **Linkout** queda listo para gestionar la búsqueda de empleo!
