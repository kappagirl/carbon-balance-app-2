<div align="center">
  
<a href="https://www.canva.com/design/DAG6as54OsI/2qaZDzIoYMY8KwqDUjZKKg/view?utm_content=DAG6as54OsI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=haa642ada9e#1" target="_blank">
<img src="https://github.com/ColectivoHagamos/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono/blob/main/Doc/EcoBalance360.png?r=duu" width="90%" align="center" alt="EcoBalance360"/>
</a>

</br>
</br>

**Mapa Nacional de Captura y Emisiones de Carbono**

Herramienta de analítica territorial para visualizar y simular el balance de carbono en los municipios de Colombia, identificando zonas emisoras y sumideros de CO₂.

[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-green.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Estado](https://img.shields.io/badge/Estado-Producción-brightgreen.svg)]()
[![Google Colab](https://img.shields.io/badge/Colab-Ejecutar%20Notebook-orange.svg)](https://colab.research.google.com/drive/1aRjH__szKk7sYtouJpD1VOlVqytemwbI?usp=sharing)
[![Stack Científico](https://img.shields.io/badge/Librerías-Pandas%20%7C%20NumPy%20%7C%20Matplotlib%20%7C%20Seaborn%20%7C%20Sklearn-purple.svg)]()



**[https://colectivohagamos.com](https://colectivohagamos.com)**

</div>

---

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

## Equipo

<div align="center">
  
<img src="https://github.com/ColectivoHagamos/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono/blob/main/Doc/equipo.png" width="100%" align="center" alt="EcoBalance360"/>
</div>

</br>

Este proyecto fue desarrollado en el marco del reto **EcoBalance360** del concurso **Datos al Ecosistema 2025** organizado por el Ministerio de Tecnologías de la Información y las Comunicaciones de Colombia (MinTIC).


## Soporte

Para soporte técnico o preguntas sobre la aplicación, contacta con el equipo de desarrollo.

---

Desarrollado con 💚 para el futuro sostenible de Santander
