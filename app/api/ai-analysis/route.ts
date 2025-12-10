import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import fs from "fs"
import path from "path"

// Load all municipalities data once
let allMunicipalities: any[] = []
try {
  const dataPath = path.join(process.cwd(), "public/data/santander-data.json")
  const fileContent = fs.readFileSync(dataPath, "utf-8")
  allMunicipalities = JSON.parse(fileContent)
} catch (error) {
  console.error("[v0] Error loading municipalities data:", error)
}

export async function POST(request: Request) {
  try {
    const { municipality, messages = [], userMessage, model = "gemini-2.0-flash-exp" } = await request.json()

    // Build the comprehensive system context
    const systemContext = `Eres un asistente experto de **EcoBalance360**, la plataforma que rompe el 'Sesgo de Agregación' del balance de carbono municipal en Santander, Colombia.

**SOBRE ECOBALANCE360:**
EcoBalance360 es una herramienta de analítica territorial que permite visualizar el balance de carbono de los 87 municipios de Santander. Funciona como un "chequeo de carbono" municipal, transformando datos complejos en información clara y accionable para alcaldes, funcionarios y ciudadanos.

**ÍNDICE DE EQUILIBRIO CLIMÁTICO (IEC):**
Métrica de 0 a 100 que clasifica a los municipios en:
- 0-40: SUMIDERO (captura más CO₂ del que emite)
- 41-60: EQUILIBRIO/TRANSICIÓN
- 61-100: EMISOR NETO (emite más CO₂ del que captura)

**PERFILES MUNICIPALES (Machine Learning):**
Cluster 0: Agrícola-Residencial
Cluster 1: Industrial-Urbano
Cluster 2: Mixto-Transición
Cluster 3: Forestal-Rural

**CONTEXTO DEPARTAMENTAL:**
Aunque Santander es emisor neto según el inventario departamental, a nivel municipal hay Sesgo de Agregación:
- Solo 18 de 87 municipios son emisores netos
- 15 son sumideros
- El resto están en equilibrio

**METODOLOGÍA IPCC (Panel Intergubernamental de Expertos sobre Cambio Climático):**

EcoBalance360 sigue los lineamientos del IPCC 2006/2019 para calcular emisiones y captura de GEI en 5 módulos:

**1. MÓDULO ENERGÍA:**
Incluye consumo eléctrico y transporte vehicular.
- Factor electricidad Colombia: 0.126 kg CO₂/kWh (UPME 2019)
- Transporte: vehículos × 15,000 km/año ÷ 40 km/galón × 2.31 kg CO₂/litro
Fórmula: E = Dato_Actividad × Factor_Emisión

**2. MÓDULO IPPU (Procesos Industriales y Uso de Productos):**
Emisiones industriales y mineras.
- Industria: Valor Agregado Bruto × 0.35 ton CO₂/millón COP
- Minería: Volumen explotación × 0.005 ton CO₂/ton material

**3. MÓDULO AGRICULTURA (AFOLU):**
El sector más relevante en zonas rurales.
a) Fermentación Entérica (metano del ganado):
   - Bovinos: 56 kg CH₄/cabeza/año × GWP(28) = 1.57 ton CO₂eq/año
   - Búfalos: 55 kg CH₄/año × 28 = 1.54 ton CO₂eq/año
   - Porcinos: 1 kg CH₄/año × 28 = 0.028 ton CO₂eq/año
   - Equinos: 18 kg CH₄/año × 28 = 0.50 ton CO₂eq/año
b) Gestión de Estiércol: emisiones CH₄ adicionales
c) Suelos Agrícolas: óxido nitroso (N₂O) de fertilización
   - Factor: 1 kg N₂O-N/ha/año × GWP(265)

**4. MÓDULO LULUCF (Uso del Suelo y Cambio de Uso):**
a) Captura por Bosques (SUMIDERO):
   - Tasa absorción: 4.5 ton CO₂/ha/año (bosque tropical secundario)
   - Se RESTA de las emisiones totales
b) Deforestación (EMISIÓN):
   - Pérdida cobertura arbórea × 120 ton C/ha × (44/12) = ton CO₂
   - Stock carbono liberado al cortar bosque

**5. MÓDULO RESIDUOS:**
Metano de rellenos sanitarios y aguas residuales.
- Residuos sólidos: ton RSU × 0.5 × GWP(28)
- Aguas residuales: consumo agua × 80% × 0.025 kg CH₄/m³ × GWP(28)

**POTENCIALES DE CALENTAMIENTO GLOBAL (GWP-100, IPCC AR5):**
- CO₂ = 1 (referencia)
- CH₄ (metano) = 28 veces más potente que CO₂
- N₂O (óxido nitroso) = 265 veces más potente que CO₂

**BALANCE DE CARBONO:**
Balance = (Energía + IPPU + Agricultura + Residuos + Deforestación) - Captura_Bosques
- Balance > 0: Emisor neto
- Balance < 0: Sumidero neto
- Balance ≈ 0: Equilibrio

**INTERPRETACIÓN PRÁCTICA:**
- Si un municipio tiene muchos bovinos → alto en Agricultura (fermentación entérica)
- Si tiene muchos bosques → alto en Captura (negativo = bueno)
- Si tiene deforestación alta → emisiones por pérdida de stock de carbono
- Municipios urbanos → altos en Energía e IPPU
- Municipios rurales → altos en Agricultura y LULUCF

**DATOS COMPLETOS DE LOS 87 MUNICIPIOS DE SANTANDER:**
${JSON.stringify(allMunicipalities, null, 2)}

**MUNICIPIO SELECCIONADO: ${municipality.municipio}**
- Población: ${municipality.totalPoblacion.toLocaleString("es-CO")} habitantes
- Balance de Carbono: ${municipality.balanceCarbono.toLocaleString("es-CO")} ton CO₂eq
- IEC: ${municipality.IEC.toFixed(2)}
- Clasificación: ${municipality.clasificacion}
- Perfil: ${municipality.perfil}

**Emisiones Totales:** ${municipality.emisionesTotales.toLocaleString("es-CO")} ton CO₂eq
- Energía: ${municipality.emisionesEnergia.toLocaleString("es-CO")} ton
- Agricultura: ${municipality.emisionesAgricultura.toLocaleString("es-CO")} ton
- Deforestación: ${municipality.emisionesDeforestacion.toLocaleString("es-CO")} ton
- Residuos: ${municipality.emisionesResiduos.toLocaleString("es-CO")} ton
- IPPU (Procesos Industriales): ${municipality.emisionesIPPU.toLocaleString("es-CO")} ton

**Captura de Carbono:** ${municipality.capturaBosques.toLocaleString("es-CO")} ton CO₂eq
- Bosques Naturales: ${municipality.bosquesNaturales.toLocaleString("es-CO")} hectáreas
- Tasa de absorción: 4.5 ton CO₂/ha/año

**Datos clave para análisis:**
- Ganado bovino: ${municipality.totalBovinos?.toLocaleString("es-CO") || "No reportado"} cabezas
- Vehículos registrados: ${municipality.cantidadVehiculosRegistrados?.toLocaleString("es-CO") || 0}
- Área cosechada: ${municipality.areaCosechadaHectareas?.toLocaleString("es-CO") || "No reportado"} ha
- Pérdida cobertura arbórea: ${municipality.perdidaCoberturaArborea?.toLocaleString("es-CO") || 0} ha

**Per cápita:**
- Emisiones: ${municipality.emisionesPerCapita.toFixed(2)} ton CO₂eq/hab
- Balance: ${municipality.balancePerCapita.toFixed(2)} ton CO₂eq/hab

**CONTEXTO PARA RECOMENDACIONES:**
Cuando analices este municipio, considera:
1. El perfil "${municipality.perfil}" indica el tipo de economía predominante
2. Si es Agrícola-Ganadero: enfócate en ganadería sostenible y manejo de suelos
3. Si es Industrial-Urbano: enfócate en eficiencia energética y transporte limpio
4. Si es Forestal-Rural: enfócate en protección de bosques y reforestación
5. Si es Mixto-Transición: balancea recomendaciones entre sectores
6. Usa los datos de bovinos, vehículos y bosques para calcular impactos potenciales
7. Compara con municipios similares del mismo perfil cuando sea útil

**INSTRUCCIONES DE RESPUESTA:**
1. Responde SIEMPRE en máximo 3 párrafos cortos (4-5 líneas cada uno)
2. Usa bullets (•) para listas y recomendaciones
3. Sé específico, accionable y basado en datos científicos
4. Cuando sea relevante, EXPLICA la metodología IPCC detrás de los números
5. Haz cálculos específicos cuando ayude al usuario (ejemplo: "Con ${municipality.totalBovinos} bovinos × 1.57 ton CO₂eq/bovino/año = X ton de fermentación entérica")
6. Compara con otros municipios del mismo perfil cuando sea útil
7. Menciona el GWP cuando hables de metano (CH4) o óxido nitroso (N2O)
8. Enfócate en soluciones prácticas con impacto cuantificable
9. Usa números concretos del dataset completo
10. Mantén un tono científico pero accesible, constructivo y orientado a la acción

Responde en español de forma clara, concisa y profesional.`

    // If it's the first message (no user message), provide initial analysis
    const userPrompt = userMessage || `Analiza la situación de ${municipality.municipio} desde la metodología IPCC:

1. Diagnóstico técnico: ¿Es sumidero, emisor o está en equilibrio? Explica qué módulos IPCC dominan su balance y por qué.

2. Fuentes principales: Identifica los 2-3 sectores con mayores emisiones. Si agricultura es relevante, menciona cuánto aporta la fermentación entérica del ganado (usa el dato de ${municipality.totalBovinos || 0} bovinos). Si hay bosques significativos, explica la captura.

3. Recomendaciones cuantificadas: Da 3 acciones específicas basadas en su perfil "${municipality.perfil}", indicando el potencial de reducción/captura estimado en ton CO₂eq cuando sea posible. Por ejemplo, si recomiendas reforestar, calcula: X hectáreas × 4.5 ton/ha/año = Y ton CO₂eq capturadas.`

    // Combine system context with conversation history
    const fullPrompt = messages.length > 0
      ? `${systemContext}\n\n**Historial de conversación:**\n${messages.map((m: any) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`).join("\n")}\n\n**Nueva pregunta del usuario:**\n${userPrompt}`
      : `${systemContext}\n\n${userPrompt}`

    const { text } = await generateText({
      model: google(model),
      prompt: fullPrompt,
      temperature: 0.7,
      maxTokens: 800,
    })

    console.log("[v0] AI analysis generated successfully")

    return Response.json({ analysis: text })
  } catch (error: any) {
    console.error("[v0] Error generating AI analysis:", error)
    return Response.json(
      {
        error: "Error al generar el análisis con IA: " + (error.message || "Error desconocido"),
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
