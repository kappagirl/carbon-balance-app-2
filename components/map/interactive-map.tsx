"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Maximize2, Filter, X, Info } from "lucide-react"
import dynamic from "next/dynamic"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

  // Filtros
  const [filterClasificacion, setFilterClasificacion] = useState<string[]>([])
  const [filterPerfil, setFilterPerfil] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'balance' | 'perfil'>('balance')
  const [showFilters, setShowFilters] = useState(false)

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

  // const handleExportPDF = () => {
  //   alert("Funcionalidad de exportación PDF en desarrollo")
  // }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Filtrar municipios
  const filteredMunicipalities = municipalities.filter((m) => {
    // Filtro por clasificación
    if (filterClasificacion.length > 0 && !filterClasificacion.includes(m.clasificacion)) {
      return false
    }
    // Filtro por perfil
    if (filterPerfil.length > 0 && !filterPerfil.includes(m.perfil)) {
      return false
    }
    return true
  })

  // Verificar si el municipio seleccionado está en los filtrados
  const isSelectedMunicipalityVisible = selectedMunicipality
    ? filteredMunicipalities.some(m => m.codMunicipio === selectedMunicipality.codMunicipio)
    : false

  // Toggle de clasificación
  const toggleClasificacion = (clasificacion: string) => {
    setFilterClasificacion((prev) =>
      prev.includes(clasificacion) ? prev.filter((c) => c !== clasificacion) : [...prev, clasificacion],
    )
  }

  // Toggle de perfil
  const togglePerfil = (perfil: string) => {
    setFilterPerfil((prev) => (prev.includes(perfil) ? prev.filter((p) => p !== perfil) : [...prev, perfil]))
  }

  return (
    <Card className={`p-4 ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      {/* Controles en una sola línea */}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <Button
          variant={viewMode === 'balance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('balance')}
          className="shrink-0"
        >
          Por Balance
        </Button>
        <Button
          variant={viewMode === 'perfil' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('perfil')}
          className="shrink-0"
        >
          Por Perfil
        </Button>

        {/* Botón de filtros */}
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          className="h-8 shrink-0"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Filtros
          {(filterClasificacion.length > 0 || filterPerfil.length > 0) && (
            <Badge variant={showFilters ? 'outline' : 'secondary'} className="ml-1.5 h-4 px-1 text-[10px]">
              {filterClasificacion.length + filterPerfil.length}
            </Badge>
          )}
        </Button>

        {/* Popover informativo */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Info className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Visualización del Mapa</h4>

              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-medium mb-1">Por Balance (IEC):</p>
                  <ul className="space-y-1 ml-2">
                    <li>• <strong>Sumidero (0-40):</strong> Captura más CO₂ del que emite</li>
                    <li>• <strong>Equilibrio (41-60):</strong> Captura ≈ Emisiones</li>
                    <li>• <strong>Emisor (61-100):</strong> Emite más CO₂ del que captura</li>
                  </ul>
                  <p className="text-muted-foreground mt-1 italic">
                    *IEC es un índice normalizado de 0-100, no son toneladas.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">Por Perfil (Clustering):</p>
                  <ul className="space-y-1 ml-2">
                    <li>• <strong>Agrícola-Ganadero:</strong> Economía rural</li>
                    <li>• <strong>Industrial-Urbano:</strong> Ciudades grandes</li>
                    <li>• <strong>Mixto-Transición:</strong> Economía diversa</li>
                    <li>• <strong>Sumideros Forestales:</strong> Alta cobertura boscosa</li>
                  </ul>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Select de municipio */}
        <div className="flex-1 relative min-w-[180px]">
          <Select
            value={isSelectedMunicipalityVisible ? selectedMunicipality?.municipio : undefined}
            onValueChange={handleMunicipalitySelect}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Seleccionar municipio..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Cargando municipios...
                </SelectItem>
              ) : filteredMunicipalities.length === 0 ? (
                <SelectItem value="empty" disabled>
                  No hay municipios con estos filtros
                </SelectItem>
              ) : (
                filteredMunicipalities.map((municipality) => (
                  <SelectItem key={municipality.codMunicipio} value={municipality.municipio}>
                    {municipality.municipio}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Botón maximizar */}
        <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={toggleFullscreen}>
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Sección expandible de filtros */}
      {showFilters && (
        <div className="mb-3 p-3 border rounded-lg bg-muted/30 space-y-2.5 animate-in slide-in-from-top-2">
          {/* Filtro por Clasificación */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground w-20 shrink-0">Clasificación:</span>
            <div className="flex flex-wrap gap-1.5">
              {['Sumidero', 'Equilibrio', 'Emisor'].map((clasificacion) => (
                <Badge
                  key={clasificacion}
                  variant={filterClasificacion.includes(clasificacion) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs px-2 py-0.5 transition-colors"
                  onClick={() => toggleClasificacion(clasificacion)}
                >
                  {clasificacion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filtro por Perfil */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground w-20 shrink-0">Perfil:</span>
            <div className="flex flex-wrap gap-1.5">
              {['Agrícola-Ganadero', 'Industrial-Urbano', 'Mixto-Transición', 'Sumideros Forestales'].map((perfil) => (
                <Badge
                  key={perfil}
                  variant={filterPerfil.includes(perfil) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs px-2 py-0.5 transition-colors"
                  onClick={() => togglePerfil(perfil)}
                >
                  {perfil}
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              {filteredMunicipalities.length} de {municipalities.length} municipios
            </span>
            {(filterClasificacion.length > 0 || filterPerfil.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setFilterClasificacion([])
                  setFilterPerfil([])
                }}
              >
                <X className="w-3 h-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      )}

      <div
        className={`rounded-lg overflow-hidden relative z-10 ${
          isFullscreen
            ? showFilters
              ? "h-[calc(100%-9rem)]"
              : "h-[calc(100%-5rem)]"
            : "aspect-[4/3]"
        }`}
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
            municipalities={filteredMunicipalities}
            selectedMunicipality={selectedMunicipality}
            onMunicipalityClick={handleMunicipalitySelect}
            viewMode={viewMode}
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          {viewMode === 'balance' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Sumidero (IEC 0-40)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Equilibrio (IEC 41-60)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Emisor (IEC 61-100)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span>Agrícola-Ganadero</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span>Industrial-Urbano</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Mixto-Transición</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Sumideros Forestales</span>
              </div>
            </>
          )}
        </div>
        <div className="text-xs">
          {isLoading ? "Cargando..." : `${filteredMunicipalities.length} de ${municipalities.length} municipios`}
        </div>
      </div>
    </Card>
  )
}
