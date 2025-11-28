import { Card } from "@/components/ui/card"
import { Leaf, Target, Users, Database } from "lucide-react"

export const metadata = {
  title: "Acerca de - EcoBalance360",
  description: "Conoce más sobre EcoBalance360",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Acerca de EcoBalance360</h1>
            <p className="text-lg text-muted-foreground">Transformando datos en acción climática</p>
          </div>

          <Card className="p-8 md:p-12">
            <div className="prose prose-gray max-w-none space-y-6">
              <p className="text-lg">
                <strong>EcoBalance360</strong> es una plataforma de analítica territorial desarrollada para visualizar y
                analizar el balance de carbono de los 87 municipios del departamento de Santander, Colombia.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Objetivos</h2>
              <div className="grid gap-4 md:grid-cols-2 not-prose">
                {[
                  { icon: Target, title: "Visualización Clara", desc: "Presentar datos complejos de forma accesible" },
                  { icon: Users, title: "Empoderamiento", desc: "Facilitar la toma de decisiones informadas" },
                  { icon: Database, title: "Datos Abiertos", desc: "Transparencia y acceso público a la información" },
                  { icon: Leaf, title: "Acción Climática", desc: "Impulsar políticas de mitigación efectivas" },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30">
                      <Icon className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">Metodología</h2>
              <p>
                Los cálculos de emisiones y captura de carbono se realizaron siguiendo metodologías internacionales
                establecidas por el IPCC (Panel Intergubernamental sobre Cambio Climático). Los datos corresponden al
                año 2019 y consideran las siguientes categorías:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Emisiones por energía (consumo eléctrico residencial, comercial e industrial)</li>
                <li>Emisiones industriales (procesos IPPU)</li>
                <li>Emisiones agrícolas y ganaderas</li>
                <li>Emisiones por gestión de residuos</li>
                <li>Emisiones por deforestación</li>
                <li>Captura de carbono por bosques naturales</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Equipo</h2>
              <p>
                Este proyecto es desarrollado por el <strong>Colectivo HAGAMOS</strong> como parte del programa
                <strong> Datos al Ecosistema 2025</strong> del Ministerio de Tecnologías de la Información y las
                Comunicaciones de Colombia (MinTIC).
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
