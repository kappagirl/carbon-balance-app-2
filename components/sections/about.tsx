import { Card } from "@/components/ui/card"

export function About() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">Acerca del Proyecto</h2>
            <div className="prose prose-gray max-w-none space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">EcoBalance360</strong> es una herramienta desarrollada como parte
                del programa
                <strong className="text-foreground"> Datos al Ecosistema 2025</strong> del MinTIC Colombia, en
                colaboración con el Colectivo HAGAMOS.
              </p>
              <p>
                El objetivo es proporcionar a alcaldes, funcionarios ambientales y ciudadanos una plataforma intuitiva
                para comprender el balance de carbono de los 87 municipios de Santander, facilitando la toma de
                decisiones informadas en materia de política climática.
              </p>
              <p>
                Los datos presentados corresponden al año 2019 y fueron calculados siguiendo metodologías
                internacionales de contabilidad de emisiones de gases de efecto invernadero.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
