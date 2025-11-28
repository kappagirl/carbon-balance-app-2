import { Card } from "@/components/ui/card"
import { BarChart3, Gauge, Lightbulb, Sparkles } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Visualización Intuitiva",
    description: "Mapa interactivo con datos de emisiones y captura para cada municipio",
  },
  {
    icon: Gauge,
    title: "Simulador de Escenarios",
    description: "Modela el impacto de políticas de mitigación climática",
  },
  {
    icon: Sparkles,
    title: "Análisis con IA",
    description: "Recomendaciones contextualizadas para cada municipio",
  },
  {
    icon: Lightbulb,
    title: "Juegos Educativos",
    description: "Aprende sobre el balance de carbono de forma interactiva",
  },
]

export function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Funcionalidades</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Herramientas diseñadas para alcaldes, funcionarios y ciudadanos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
