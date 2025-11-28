# EcoBalance360 - Balance de Carbono Municipal de Santander

Aplicación profesional para visualizar y analizar el balance de carbono de los 87 municipios de Santander, Colombia.

## Características principales

- 🗺️ **Mapa interactivo** con Leaflet mostrando todos los municipios
- 📊 **Visualización de datos en tiempo real** (emisiones, captura, balance)
- 🎯 **Selector de municipios** para búsqueda rápida
- 🤖 **Análisis con IA** usando Google Gemini para recomendaciones personalizadas
- 📱 **Diseño responsive** optimizado para móvil y escritorio
- 🎨 **Interfaz profesional** con sistema de diseño moderno

## Configuración de la API Key de Gemini

Para habilitar el análisis con IA, necesitas configurar tu API Key de Google Gemini:

### Opción 1: Variables de entorno en v0 (Recomendado)

1. Ve a la sección **Vars** en la barra lateral del chat en v0
2. Agrega una nueva variable de entorno:
   - **Nombre**: `GEMINI_API_KEY`
   - **Valor**: Tu API key de Google Gemini
3. Guarda los cambios

### Opción 2: Archivo .env.local (Para desarrollo local)

Si descargas el proyecto, crea un archivo `.env.local` en la raíz:

\`\`\`
GEMINI_API_KEY=tu_api_key_aqui
\`\`\`

## Estructura de datos

Los datos de municipios incluyen:

- **Información básica**: Nombre, código DANE, coordenadas, población
- **Emisiones**: Total y desglose por fuente (energía, agricultura, deforestación, residuos, IPPU)
- **Captura de carbono**: Por bosques naturales
- **Balance**: Diferencia entre emisiones y captura
- **Clasificación**: Sumidero, equilibrio o emisor
- **Indicadores per cápita**: Emisiones y balance por habitante

## Tecnologías utilizadas

- **Next.js 16** - Framework de React
- **Leaflet** - Mapas interactivos
- **Google Gemini AI** - Análisis inteligente
- **Tailwind CSS v4** - Estilos
- **shadcn/ui** - Componentes de UI
- **TypeScript** - Tipado estático

## Páginas disponibles

- `/` - Página de inicio con estadísticas generales
- `/explorador` - Mapa interactivo con selector de municipios
- `/simulador` - Simulador de escenarios (próximamente)
- `/juegos` - Juegos educativos (próximamente)
- `/acerca` - Información sobre el proyecto

## Soporte

Para soporte técnico o preguntas sobre la aplicación, contacta con el equipo de desarrollo.

---

Desarrollado con 💚 para el futuro sostenible de Santander
