# Guía de Configuración - EcoBalance360

## Paso 1: Configurar la API Key de Gemini

La aplicación requiere una API Key de Google Gemini para el análisis con IA.

### Obtener tu API Key (si no la tienes)

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### Configurar en v0

1. En el chat de v0, busca el icono de **configuración** (⚙️) en la barra lateral izquierda
2. Haz clic en **"Vars"** (Variables de entorno)
3. Agrega una nueva variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Pega tu API key (ejemplo: `AIzaSyAQ31ATtS_zWoL-KZzkqqqqZ4ggnWeibtc`)
4. Guarda los cambios
5. La aplicación se recargará automáticamente

## Paso 2: Verificar la instalación

1. Ve a la página `/explorador`
2. Haz clic en cualquier municipio del mapa
3. En el panel lateral, haz clic en **"Analizar con IA"**
4. Si todo está configurado correctamente, verás el análisis generado en pocos segundos

## Solución de problemas

### Error: "API key de Gemini no configurada"

- **Causa**: La variable de entorno no está configurada o tiene un nombre incorrecto
- **Solución**: Verifica que el nombre sea exactamente `GEMINI_API_KEY` (respeta mayúsculas)

### Error: "Invalid API key"

- **Causa**: La API key es incorrecta o ha expirado
- **Solución**: Genera una nueva API key en Google AI Studio

### El análisis no se genera

- **Causa**: Problema de conexión con la API de Gemini
- **Solución**: 
  1. Verifica tu conexión a internet
  2. Revisa que la API key tenga permisos activos
  3. Espera unos segundos y vuelve a intentar

### El mapa no se carga

- **Causa**: Problemas con la librería Leaflet
- **Solución**: Recarga la página (F5)

## Características principales

### Mapa interactivo

- **Marcadores coloreados**:
  - 🟢 Verde = Sumidero de carbono (captura más de lo que emite)
  - 🟡 Amarillo = Equilibrio (emisiones balanceadas)
  - 🔴 Rojo = Emisor neto (emite más de lo que captura)

### Selector de municipios

- Busca municipios por nombre
- Scroll infinito para fácil navegación
- Se centra automáticamente en el municipio seleccionado

### Panel de información

- Datos en tiempo real de cada municipio
- Gráficos de emisiones por fuente
- Indicadores per cápita
- Análisis con IA personalizado

## Datos técnicos

- **87 municipios** de Santander incluidos
- **Datos actualizados** de emisiones y captura
- **Fuentes de emisiones**: Energía, agricultura, deforestación, residuos, IPPU
- **Coordenadas geográficas** precisas de cada municipio

---

¿Necesitas ayuda? Contacta al equipo de desarrollo.
