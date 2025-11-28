"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Leaf, TreePine, Zap, Car, Factory, Trash2, TrendingDown, TrendingUp, RotateCcw, Sparkles } from "lucide-react"

interface MunicipalityData {
  municipio: string
  totalPoblacion: number
  emisionesEnergia: number
  emisionesAgricultura: number
  emisionesResiduos: number
  emisionesDeforestacion: number
  emisionesTotales: number
  capturaBosques: number
  balanceCarbono: number
  bosquesNaturales: number
  totalBovinos: number
}

export function InteractiveSimulator() {
  const [municipalitiesData, setMunicipalitiesData] = useState<MunicipalityData[]>([])
  const [loading, setLoading] = useState(true)

  // Variables del simulador
  const [reforestacion, setReforestacion] = useState(0) // hectáreas adicionales
  const [reduccionGanado, setReduccionGanado] = useState(0) // porcentaje
  const [energiaRenovable, setEnergiaRenovable] = useState(0) // porcentaje
  const [transporteLimpio, setTransporteLimpio] = useState(0) // porcentaje
  const [gestionResiduos, setGestionResiduos] = useState(0) // porcentaje
  const [prevenciónDeforestacion, setPrevenciónDeforestacion] = useState(0) // porcentaje

  useEffect(() => {
    fetch("/data/santander-data.json")
      .then((res) => res.json())
      .then((data) => {
        setMunicipalitiesData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Cálculos del simulador
  const simulationResults = useMemo(() => {
    if (municipalitiesData.length === 0) return null

    const totales = municipalitiesData.reduce(
      (acc, m) => ({
        emisionesEnergia: acc.emisionesEnergia + m.emisionesEnergia,
        emisionesAgricultura: acc.emisionesAgricultura + m.emisionesAgricultura,
        emisionesResiduos: acc.emisionesResiduos + m.emisionesResiduos,
        emisionesDeforestacion: acc.emisionesDeforestacion + m.emisionesDeforestacion,
        emisionesTotales: acc.emisionesTotales + m.emisionesTotales,
        capturaBosques: acc.capturaBosques + m.capturaBosques,
        balanceCarbono: acc.balanceCarbono + m.balanceCarbono,
        bosquesNaturales: acc.bosquesNaturales + m.bosquesNaturales,
      }),
      {
        emisionesEnergia: 0,
        emisionesAgricultura: 0,
        emisionesResiduos: 0,
        emisionesDeforestacion: 0,
        emisionesTotales: 0,
        capturaBosques: 0,
        balanceCarbono: 0,
        bosquesNaturales: 0,
      },
    )

    // Calcular reducciones
    const reduccionEnergia = totales.emisionesEnergia * (energiaRenovable / 100)
    const reduccionAgricultura = totales.emisionesAgricultura * (reduccionGanado / 100)
    const reduccionResiduos = totales.emisionesResiduos * (gestionResiduos / 100)
    const reduccionDeforestacion = totales.emisionesDeforestacion * (prevenciónDeforestacion / 100)
    const reduccionTransporte = totales.emisionesEnergia * 0.3 * (transporteLimpio / 100) // 30% de energía es transporte

    // Calcular captura adicional por reforestación (4.5 ton CO2/ha/año promedio)
    const capturaAdicional = reforestacion * 4.5

    const nuevasEmisiones =
      totales.emisionesTotales -
      reduccionEnergia -
      reduccionAgricultura -
      reduccionResiduos -
      reduccionDeforestacion -
      reduccionTransporte

    const nuevaCaptura = totales.capturaBosques + capturaAdicional
    const nuevoBalance = nuevaCaptura - nuevasEmisiones

    const reduccionTotal =
      reduccionEnergia + reduccionAgricultura + reduccionResiduos + reduccionDeforestacion + reduccionTransporte

    return {
      original: totales,
      reduccionEnergia,
      reduccionAgricultura,
      reduccionResiduos,
      reduccionDeforestacion,
      reduccionTransporte,
      capturaAdicional,
      nuevasEmisiones,
      nuevaCaptura,
      nuevoBalance,
      reduccionTotal,
      mejoraPorcentual: ((reduccionTotal + capturaAdicional) / totales.emisionesTotales) * 100,
    }
  }, [
    municipalitiesData,
    reforestacion,
    reduccionGanado,
    energiaRenovable,
    transporteLimpio,
    gestionResiduos,
    prevenciónDeforestacion,
  ])

  const resetSimulation = () => {
    setReforestacion(0)
    setReduccionGanado(0)
    setEnergiaRenovable(0)
    setTransporteLimpio(0)
    setGestionResiduos(0)
    setPrevenciónDeforestacion(0)
  }

  const getEmotionIcon = (balance: number) => {
    if (balance <= -100000) return "🌳"
    if (balance <= -50000) return "😊"
    if (balance <= 0) return "🙂"
    if (balance <= 50000) return "😐"
    if (balance <= 100000) return "😟"
    return "😰"
  }

  const getBalanceColor = (balance: number) => {
    if (balance <= 0) return "text-green-600"
    if (balance <= 50000) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!simulationResults) return null

  return (
    <div className="space-y-6">
      {/* Resultados en tiempo real */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emisiones Actuales</p>
              <p className="text-2xl font-bold">
                {simulationResults.original.emisionesTotales.toLocaleString("es-CO", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-muted-foreground">ton CO₂eq/año</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emisiones Proyectadas</p>
              <p className="text-2xl font-bold">
                {simulationResults.nuevasEmisiones.toLocaleString("es-CO", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-muted-foreground">ton CO₂eq/año</p>
            </div>
          </div>
          {simulationResults.reduccionTotal > 0 && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              -{simulationResults.reduccionTotal.toLocaleString("es-CO", { maximumFractionDigits: 0 })} ton
            </Badge>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance Proyectado</p>
              <p className={`text-2xl font-bold ${getBalanceColor(simulationResults.nuevoBalance)}`}>
                {simulationResults.nuevoBalance > 0 ? "+" : ""}
                {simulationResults.nuevoBalance.toLocaleString("es-CO", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-muted-foreground">ton CO₂eq/año</p>
            </div>
          </div>
          <div className="text-3xl text-center mt-2">{getEmotionIcon(simulationResults.nuevoBalance)}</div>
        </Card>
      </div>

      {/* Controles interactivos */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Estrategias de Mitigación</h2>
          <Button variant="outline" size="sm" onClick={resetSimulation}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        <Tabs defaultValue="reduccion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reduccion">Reducción de Emisiones</TabsTrigger>
            <TabsTrigger value="captura">Captura de Carbono</TabsTrigger>
          </TabsList>

          <TabsContent value="reduccion" className="space-y-6 mt-6">
            {/* Energía Renovable */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Energía Renovable</p>
                    <p className="text-xs text-muted-foreground">Transición a energía limpia</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{energiaRenovable}%</p>
                  {simulationResults.reduccionEnergia > 0 && (
                    <p className="text-xs text-green-600">
                      -{simulationResults.reduccionEnergia.toLocaleString("es-CO", { maximumFractionDigits: 0 })} ton
                    </p>
                  )}
                </div>
              </div>
              <Slider
                value={[energiaRenovable]}
                onValueChange={(value) => setEnergiaRenovable(value[0])}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            {/* Transporte Limpio */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Car className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Transporte Limpio</p>
                    <p className="text-xs text-muted-foreground">Vehículos eléctricos y transporte público</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{transporteLimpio}%</p>
                  {simulationResults.reduccionTransporte > 0 && (
                    <p className="text-xs text-green-600">
                      -{simulationResults.reduccionTransporte.toLocaleString("es-CO", { maximumFractionDigits: 0 })} ton
                    </p>
                  )}
                </div>
              </div>
              <Slider
                value={[transporteLimpio]}
                onValueChange={(value) => setTransporteLimpio(value[0])}
                max={40}
                step={1}
                className="w-full"
              />
            </div>

            {/* Reducción Ganado */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Factory className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Ganadería Sostenible</p>
                    <p className="text-xs text-muted-foreground">Reducción de emisiones agrícolas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{reduccionGanado}%</p>
                  {simulationResults.reduccionAgricultura > 0 && (
                    <p className="text-xs text-green-600">
                      -{simulationResults.reduccionAgricultura.toLocaleString("es-CO", { maximumFractionDigits: 0 })}{" "}
                      ton
                    </p>
                  )}
                </div>
              </div>
              <Slider
                value={[reduccionGanado]}
                onValueChange={(value) => setReduccionGanado(value[0])}
                max={30}
                step={1}
                className="w-full"
              />
            </div>

            {/* Gestión Residuos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Gestión de Residuos</p>
                    <p className="text-xs text-muted-foreground">Reciclaje y compostaje</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{gestionResiduos}%</p>
                  {simulationResults.reduccionResiduos > 0 && (
                    <p className="text-xs text-green-600">
                      -{simulationResults.reduccionResiduos.toLocaleString("es-CO", { maximumFractionDigits: 0 })} ton
                    </p>
                  )}
                </div>
              </div>
              <Slider
                value={[gestionResiduos]}
                onValueChange={(value) => setGestionResiduos(value[0])}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            {/* Prevención Deforestación */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <TreePine className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Prevención de Deforestación</p>
                    <p className="text-xs text-muted-foreground">Conservación de bosques existentes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{prevenciónDeforestacion}%</p>
                  {simulationResults.reduccionDeforestacion > 0 && (
                    <p className="text-xs text-green-600">
                      -{simulationResults.reduccionDeforestacion.toLocaleString("es-CO", { maximumFractionDigits: 0 })}{" "}
                      ton
                    </p>
                  )}
                </div>
              </div>
              <Slider
                value={[prevenciónDeforestacion]}
                onValueChange={(value) => setPrevenciónDeforestacion(value[0])}
                max={80}
                step={1}
                className="w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="captura" className="space-y-6 mt-6">
            {/* Reforestación */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Programa de Reforestación</p>
                    <p className="text-xs text-muted-foreground">Nuevas hectáreas de bosque</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{reforestacion.toLocaleString("es-CO")} ha</p>
                  {simulationResults.capturaAdicional > 0 && (
                    <p className="text-xs text-green-600">
                      +{simulationResults.capturaAdicional.toLocaleString("es-CO", { maximumFractionDigits: 0 })} ton
                      captura
                    </p>
                  )}
                </div>
              </div>
              <Slider
                value={[reforestacion]}
                onValueChange={(value) => setReforestacion(value[0])}
                max={50000}
                step={500}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Captura promedio: 4.5 ton CO₂/ha/año. Total captura adicional:{" "}
                {simulationResults.capturaAdicional.toLocaleString("es-CO", { maximumFractionDigits: 0 })} ton CO₂/año
              </p>
            </div>

            <Card className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-medium">Datos actuales de Santander</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      • Bosques naturales:{" "}
                      {simulationResults.original.bosquesNaturales.toLocaleString("es-CO", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ha
                    </li>
                    <li>
                      • Captura actual:{" "}
                      {simulationResults.original.capturaBosques.toLocaleString("es-CO", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ton CO₂/año
                    </li>
                    <li>
                      • Captura proyectada:{" "}
                      {simulationResults.nuevaCaptura.toLocaleString("es-CO", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ton CO₂/año
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Impacto total */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Impacto Total del Escenario</h3>

          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Reducción de Emisiones</p>
              <p className="text-3xl font-bold text-green-600">
                {simulationResults.reduccionTotal.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground">ton CO₂eq/año</p>
            </div>

            <div className="bg-background rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Mejora Total</p>
              <p className="text-3xl font-bold text-blue-600">
                {simulationResults.mejoraPorcentual.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%
              </p>
              <p className="text-xs text-muted-foreground">respecto a emisiones actuales</p>
            </div>
          </div>

          {simulationResults.nuevoBalance < 0 && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-base px-4 py-2">
              <Leaf className="w-4 h-4 mr-2" />
              ¡Santander se convertiría en un sumidero de carbono!
            </Badge>
          )}
        </div>
      </Card>
    </div>
  )
}
