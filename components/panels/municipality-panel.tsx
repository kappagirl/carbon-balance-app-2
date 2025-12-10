"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, TrendingUp, Leaf, Users, Factory, TreePine, Trash2, Sparkles, Loader2, X, Send, Download, Settings2, ChevronDown, ChevronUp } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Municipality } from "@/components/map/interactive-map"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MunicipalityPanelProps {
  selectedMunicipalityName?: string | null
}

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isPrompt?: boolean
}

const GEMINI_MODELS = [
  { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Experimental)", free: true },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", free: true },
  { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash-8B", free: true },
]

const SUGGESTED_QUESTIONS = [
  "¿Cuáles son las principales fuentes de emisiones?",
  "Dame 3 recomendaciones para reducir emisiones",
  "¿Cómo se compara con otros municipios?",
  "¿Qué acciones aumentan la captura de carbono?",
]

export function MunicipalityPanel({ selectedMunicipalityName }: MunicipalityPanelProps) {
  const [municipality, setMunicipality] = useState<Municipality | null>(null)
  const [allMunicipalities, setAllMunicipalities] = useState<Municipality[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS[0].id)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch("/data/santander-data.json")
      .then((res) => res.json())
      .then((data: Municipality[]) => {
        setAllMunicipalities(data)
        if (!selectedMunicipalityName) {
          const bucaramanga = data.find((m) => m.municipio === "BUCARAMANGA")
          if (bucaramanga) setMunicipality(bucaramanga)
        }
      })
      .catch((err) => console.error("[v0] Error loading municipality data:", err))
  }, [])

  useEffect(() => {
    if (selectedMunicipalityName && allMunicipalities.length > 0) {
      const selected = allMunicipalities.find((m) => m.municipio === selectedMunicipalityName)
      if (selected) {
        setMunicipality(selected)

        const storageKey = `chat_${selected.codMunicipio}`
        const savedMessages = sessionStorage.getItem(storageKey)

        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages)
            const messagesWithDates = parsed.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }))
            setMessages(messagesWithDates)
            setHasInitialized(messagesWithDates.length > 0)
          } catch (err) {
            console.error("Error loading chat from storage:", err)
            setMessages([])
            setHasInitialized(false)
          }
        } else {
          setMessages([])
          setHasInitialized(false)
        }
      }
    }
  }, [selectedMunicipalityName, allMunicipalities])

  useEffect(() => {
    if (municipality && messages.length > 0) {
      const storageKey = `chat_${municipality.codMunicipio}`
      sessionStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, municipality])

  useEffect(() => {
    // Only auto-scroll if there are user messages (not just initial system + assistant)
    if (messages.length > 2 || messages.some(m => m.role === "user")) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleAIAnalysis = async () => {
    if (!municipality) return
    setIsDialogOpen(true)
  }

  useEffect(() => {
    if (isDialogOpen && !hasInitialized && municipality && messages.length === 0) {
      const generateInitialAnalysis = async () => {
        setIsAnalyzing(true)

        // Build the system prompt (same as in the API)
        const systemPrompt = `Eres un experto en análisis ambiental y balance de carbono. Estás conversando sobre el municipio de ${municipality.municipio}, Santander, Colombia.

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

        try {
          const response = await fetch("/api/ai-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ municipality, messages: [], model: selectedModel }),
          })

          const data = await response.json()

          if (response.ok) {
            const systemMessage: ChatMessage = {
              role: "system",
              content: systemPrompt,
              timestamp: new Date(),
              isPrompt: true,
            }
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: data.analysis,
              timestamp: new Date(),
            }
            setMessages([systemMessage, assistantMessage])
            setHasInitialized(true)
          }
        } catch (error) {
          console.error("Error generating initial analysis:", error)
        } finally {
          setIsAnalyzing(false)
        }
      }

      generateInitialAnalysis()
    }
  }, [isDialogOpen, hasInitialized, municipality, messages.length, selectedModel])

  const handleSendMessage = async () => {
    if (!userInput.trim() || !municipality || isAnalyzing) return

    const userMessage: ChatMessage = {
      role: "user",
      content: userInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setUserInput("")
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          municipality,
          messages: messages.filter((m) => !m.isPrompt).map((m) => ({ role: m.role, content: m.content })),
          userMessage: userInput,
          model: selectedModel,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.analysis,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Error al generar la respuesta. Por favor, intenta de nuevo.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Error al conectar con el servicio de IA. Por favor, intenta de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAnalyzing(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (question: string) => {
    setUserInput(question)
    textareaRef.current?.focus()
  }

  const handleExportHTML = async () => {
    if (!municipality) return

    const { marked } = await import("marked")

    const chatMessages = await Promise.all(
      messages.map(async (m) => {
          const role = m.role === "user" ? "Usuario" : "Asistente IA"
          const messageClass = m.role === "user" ? "user" : ""
          const content = await marked.parse(m.content)
          return `
    <div class="message ${messageClass}">
        <div class="message-label">${role}</div>
        <div class="message-content">${content}</div>
    </div>`
        })
    ).then(msgs => msgs.join("\n"))

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>EcoBalance360 - Chat - ${municipality.municipio}</title>
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background: #fff;
        color: #000;
    }
    .header {
        border-bottom: 2px solid #10b981;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }
    .title {
        font-size: 24px;
        font-weight: bold;
        color: #000;
    }
    .subtitle {
        font-size: 14px;
        color: #666;
        margin-top: 5px;
    }
    .municipality-info {
        background: #f5f5f5;
        border: 2px solid #10b981;
        padding: 20px;
        margin-bottom: 20px;
    }
    .municipality-name {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #000;
    }
    .info-row {
        margin: 10px 0;
        padding: 10px;
        background: #fff;
        border-left: 3px solid #10b981;
    }
    .info-label {
        font-size: 10px;
        text-transform: uppercase;
        color: #666;
    }
    .info-value {
        font-size: 16px;
        font-weight: bold;
        color: #000;
    }
    .positive {
        color: #dc2626;
    }
    .negative {
        color: #059669;
    }
    .chat-section {
        margin-top: 20px;
    }
    .chat-header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #000;
    }
    .message {
        margin: 15px 0;
        padding: 15px;
        background: #f5f5f5;
        border-left: 4px solid #10b981;
    }
    .message.user {
        background: #e3f2fd;
        border-left-color: #3b82f6;
    }
    .message-label {
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        color: #666;
        margin-bottom: 5px;
    }
    .message-content {
        font-size: 14px;
        line-height: 1.6;
        color: #000;
    }
    .message-content p {
        margin: 8px 0;
    }
    .message-content ul,
    .message-content ol {
        margin: 8px 0;
        padding-left: 20px;
    }
    .message-content li {
        margin: 4px 0;
    }
    .message-content strong {
        font-weight: bold;
    }
    .message-content em {
        font-style: italic;
    }
    .message-content code {
        background: #f0f0f0;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
    }
    .message-content pre {
        background: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
    }
    .message-content h1,
    .message-content h2,
    .message-content h3 {
        margin: 12px 0 8px 0;
        font-weight: bold;
    }
    .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #e5e5e5;
        text-align: center;
        font-size: 12px;
        color: #666;
    }
    @media print {
        body {
            padding: 10mm;
        }
        .message {
            page-break-inside: avoid;
        }
        .municipality-info {
            page-break-after: avoid;
        }
    }
    @page {
        size: A4;
        margin: 15mm;
    }
</style>
</head>
<body>

<div class="header">
    <div class="title">EcoBalance360 - Reporte de Conversación</div>
    <div class="subtitle">Balance de Carbono Municipal</div>
</div>

<div class="municipality-info">
    <div class="municipality-name">${municipality.municipio}</div>

    <div class="info-row">
        <div class="info-label">Ranking</div>
        <div class="info-value">#{ranking} de 87</div>
    </div>

    <div class="info-row">
        <div class="info-label">Balance de Carbono</div>
        <div class="info-value ${municipality.balanceCarbono > 0 ? "positive" : "negative"}">
            ${balanceSign}${formatNumber(municipality.balanceCarbono)} ton CO₂eq
        </div>
    </div>

    <div class="info-row">
        <div class="info-label">Emisiones Totales</div>
        <div class="info-value positive">${formatNumber(municipality.emisionesTotales)} ton</div>
    </div>

    <div class="info-row">
        <div class="info-label">Captura de Bosques</div>
        <div class="info-value negative">${formatNumber(municipality.capturaBosques)} ton</div>
    </div>
</div>

<div class="chat-section">
    <div class="chat-header">Conversación con Asistente de IA</div>
    ${chatMessages || '<p style="text-align: center; color: #999;">No hay mensajes</p>'}
</div>

<div class="footer">
    <strong>EcoBalance360</strong> - Colectivo HAGAMOS<br>
    Mapa Nacional de Captura y Emisiones de Carbono<br>
    Datos al Ecosistema 2025 - MinTIC Colombia<br>
    Generado el ${new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
</div>

</body>
</html>`

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `EcoBalance360_Chat_${municipality.municipio}_${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!municipality) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Cargando datos...</div>
      </Card>
    )
  }

  const sortedByBalance = [...allMunicipalities].sort((a, b) => b.balanceCarbono - a.balanceCarbono)
  const ranking = sortedByBalance.findIndex((m) => m.codMunicipio === municipality.codMunicipio) + 1

  const formatNumber = (num: number) => {
    return num.toLocaleString("es-CO", { maximumFractionDigits: 0 })
  }

  const balanceSign = municipality.balanceCarbono > 0 ? "+" : ""
  const balanceColor = municipality.balanceCarbono > 0 ? "text-rose-600" : "text-emerald-600"

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">{municipality.municipio}</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className={`font-semibold ${balanceColor}`}>
                {balanceSign}
                {formatNumber(municipality.balanceCarbono)} ton CO₂eq
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Clasificación</span>
              <span className="font-semibold">
                {municipality.clasificacion === "Sumidero" && "🌲 Sumidero"}
                {municipality.clasificacion === "Equilibrio" && "⚖️ Equilibrio"}
                {municipality.clasificacion === "Emisor" && "🏭 Emisor"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Ranking</span>
              <span className="font-semibold">#{ranking} de 87</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Perfil</span>
              <span className="font-semibold">{municipality.perfil}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span className="text-xs text-muted-foreground">Emisiones</span>
            </div>
            <div className="text-lg font-bold">{formatNumber(municipality.emisionesTotales)}</div>
            <div className="text-xs text-muted-foreground">ton CO₂eq</div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Captura</span>
            </div>
            <div className="text-lg font-bold">{formatNumber(municipality.capturaBosques)}</div>
            <div className="text-xs text-muted-foreground">ton CO₂eq</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold mb-3">Emisiones por fuente:</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-muted-foreground" />
              <span>Energía</span>
            </div>
            <span className="font-medium">{formatNumber(municipality.emisionesEnergia)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>Agricultura</span>
            </div>
            <span className="font-medium">{formatNumber(municipality.emisionesAgricultura)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-muted-foreground" />
              <span>Deforestación</span>
            </div>
            <span className="font-medium">{formatNumber(municipality.emisionesDeforestacion)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-muted-foreground" />
              <span>Residuos</span>
            </div>
            <span className="font-medium">{formatNumber(municipality.emisionesResiduos)}</span>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={handleAIAnalysis}>
              <Sparkles className="w-4 h-4 mr-2" />
              Analizar con IA
            </Button>
          </DialogTrigger>
          <DialogContent className="!w-[100vw] sm:!w-[90vw] md:!w-[85vw] !max-w-[1400px] h-[100dvh] sm:h-[92vh] p-0 flex flex-col overflow-hidden sm:rounded-lg" showCloseButton={false}>
            <div className="flex-shrink-0 bg-background border-b">
              <div className="px-3 md:px-6 py-3">
                {/* Primera línea: Título y botón cerrar */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <DialogTitle className="text-base md:text-lg font-bold truncate">{municipality.municipio}</DialogTitle>
                      <DialogDescription className="text-xs truncate">
                        Ranking #{ranking} · {balanceSign}{formatNumber(municipality.balanceCarbono)} ton CO₂eq
                      </DialogDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Segunda línea: Controles */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="h-8 w-full sm:w-[220px] text-xs">
                      <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GEMINI_MODELS.map((model) => (
                        <SelectItem key={model.id} value={model.id} className="text-xs">
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={handleExportHTML}
                    disabled={messages.length === 0}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.isPrompt ? (
                    <div className="mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPrompt(!showPrompt)}
                        className="w-full justify-between text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3" />
                          Prompt del sistema
                        </span>
                        {showPrompt ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </Button>
                      {showPrompt && (
                        <Card className="mt-2 p-3 md:p-4 bg-muted/30">
                          <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                          </div>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[95%] sm:max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                  {index === 1 && message.role === "assistant" && messages.length === 2 && (
                    <div className="flex flex-col items-center py-6 space-y-3">
                      <p className="text-xs md:text-sm text-muted-foreground">Continúa la conversación:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 w-full max-w-2xl">
                        {SUGGESTED_QUESTIONS.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(question)}
                            className="text-left p-3 md:p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-sm"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-2 md:py-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs md:text-sm">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 bg-background border-t safe-area-bottom">
              <div className="px-3 md:px-6 py-3">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground mb-2">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Google Gemini (Gratuito) · Enter enviar · Shift+Enter línea</span>
                </div>
                <div className="flex gap-2 items-end">
                  <Textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu pregunta..."
                    disabled={isAnalyzing}
                    className="flex-1 min-h-[48px] md:min-h-[60px] max-h-[120px] md:max-h-[200px] resize-none text-sm"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isAnalyzing || !userInput.trim()}
                    size="icon"
                    className="h-[48px] w-[48px] md:h-[60px] md:w-[60px] flex-shrink-0"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="p-4 rounded-lg bg-muted/30 text-sm">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Población</div>
              <div className="font-semibold">{formatNumber(municipality.totalPoblacion)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Per cápita</div>
              <div className="font-semibold">{municipality.balancePerCapita.toFixed(2)} ton</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
