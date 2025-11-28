import { Card } from "@/components/ui/card"
import { Building2, Leaf, MapPin, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: MapPin,
    value: "87",
    label: "Municipios",
    description: "Cubiertos en el análisis",
  },
  {
    icon: TrendingUp,
    value: "7.9M",
    label: "Ton CO₂eq",
    description: "Emisiones totales",
  },
  {
    icon: Leaf,
    value: "7.7M",
    label: "Ton CO₂eq",
    description: "Captura de carbono",
  },
  {
    icon: Building2,
    value: "+230K",
    label: "Balance Neto",
    description: "Emisor departamental",
  },
]

export function StatsOverview() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Santander en Cifras</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Datos consolidados del balance de carbono departamental para el año 2019
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="font-medium text-sm">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
