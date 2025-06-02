# LinkOut 🚀

LinkOut es una aplicación web diseñada para ayudar a desarrolladores junior a gestionar su búsqueda de empleo y mantener una actitud positiva durante el proceso.

## Características principales

- 📝 Gestión de candidaturas
- 😌 Diario emocional con IA
- 💪 Retos físicos para liberar estrés
- 📊 Dashboard con estadísticas
- 🔒 Autenticación segura

## Tecnologías utilizadas

- React + Vite
- Tailwind CSS
- Supabase (Backend y Autenticación)
- Google Gemini API
- Framer Motion

## Requisitos previos

- Node.js 16+
- npm o yarn
- Cuenta en Supabase
- API Key de Google Gemini

## Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/titicuevas/Linkout.git
cd linkout
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del proyecto

```
src/
  ├── components/     # Componentes reutilizables
  ├── pages/         # Páginas de la aplicación
  ├── hooks/         # Custom hooks
  ├── services/      # Servicios (Supabase, Gemini)
  ├── utils/         # Funciones auxiliares
  └── assets/        # Imágenes y recursos
```

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@titicuevas](https://twitter.com/titicuevas)

Link del proyecto: [https://github.com/titicuevas/Linkout](https://github.com/titicuevas/Linkout)
