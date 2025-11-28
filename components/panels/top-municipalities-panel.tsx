"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { Municipality } from "@/components/map/interactive-map"

interface TopMunicipalitiesPanelProps {
  onMunicipalitySelect?: (name: string) => void
}

export function TopMunicipalitiesPanel({ onMunicipalitySelect }: TopMunicipalitiesPanelProps) {
  const [topSumideros, setTopSumideros] = useState<Municipality[]>([])
  const [topEmisores, setTopEmisores] = useState<Municipality[]>([])

  useEffect(() => {
    fetch("/data/santander-data.json")
      .then((res) => res.json())
      .then((data: Municipality[]) => {
        // Top 5 Sumideros (lowest carbon balance - most negative)
        const sumideros = [...data]
          .filter((m) => m.balanceCarbono < 0)
          .sort((a, b) => a.balanceCarbono - b.balanceCarbono)
          .slice(0, 5)
        setTopSumideros(sumideros)

        // Top 5 Emisores (highest carbon balance - most positive)
        const emisores = [...data]
          .filter((m) => m.balanceCarbono > 0)
          .sort((a, b) => b.balanceCarbono - a.balanceCarbono)
          .slice(0, 5)
        setTopEmisores(emisores)
      })
      .catch((err) => console.error("[v0] Error loading municipalities:", err))
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString("es-CO", { maximumFractionDigits: 0 })
  }

  const handleMunicipalityClick = (municipalityName: string) => {
    onMunicipalitySelect?.(municipalityName)
    // Scroll to top to see the map
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Top 5 Sumideros</h3>
            <p className="text-sm text-muted-foreground">Mayor captura de carbono</p>
          </div>
        </div>
        <div className="space-y-3">
          {topSumideros.map((municipality, index) => (
            <button
              key={municipality.codMunicipio}
              onClick={() => handleMunicipalityClick(municipality.municipio)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{municipality.municipio}</div>
                  <div className="text-xs text-muted-foreground">{municipality.perfil}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">{formatNumber(municipality.balanceCarbono)}</div>
                <div className="text-xs text-muted-foreground">ton CO₂eq</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-rose-500/10">
            <TrendingUp className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Top 5 Emisores</h3>
            <p className="text-sm text-muted-foreground">Mayor emisión de carbono</p>
          </div>
        </div>
        <div className="space-y-3">
          {topEmisores.map((municipality, index) => (
            <button
              key={municipality.codMunicipio}
              onClick={() => handleMunicipalityClick(municipality.municipio)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/20 text-rose-700 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{municipality.municipio}</div>
                  <div className="text-xs text-muted-foreground">{municipality.perfil}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-rose-600">+{formatNumber(municipality.balanceCarbono)}</div>
                <div className="text-xs text-muted-foreground">ton CO₂eq</div>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
