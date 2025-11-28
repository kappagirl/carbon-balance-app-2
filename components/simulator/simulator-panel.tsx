"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Leaf, Cog as Cow, Zap, Car, Factory, Home } from "lucide-react"

export function SimulatorPanel() {
  const [reforestacion, setReforestacion] = useState(0)
  const [ganado, setGanado] = useState(0)
  const [energia, setEnergia] = useState(0)
  const [transporte, setTransporte] = useState(0)
  const [industrias, setIndustrias] = useState(0)
  const [vehiculos, setVehiculos] = useState(0)
  const [poblacion, setPoblacion] = useState(0)

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-4">Simulador de Escenarios</h3>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Mitigation Column */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-green-700 mb-2">Mitigación</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium">Reforestación</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">+{reforestacion} ha</span>
            </div>
            <Slider
              value={[reforestacion]}
              onValueChange={(value) => setReforestacion(value[0])}
              max={10000}
              step={100}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Cow className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-medium">Reducción Ganado</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">-{ganado}%</span>
            </div>
            <Slider value={[ganado]} onValueChange={(value) => setGanado(value[0])} max={50} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-600" />
                <span className="text-xs font-medium">Energía Renovable</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">+{energia}%</span>
            </div>
            <Slider value={[energia]} onValueChange={(value) => setEnergia(value[0])} max={30} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium">Transporte Limpio</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">-{transporte}%</span>
            </div>
            <Slider value={[transporte]} onValueChange={(value) => setTransporte(value[0])} max={30} step={1} />
          </div>
        </div>

        {/* Risk Column */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-red-700 mb-2">Riesgos</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-medium">Crecimiento Industrial</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">+{industrias}%</span>
            </div>
            <Slider value={[industrias]} onValueChange={(value) => setIndustrias(value[0])} max={50} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-medium">Aumento Vehículos</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">+{vehiculos}%</span>
            </div>
            <Slider value={[vehiculos]} onValueChange={(value) => setVehiculos(value[0])} max={50} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-medium">Expansión Urbana</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">+{poblacion}%</span>
            </div>
            <Slider value={[poblacion]} onValueChange={(value) => setPoblacion(value[0])} max={40} step={1} />
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">😰</span>
            <span className="text-2xl">😐</span>
            <span className="text-2xl">🌱</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Balance proyectado</div>
            <div className="text-xl font-bold text-red-600">+128,973 ton CO₂eq</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
