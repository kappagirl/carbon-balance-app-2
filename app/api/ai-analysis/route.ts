import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  try {
    const { municipality, messages = [], userMessage } = await request.json()

    console.log("[v0] Starting AI analysis for:", municipality.municipio)

    // Build the system context
    const systemContext = `Eres un experto en análisis ambiental y balance de carbono. Estás conversando sobre el municipio de ${municipality.municipio}, Santander, Colombia.

**Datos del Municipio:**
- Población: ${municipality.totalPoblacion.toLocaleString("es-CO")} habitantes
- Balance de Carbono: ${municipality.balanceCarbono.toLocaleString("es-CO")} ton CO₂eq
- Clasificación: ${municipality.clasificacion}
- Perfil: ${municipality.perfil}

**Emisiones Totales:** ${municipality.emisionesTotales.toLocaleString("es-CO")} ton CO₂eq
- Energía: ${municipality.emisionesEnergia.toLocaleString("es-CO")} ton
- Agricultura: ${municipality.emisionesAgricultura.toLocaleString("es-CO")} ton
- Deforestación: ${municipality.emisionesDeforestacion.toLocaleString("es-CO")} ton
- Residuos: ${municipality.emisionesResiduos.toLocaleString("es-CO")} ton
- IPPU (Procesos Industriales): ${municipality.emisionesIPPU.toLocaleString("es-CO")} ton

**Captura de Carbono:** ${municipality.capturaBosques.toLocaleString("es-CO")} ton CO₂eq (por bosques naturales)

**Emisiones per cápita:** ${municipality.emisionesPerCapita.toFixed(2)} ton CO₂eq/habitante
**Balance per cápita:** ${municipality.balancePerCapita.toFixed(2)} ton CO₂eq/habitante

Responde en español de forma clara, concisa y profesional. Usa un tono constructivo y orientado a soluciones.`

    // If it's the first message (no user message), provide initial analysis
    const userPrompt = userMessage || `Por favor proporciona:
1. Un análisis breve de la situación actual del municipio (2-3 frases)
2. Las 3 principales fuentes de emisiones y por qué son importantes
3. 3 recomendaciones específicas y accionables para mejorar el balance de carbono del municipio`

    // Combine system context with conversation history
    const fullPrompt = messages.length > 0
      ? `${systemContext}\n\n**Historial de conversación:**\n${messages.map((m: any) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`).join("\n")}\n\n**Nueva pregunta del usuario:**\n${userPrompt}`
      : `${systemContext}\n\n${userPrompt}`

    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: fullPrompt,
      temperature: 0.7,
      maxTokens: 1500,
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
