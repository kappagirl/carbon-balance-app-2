"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Maximize2 } from "lucide-react"
import dynamic from "next/dynamic"

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

export interface Municipality {
  codMunicipio: number
  municipio: string
  totalPoblacion: number
  emisionesTotales: number
  capturaBosques: number
  balanceCarbono: number
  emisionesPerCapita: number
  balancePerCapita: number
  clasificacion: string
  perfil: string
  latitud: number
  longitud: number
  emisionesEnergia: number
  emisionesIPPU: number
  emisionesAgricultura: number
  emisionesResiduos: number
  emisionesDeforestacion: number
  IEC: number
  cluster: number
  [key: string]: any
}

interface InteractiveMapProps {
  selectedMunicipalityName?: string | null
  onMunicipalitySelect?: (name: string) => void
}

export function InteractiveMap({ selectedMunicipalityName, onMunicipalitySelect }: InteractiveMapProps) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] Fetching municipalities data...")
    setIsLoading(true)
    fetch("/data/santander-data.json")
      .then((res) => {
        console.log("[v0] Response status:", res.status)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        console.log("[v0] Data loaded:", data.length, "municipalities")
        setMunicipalities(data)
        setIsLoading(false)
        if (!selectedMunicipalityName) {
          const bucaramanga = data.find((m: Municipality) => m.municipio === "BUCARAMANGA")
          if (bucaramanga) {
            console.log("[v0] Setting default municipality:", bucaramanga.municipio)
            setSelectedMunicipality(bucaramanga)
            onMunicipalitySelect?.(bucaramanga.municipio)
          }
        }
      })
      .catch((err) => {
        console.error("[v0] Error loading municipalities:", err)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (selectedMunicipalityName && municipalities.length > 0) {
      const municipality = municipalities.find((m) => m.municipio === selectedMunicipalityName)
      if (municipality) {
        setSelectedMunicipality(municipality)
      }
    }
  }, [selectedMunicipalityName, municipalities])

  const handleMunicipalitySelect = useCallback(
    (municipalityName: string) => {
      const municipality = municipalities.find((m) => m.municipio === municipalityName)
      if (municipality) {
        console.log("[v0] Municipality selected:", municipalityName)
        setSelectedMunicipality(municipality)
        onMunicipalitySelect?.(municipalityName)
      }
    },
    [municipalities, onMunicipalitySelect],
  )

  const handleExportPDF = () => {
    alert("Funcionalidad de exportación PDF en desarrollo")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card className={`p-4 ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative z-50">
          <Select value={selectedMunicipality?.municipio} onValueChange={handleMunicipalitySelect}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar municipio..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] z-[100]">
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Cargando municipios...
                </SelectItem>
              ) : municipalities.length === 0 ? (
                <SelectItem value="empty" disabled>
                  No hay datos disponibles
                </SelectItem>
              ) : (
                municipalities.map((municipality) => (
                  <SelectItem key={municipality.codMunicipio} value={municipality.municipio}>
                    {municipality.municipio}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>
      </div>

      <div
        className={`rounded-lg overflow-hidden relative z-10 ${isFullscreen ? "h-[calc(100%-5rem)]" : "aspect-[4/3]"}`}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Cargando mapa...</p>
          </div>
        ) : municipalities.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">No se pudieron cargar los datos</p>
          </div>
        ) : (
          <LeafletMap
            municipalities={municipalities}
            selectedMunicipality={selectedMunicipality}
            onMunicipalityClick={handleMunicipalitySelect}
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Sumidero (Negativo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Equilibrio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Emisor (Positivo)</span>
          </div>
        </div>
        <div className="text-xs">{isLoading ? "Cargando..." : `${municipalities.length} municipios`}</div>
      </div>
    </Card>
  )
}
