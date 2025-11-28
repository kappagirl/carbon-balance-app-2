import { Suspense } from "react"
import { Hero } from "@/components/sections/hero"
import { StatsOverview } from "@/components/sections/stats-overview"
import { MapPreview } from "@/components/sections/map-preview"
import { Features } from "@/components/sections/features"
import { About } from "@/components/sections/about"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Hero />
      </Suspense>

      <StatsOverview />

      <MapPreview />

      <Features />

      <About />
    </div>
  )
}
