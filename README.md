# Linkeout 🚀

**Linkeout** es una plataforma innovadora diseñada para ayudar a desarrolladores junior a gestionar su búsqueda de empleo de manera organizada y mantener la motivación durante todo el proceso.

## 🔗 **Enlaces del Proyecto**

- **🌐 Demo en vivo**: https://linkout.up.railway.app/
- **📂 Código fuente**: https://github.com/titicuevas/Linkout
- **👤 Usuario demo**: demo@demo.es / 12345678

---

## ✨ Cambios y mejoras recientes

- **Rediseño visual completo**: Todas las vistas principales y secundarias han sido modernizadas con gradientes, tarjetas con blur y sombra, iconos grandes y colores vivos.
- **Fondo global unificado**: Se aplica un gradiente consistente en toda la app para coherencia visual.
- **Panel principal (Index)**: Títulos grandes con gradiente, tarjetas animadas y mensajes motivadores.
- **Formularios y vistas**: Inputs, selects y botones mejorados, con feedback visual y animaciones suaves.
- **Responsive avanzado**: Todas las vistas adaptadas a móvil y escritorio.
- **Redirección tras confirmación de correo**: El flujo de bienvenida es natural y sin parpadeos, mostrando el Welcome solo cuando corresponde.
- **Gestión de CORS y variables de entorno**: Documentado y corregido para despliegue en Railway.
- **Mensajes y textos**: Más cálidos, motivadores y empáticos.
- **Nuevo enfoque**: Transformado en un diario de búsqueda de empleo profesional con seguimiento detallado de candidaturas.

---

## ✨ Características Principales

### 📊 **Diario de Candidaturas**
- Seguimiento detallado de todas tus candidaturas laborales
- Estados avanzados: Contacto inicial, Entrevista, Prueba técnica, Segunda entrevista, Entrevista final, Contratación, Rechazo
- Origen de la candidatura: InfoJobs, LinkedIn, Joppy, Tecnoempleo, Email directo, Otros
- Estadísticas motivadoras: Total de candidaturas, Procesos en curso, Contrataciones, Rechazos
- Historial organizado y fácil de consultar

### 🎯 **Motivación IA**
- Recibe consejos personalizados de diferentes roles (madre, hermano, mejor amigo, motivador, psicólogo, compañero, futuro yo)
- **¡NUEVO!** Personajes de anime con historias inspiradoras (Goku, Naruto, Luffy, Asta, Deku, Tanjiro, Itadori, Gojo)
- Respuestas generadas por IA usando Google Gemini
- Interfaz intuitiva y empática con iconos y colores temáticos

### 💪 **Retos de Bienestar**
- Generación automática de retos físicos personalizados según el puesto y empresa
- Tres niveles de dificultad: Fácil, Medio, Difícil
- Sistema de puntos y motivación
- Ejercicios alternativos para cada reto

### 📝 **Desahógate**
- Espacio seguro para expresar frustraciones y experiencias
- Sistema de posts anónimos
- Comunidad de apoyo entre desarrolladores

### 🎌 **Personajes de Anime**
- **Goku (Dragon Ball)**: Espíritu de lucha inquebrantable y superación de límites 🌀
- **Naruto Uzumaki**: Determinación y creencia en los sueños ⚡
- **Monkey D. Luffy (One Piece)**: Libertad y espíritu aventurero 🎩
- **Asta (Black Clover)**: Trabajo duro y nunca rendirse 🐂
- **Deku (My Hero Academia)**: Espíritu de héroe y crecimiento 💚
- **Tanjiro (Demon Slayer)**: Compasión y perseverancia 🔥
- **Itadori (Jujutsu Kaisen)**: Optimismo y protección 💖
- **Gojo (Jujutsu Kaisen)**: Confianza y poder absoluto 👁️

---

## 🏗️ Estructura del Proyecto

```
linkeout/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables (Navbar, Footer, Layout, Modal...)
│   ├── pages/              # Páginas principales y subcarpetas (candidaturas, desahogate, animoia, retos)
│   ├── services/           # Servicios (Supabase, API)
│   ├── styles/             # Helpers de Tailwind y estilos globales
│   └── utils/              # Utilidades y validadores
├── backend/                # API Node.js (Express)
│   └── index.js            # Servidor Express y endpoints
├── public/                 # Archivos estáticos
├── docs/                   # Documentación de despliegue y uso
└── README.md               # Este archivo
```

---

## 🔑 Flujo de autenticación y bienvenida

- **Registro/Login**: Usando Supabase Auth.
- **Confirmación de correo**: El usuario recibe un email con un enlace que redirige a `/welcome`.
- **Welcome como middleware**: Si el usuario viene de confirmación, ve el Welcome aunque esté autenticado. Si accede manualmente y ya está logueado, va al dashboard.
- **Redirección automática**: El usuario nunca ve el Home tras confirmar, solo Welcome y luego el panel principal.

---

## 🎨 Gestión de fondos y diseño

- **Fondo global**: Gradiente aplicado en todas las vistas principales y subcarpetas.
- **Tarjetas**: Blur, sombra profunda y colores vivos según la sección.
- **Animaciones**: Entrada suave de tarjetas, botones y feedback visual.
- **Botones**: Modernos, grandes y con efectos de hover.

---

## 🚀 Despliegue y variables de entorno

### Frontend (.env)
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_BACKEND_URL=https://linkoutbackend.up.railway.app
```

### Backend (.env)
```
GEMINI_API_KEY=tu_clave_de_gemini
PORT=4000
```

- **CORS**: Configurado en el backend para aceptar peticiones del frontend en Railway.
- **Railway**: Despliegue independiente de frontend y backend, con variables de entorno separadas.

---

## 🧑‍💻 Consejos para desarrolladores

- **Personalización**: Cambia colores, textos y animaciones en los archivos de cada página o en los helpers de Tailwind.
- **Nuevas vistas**: Usa el patrón de fondo global y tarjetas con blur/sombra para mantener coherencia.
- **Autenticación**: Usa Supabase para login, registro y gestión de usuarios.
- **Redirecciones**: Gestiona los flujos de bienvenida y dashboard en Welcome.jsx y Home.jsx.
- **Emails**: Personaliza la plantilla de confirmación para que el usuario siempre llegue a `/welcome`.

---

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

---

## 📦 Instalación Local

1. Clona el repositorio
2. Instala dependencias del frontend y backend
3. Configura las variables de entorno
4. Ejecuta ambos servidores (`npm run dev` en frontend y backend)

---

## 📚 Documentación adicional

- Consulta la carpeta `/docs` para guías de despliegue, integración y personalización avanzada.
- Lee los comentarios en cada archivo para entender la lógica y los flujos de usuario.

---

## 🎮 **Demo en Vivo**

**¡Prueba LinkOut sin registrarte!**

- **🌐 Enlace**: https://linkout.up.railway.app/
- **👤 Usuario demo**: demo@demo.es
- **🔑 Contraseña**: 12345678

### 🎯 **¿Qué puedes probar?**

1. **Diario de Candidaturas**: Organiza y sigue tus aplicaciones laborales
2. **Motivación IA**: Recibe motivación de personajes de anime o roles tradicionales
3. **Retos de Bienestar**: Genera retos personalizados según el puesto y empresa
4. **Desahógate**: Comparte experiencias con otros desarrolladores

---

¡Disfruta y sigue mejorando Linkeout! 💙
