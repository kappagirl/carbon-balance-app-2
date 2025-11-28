import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Leaf className="w-4 h-4" />
            Balance de Carbono Municipal
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            EcoBalance<span className="text-primary">360</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Herramienta de analítica territorial para visualizar el balance de carbono en los 87 municipios de
            Santander, Colombia
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="min-w-[200px]">
              <Link href="/explorador">
                Explorar Mapa
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[200px] bg-transparent">
              <Link href="/acerca">Conocer Más</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
