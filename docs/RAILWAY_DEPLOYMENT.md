# 🚀 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar **Linkeout** en Railway, separando el frontend y backend en servicios independientes.

## 📋 Prerrequisitos

1. **Cuenta en Railway**: [railway.app](https://railway.app)
2. **Cuenta en Supabase**: [supabase.com](https://supabase.com)
3. **API Key de Google Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **Repositorio en GitHub**: Tu código debe estar en un repositorio público o privado

## 🏗️ Estructura del Despliegue

Railway nos permitirá desplegar dos servicios independientes:
- **Frontend**: Aplicación React con Vite
- **Backend**: API Node.js con Express

## 📦 Paso 1: Preparar el Repositorio

### 1.1 Verificar la estructura
```
linkeout/
├── src/                    # Frontend React
├── backend/               # Backend Node.js
├── railway.json          # Configuración Railway Frontend
├── backend/railway.json  # Configuración Railway Backend
├── env.example           # Variables de entorno Frontend
└── backend/env.example   # Variables de entorno Backend
```

### 1.2 Variables de entorno necesarias

#### Frontend (.env)
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_BACKEND_URL=https://tu-backend-service.railway.app
```

#### Backend (.env)
```env
GEMINI_API_KEY=tu_clave_de_gemini
PORT=4000
```

## 🚀 Paso 2: Desplegar el Backend

### 2.1 Crear el servicio Backend
1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu repositorio de GitHub
5. Selecciona la carpeta `backend` como directorio raíz

### 2.2 Configurar variables de entorno
En la configuración del servicio backend:
1. Ve a la pestaña **"Variables"**
2. Agrega las siguientes variables:
   ```
   GEMINI_API_KEY=tu_clave_de_gemini_aqui
   PORT=4000
   ```

### 2.3 Verificar el despliegue
1. Railway detectará automáticamente que es un proyecto Node.js
2. Ejecutará `npm install` y `npm start`
3. El servicio estará disponible en: `https://tu-backend-service.railway.app`

## 🌐 Paso 3: Desplegar el Frontend

### 3.1 Crear el servicio Frontend
1. En el mismo proyecto de Railway, haz clic en **"New Service"**
2. Selecciona **"Deploy from GitHub repo"**
3. Selecciona el mismo repositorio
4. Esta vez selecciona la **carpeta raíz** (no la carpeta backend)

### 3.2 Configurar variables de entorno
En la configuración del servicio frontend:
1. Ve a la pestaña **"Variables"**
2. Agrega las siguientes variables:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   VITE_BACKEND_URL=https://tu-backend-service.railway.app
   ```

### 3.3 Configurar el build
Railway detectará automáticamente que es un proyecto Vite y:
1. Ejecutará `npm install`
2. Ejecutará `npm run build`
3. Servirá los archivos estáticos

## 🔧 Paso 4: Configuración Adicional

### 4.1 Dominios personalizados (Opcional)
1. En cada servicio, ve a la pestaña **"Settings"**
2. En **"Domains"**, puedes agregar dominios personalizados
3. Ejemplo:
   - Frontend: `app.tudominio.com`
   - Backend: `api.tudominio.com`

### 4.2 Variables de entorno compartidas
Si tienes variables que se usan en ambos servicios, puedes:
1. Crear un **"Shared Variable"** en Railway
2. Referenciarlo en ambos servicios

## 🧪 Paso 5: Verificar el Despliegue

### 5.1 Probar el Backend
```bash
curl -X POST https://tu-backend-service.railway.app/api/animo \
  -H "Content-Type: application/json" \
  -d '{"texto":"Estoy gestionando mi búsqueda de empleo","rol":"motivador","nombre":"Usuario"}'
```

### 5.2 Probar el Frontend
1. Visita la URL del frontend
2. Verifica que puedes:
   - Registrarte/Iniciar sesión
   - Crear desahogos
   - Usar la funcionalidad de Ánimo IA
   - Generar retos físicos

## 🔍 Paso 6: Monitoreo y Logs

### 6.1 Ver logs en tiempo real
1. En Railway Dashboard, selecciona tu servicio
2. Ve a la pestaña **"Deployments"**
3. Haz clic en el deployment activo
4. Ve a la pestaña **"Logs"**

### 6.2 Health Checks
Railway automáticamente verificará:
- **Backend**: `GET /api/animo`
- **Frontend**: `GET /`

## 🚨 Solución de Problemas

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Railway

### Error: "Environment variables not found"
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que los nombres coincidan exactamente

### Error: "CORS error"
- El backend ya tiene CORS configurado para aceptar todas las origenes
- Si persiste, verifica que la URL del frontend esté correcta

### Error: "API key invalid"
- Verifica que la clave de Gemini sea válida
- Asegúrate de que tenga los permisos necesarios

## 📊 Paso 7: Optimización

### 7.1 Configurar auto-scaling
1. En Railway, ve a **"Settings"** del servicio
2. Configura **"Auto-scaling"** según tus necesidades

### 7.2 Configurar backups
1. Railway ofrece backups automáticos
2. Configura la frecuencia en **"Settings"**

## 🔄 Actualizaciones

Para actualizar tu aplicación:
1. Haz push a tu repositorio de GitHub
2. Railway detectará automáticamente los cambios
3. Desplegará la nueva versión automáticamente

## 💰 Costos

Railway ofrece:
- **Plan gratuito**: $5 de crédito mensual
- **Plan Pro**: $20/mes con más recursos
- **Plan Team**: Para equipos

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Verifica la documentación de Railway
3. Consulta los issues del repositorio

---

¡Tu aplicación **Linkeout** estará lista para ayudar a desarrolladores a gestionar su búsqueda de empleo! 🚀 