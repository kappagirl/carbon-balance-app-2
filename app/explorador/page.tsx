"use client"

import { Suspense, useState } from "react"
import { InteractiveMap } from "@/components/map/interactive-map"
import { MunicipalityPanel } from "@/components/panels/municipality-panel"
import { TopMunicipalitiesPanel } from "@/components/panels/top-municipalities-panel"

export default function ExplorerPage() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="container mx-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Explorador de Balance de Carbono</h1>
            <p className="text-muted-foreground">
              Visualiza y analiza el balance de carbono de los 87 municipios de Santander
            </p>
          </div>

          <Suspense fallback={<div className="h-[600px] bg-muted animate-pulse rounded-lg" />}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <InteractiveMap
                  selectedMunicipalityName={selectedMunicipality}
                  onMunicipalitySelect={setSelectedMunicipality}
                />
              </div>

              <div className="space-y-6">
                <MunicipalityPanel selectedMunicipalityName={selectedMunicipality} />
              </div>
            </div>
          </Suspense>

          <div className="mt-8">
            <TopMunicipalitiesPanel onMunicipalitySelect={setSelectedMunicipality} />
          </div>
        </div>
      </div>
    </div>
  )
}
