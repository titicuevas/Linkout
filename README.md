# Linkeout 🚀

**Linkeout** es una plataforma innovadora diseñada para ayudar a las personas a superar el rechazo en candidaturas laborales y mantener una mentalidad positiva durante la búsqueda de empleo.

## ✨ Características Principales

### 🎯 **Ánimo IA**
- Recibe consejos personalizados de diferentes roles (madre, hermano, mejor amigo, motivador, psicólogo, compañero, futuro yo)
- Respuestas generadas por IA usando Google Gemini
- Interfaz intuitiva y empática

### 💪 **Retos Físicos**
- Generación automática de retos físicos personalizados según el puesto y empresa
- Tres niveles de dificultad: Fácil, Medio, Difícil
- Sistema de puntos y motivación
- Ejercicios alternativos para cada reto

### 📝 **Desahógate**
- Espacio seguro para expresar frustraciones
- Sistema de posts anónimos
- Comunidad de apoyo

### 🎯 **Candidaturas**
- Seguimiento de candidaturas enviadas
- Estado de cada aplicación
- Historial organizado

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** con Vite
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Supabase** para base de datos y autenticación
- **SweetAlert2** para notificaciones
- **React Confetti** para celebraciones

### Backend
- **Node.js** con Express
- **Google Gemini AI** para generación de contenido
- **CORS** habilitado para comunicación frontend-backend
- **Axios** para llamadas HTTP

### Base de Datos
- **Supabase** (PostgreSQL)
- Autenticación integrada
- Storage para archivos

## 🚀 Despliegue

### Railway (Recomendado)

#### Frontend
1. Conecta tu repositorio a Railway
2. Configura las variables de entorno:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   VITE_BACKEND_URL=https://tu-backend.railway.app
   ```
3. Railway detectará automáticamente que es un proyecto Vite

#### Backend
1. Crea un nuevo servicio en Railway
2. Configura las variables de entorno:
   ```
   GEMINI_API_KEY=tu_clave_de_gemini
   PORT=4000
   ```
3. Railway ejecutará `npm start` automáticamente

### Variables de Entorno Requeridas

#### Frontend (.env)
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_BACKEND_URL=https://tu-backend.railway.app
```

#### Backend (.env)
```env
GEMINI_API_KEY=tu_clave_de_gemini
PORT=4000
```

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en Supabase
- API Key de Google Gemini

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/linkeout.git
   cd linkeout
   ```

2. **Instala dependencias del frontend**
   ```bash
   npm install
   ```

3. **Instala dependencias del backend**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configura las variables de entorno**
   - Crea `.env` en la raíz del proyecto (frontend)
   - Crea `.env` en la carpeta `backend`

5. **Ejecuta el desarrollo**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   npm run dev
   ```

## 🏗️ Estructura del Proyecto

```
linkeout/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios (Supabase)
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utilidades
├── backend/               # API Node.js
│   └── index.js          # Servidor Express
├── public/               # Archivos estáticos
└── docs/                 # Documentación
```

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Linting del código

### Backend
- `npm start` - Servidor de producción
- `npm run dev` - Servidor de desarrollo con nodemon

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Supabase** por la infraestructura de backend
- **Google Gemini** por la IA generativa
- **Tailwind CSS** por el framework de estilos
- **React** por el framework de frontend

---

**Linkeout** - Transformando el rechazo en oportunidad 💪
