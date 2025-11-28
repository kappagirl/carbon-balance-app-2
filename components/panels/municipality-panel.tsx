"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Leaf, Users, Factory, TreePine, Trash2, Sparkles, Loader2 } from "lucide-react"
import type { Municipality } from "@/components/map/interactive-map"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MunicipalityPanelProps {
  selectedMunicipalityName?: string | null
}

export function MunicipalityPanel({ selectedMunicipalityName }: MunicipalityPanelProps) {
  const [municipality, setMunicipality] = useState<Municipality | null>(null)
  const [allMunicipalities, setAllMunicipalities] = useState<Municipality[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
        // Reset AI analysis when municipality changes
        setAiAnalysis(null)
      }
    }
  }, [selectedMunicipalityName, allMunicipalities])

  const handleAIAnalysis = async () => {
    if (!municipality) return

    setIsAnalyzing(true)
    setIsDialogOpen(true)

    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ municipality }),
      })

      const data = await response.json()

      if (response.ok) {
        setAiAnalysis(data.analysis)
      } else {
        setAiAnalysis("Error al generar el análisis. Por favor, intenta de nuevo.")
      }
    } catch (error) {
      console.error("[v0] Error calling AI analysis:", error)
      setAiAnalysis("Error al conectar con el servicio de IA. Por favor, intenta de nuevo.")
    } finally {
      setIsAnalyzing(false)
    }
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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Análisis de IA - {municipality.municipio}</DialogTitle>
              <DialogDescription>
                Análisis generado por inteligencia artificial basado en los datos de balance de carbono
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Generando análisis...</span>
                </div>
              ) : aiAnalysis ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiAnalysis}</div>
                </div>
              ) : null}
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
