import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Map } from "lucide-react"

export function MapPreview() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background shadow-lg">
                  <Map className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Mapa Interactivo</h3>
                  <p className="text-muted-foreground mb-4">Explora el balance de carbono de cada municipio</p>
                  <Button asChild size="lg">
                    <Link href="/explorador">Abrir Explorador</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
