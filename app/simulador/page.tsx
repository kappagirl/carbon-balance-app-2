import { Suspense } from "react"
import { InteractiveSimulator } from "@/components/simulator/interactive-simulator"

export const metadata = {
  title: "Simulador - EcoBalance360",
  description: "Simula escenarios de reducción de emisiones y captura de carbono",
}

export default function SimulatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="container mx-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Simulador de Escenarios</h1>
            <p className="text-muted-foreground">
              Explora cómo diferentes estrategias impactan el balance de carbono de Santander
            </p>
          </div>

          <Suspense fallback={<div className="h-[600px] bg-muted animate-pulse rounded-lg" />}>
            <InteractiveSimulator />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
