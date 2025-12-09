"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, TrendingUp, Leaf, Users, Factory, TreePine, Trash2, Sparkles, Loader2, X, Send, ChevronDown, ChevronUp, Download } from "lucide-react"
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

export function MunicipalityPanel({ selectedMunicipalityName }: MunicipalityPanelProps) {
  const [municipality, setMunicipality] = useState<Municipality | null>(null)
  const [allMunicipalities, setAllMunicipalities] = useState<Municipality[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [showPrompt, setShowPrompt] = useState(false)
  const [initialPrompt, setInitialPrompt] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
          } catch (err) {
            console.error("Error loading chat from storage:", err)
            setMessages([])
          }
        } else {
          setMessages([])
        }
        setInitialPrompt("")
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generatePrompt = (municipality: Municipality) => {
    return `Eres un experto en análisis ambiental y balance de carbono. Analiza los siguientes datos del municipio de ${municipality.municipio}, Santander, Colombia:

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

Por favor proporciona:
1. Un análisis breve de la situación actual del municipio (2-3 frases)
2. Las 3 principales fuentes de emisiones y por qué son importantes
3. 3 recomendaciones específicas y accionables para mejorar el balance de carbono del municipio

Responde en español de forma clara, concisa y profesional. Usa un tono constructivo y orientado a soluciones.`
  }

  const handleAIAnalysis = async () => {
    if (!municipality) return

    setIsDialogOpen(true)
    setIsAnalyzing(true)

    const prompt = generatePrompt(municipality)
    setInitialPrompt(prompt)

    // Add system message with the prompt
    const systemMessage: ChatMessage = {
      role: "system",
      content: prompt,
      timestamp: new Date(),
      isPrompt: true,
    }

    setMessages([systemMessage])

    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ municipality, messages: [] }),
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
          content: "Error al generar el análisis. Por favor, intenta de nuevo.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("[v0] Error calling AI analysis:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Error al conectar con el servicio de IA. Por favor, intenta de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAnalyzing(false)
    }
  }

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
      inputRef.current?.focus()
    }
  }

  const handleExportHTML = async () => {
    if (!municipality) return

    const { marked } = await import("marked")

    const chatMessages = await Promise.all(
      messages
        .filter((m) => !m.isPrompt)
        .map(async (m) => {
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
          <DialogContent className="max-w-6xl h-[85vh] p-0 flex flex-col gap-0">
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <DialogTitle className="text-xl font-bold">Chat de Análisis - {municipality.municipio}</DialogTitle>
                </div>
                <DialogDescription className="text-sm">
                  Conversación con IA sobre el balance de carbono del municipio
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handleExportHTML}
                  disabled={messages.filter((m) => !m.isPrompt).length === 0}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Exportar Chat
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Municipality Info Card */}
            <div className="px-6 pt-4">
              <Card className="p-4 bg-muted/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Ranking</div>
                    <div className="font-semibold">#{ranking} de 87</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Balance</div>
                    <div className={`font-semibold ${balanceColor}`}>
                      {balanceSign}
                      {formatNumber(municipality.balanceCarbono)} ton
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Emisiones</div>
                    <div className="font-semibold text-rose-600">{formatNumber(municipality.emisionesTotales)} ton</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Captura</div>
                    <div className="font-semibold text-emerald-600">{formatNumber(municipality.capturaBosques)} ton</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.isPrompt ? (
                    // Collapsible Prompt
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
                        <Card className="mt-2 p-4 bg-muted/30">
                          <div className="prose prose-xs dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                          </div>
                        </Card>
                      )}
                    </div>
                  ) : (
                    // Regular Messages
                    <div
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.role === "assistant" && <Sparkles className="w-4 h-4 text-primary" />}
                          <span className="text-xs font-semibold">
                            {message.role === "user" ? "Tú" : "Asistente IA"}
                          </span>
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString("es-CO", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg p-4 bg-muted">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Generando respuesta...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-background border-t px-6 py-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Escribe tu pregunta sobre el municipio..."
                  disabled={isAnalyzing}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isAnalyzing || !userInput.trim()} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Presiona Enter para enviar, Shift+Enter para nueva línea
              </p>
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
