# Linkeout 🚀

**Linkeout** es una plataforma innovadora diseñada para ayudar a desarrolladores junior a gestionar su búsqueda de empleo de manera organizada y mantener la motivación durante todo el proceso.

## 🔗 **Enlaces del Proyecto**

- **🌐 Demo en vivo**: https://linkout.up.railway.app/
- **📂 Código fuente**: https://github.com/titicuevas/Linkout
- **👤 Usuario demo**: demo@demo.es / 12345678

---

## ✨ **Nuevas Funcionalidades (v2.0)**

### 🏢 **Logos de Empresas**
- **Logos automáticos**: Se obtienen automáticamente desde Clearbit usando la URL de la empresa
- **Tamaño optimizado**: Logos pequeños (24px) que se integran perfectamente en el diseño
- **Fallback elegante**: Iniciales de la empresa cuando no hay logo disponible
- **Campo opcional**: URL de empresa para obtener logos automáticamente

### 📅 **Sistema de Fechas Mejorado**
- **Fecha de inscripción**: Cuándo se registró la candidatura inicialmente
- **Fecha de actualización**: Se actualiza automáticamente al cambiar el estado
- **Tracking temporal**: Ver el progreso y tiempo en cada fase del proceso
- **Ordenación por fechas**: Ordenar por inscripción o última actualización

### 🎯 **Filtros Visuales Avanzados**
- **Filtros tipo pill**: Botones con iconos y colores vivos para estado y origen
- **Búsqueda inteligente**: Filtro de origen con búsqueda parcial (ej: "email" encuentra "Email")
- **Contador de resultados**: Muestra cuántas candidaturas se están viendo vs total
- **Reset automático**: La página se resetea al cambiar filtros

### 📊 **Dashboard de Estadísticas Visuales**
- **Gráficos interactivos**: Usando Recharts para visualización profesional
- **Múltiples vistas**: Por estado, origen, tipo de trabajo, ubicación y franja salarial
- **Responsive**: Funciona perfectamente en móvil y escritorio
- **Navegación fluida**: Botón para volver a candidaturas desde estadísticas

### 💬 **Feedback de Reclutadores**
- **Campo dedicado**: Para guardar comentarios y feedback recibido
- **Modal accesible**: Visualización en modal en vez de tooltip flotante
- **Experiencia móvil**: Modal funciona perfectamente en dispositivos móviles
- **Edición completa**: Se puede añadir/editar feedback en cualquier momento

### 📱 **Experiencia Móvil Mejorada**
- **Filtros responsive**: Reorganizados en columna para mejor visualización móvil
- **Botones adaptativos**: Tamaños y espaciado optimizados para móvil
- **Tabla optimizada**: Ancho mínimo reducido para mejor visualización
- **Botones flotantes**: Accesibles en móvil y escritorio

### 🔄 **Paginación y Ordenación**
- **Paginador mejorado**: Mayor contraste y visibilidad con anillo de enfoque
- **Ordenación inteligente**: Funciona sobre el array filtrado
- **Paginador condicional**: Solo se muestra cuando hay más de una página
- **Reset de página**: Se resetea automáticamente al cambiar filtros

---

## ✨ Características Principales

### 📊 **Diario de Candidaturas**
- Seguimiento detallado de todas tus candidaturas laborales
- Estados avanzados: Contacto inicial, Entrevista, Prueba técnica, Segunda entrevista, Entrevista final, Contratación, No seleccionado
- Origen de la candidatura: InfoJobs, LinkedIn, Joppy, Tecnoempleo, Email directo, Otros
- Estadísticas motivadoras: Total de candidaturas, Procesos en curso, Contrataciones, No seleccionadas
- Historial organizado y fácil de consultar
- **Logos de empresas** para identificación visual rápida
- **Sistema de fechas dual** para tracking temporal completo

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
- Espacio seguro para expresar experiencias y reflexiones
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
│   │   └── candidaturas/   # Gestión completa de candidaturas
│   │       ├── index.jsx   # Lista principal con filtros y logos
│   │       ├── create.jsx  # Crear nueva candidatura
│   │       └── Estadisticas.jsx # Dashboard de estadísticas
│   ├── services/           # Servicios (Supabase, API, companyLogos)
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
- **Logos de empresas**: Integrados de forma elegante sin sobrecargar la interfaz.

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

## 🗄️ Base de Datos

### Esquema de Candidaturas (Completo)
```sql
create table candidaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  empresa text not null,
  empresa_url text, -- URL de la empresa para obtener logos
  puesto text not null,
  estado text not null, -- entrevista_contacto, prueba_tecnica, segunda_entrevista, entrevista_final, contratacion, rechazado
  fecha date not null, -- fecha de inscripción
  fecha_actualizacion date default current_date, -- fecha de última actualización
  salario_anual integer, -- salario anual en euros
  franja_salarial text, -- rango salarial
  tipo_trabajo text, -- Presencial, Remoto, Híbrido
  ubicacion text, -- ciudad, país
  origen text, -- linkedin, infojobs, joppy, tecnoempleo, correo_directo, otro
  feedback text, -- feedback del reclutador
  created_at timestamp with time zone default now()
);
```

**Ver documentación completa en `/docs/SUPABASE.md`**

---

## 🧑‍💻 Consejos para desarrolladores

- **Personalización**: Cambia colores, textos y animaciones en los archivos de cada página o en los helpers de Tailwind.
- **Nuevas vistas**: Usa el patrón de fondo global y tarjetas con blur/sombra para mantener coherencia.
- **Autenticación**: Usa Supabase para login, registro y gestión de usuarios.
- **Redirecciones**: Gestiona los flujos de bienvenida y dashboard en Welcome.jsx y Home.jsx.
- **Emails**: Personaliza la plantilla de confirmación para que el usuario siempre llegue a `/welcome`.
- **Logos de empresas**: Se obtienen automáticamente desde Clearbit usando la URL de la empresa.
- **Filtros**: Los filtros funcionan con búsqueda parcial y se resetean automáticamente.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** con Vite
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Supabase** para base de datos y autenticación
- **SweetAlert2** para notificaciones
- **React Confetti** para celebraciones
- **Recharts** para gráficos y estadísticas visuales
- **React Paginate** para paginación
- **Clearbit Logo API** para logos de empresas

### Backend
- **Node.js** con Express
- **Google Gemini AI** para generación de contenido
- **CORS** habilitado para comunicación frontend-backend
- **Axios** para llamadas HTTP

### Base de Datos
- **Supabase** (PostgreSQL)
- Autenticación integrada
- Storage para archivos
- Esquema completo para candidaturas

---

## 📦 Instalación Local

1. Clona el repositorio
2. Instala dependencias del frontend y backend
3. Configura las variables de entorno
4. Actualiza la base de datos con el esquema completo
5. Ejecuta ambos servidores (`npm run dev` en frontend y backend)

---

## 📚 Documentación adicional

- Consulta la carpeta `/docs` para guías de despliegue, integración y personalización avanzada.
- Lee los comentarios en cada archivo para entender la lógica y los flujos de usuario.
- **SUPABASE.md**: Guía completa para configurar la base de datos.

---

## 🎮 **Demo en Vivo**

**¡Prueba LinkOut sin registrarte!**

- **🌐 Enlace**: https://linkout.up.railway.app/
- **👤 Usuario demo**: demo@demo.es
- **🔑 Contraseña**: 12345678

### 🎯 **¿Qué puedes probar?**

1. **Diario de Candidaturas**: Organiza y sigue tus aplicaciones laborales con logos y tracking temporal
2. **Dashboard de Estadísticas**: Visualiza tu progreso con gráficos interactivos
3. **Filtros Avanzados**: Filtra por estado, origen y más con interfaz visual
4. **Motivación IA**: Recibe motivación de personajes de anime o roles tradicionales
5. **Retos de Bienestar**: Genera retos personalizados según el puesto y empresa
6. **Desahógate**: Comparte experiencias con otros desarrolladores

---

¡Disfruta y sigue mejorando Linkeout! 💙
