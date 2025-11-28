import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Shuffle, Target, ArrowUpDown } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Juegos - EcoBalance360",
  description: "Aprende sobre el balance de carbono jugando",
}

const games = [
  {
    icon: Shuffle,
    title: "Comparador",
    description: "Compara hasta 4 municipios y ordénalos por su balance de carbono",
    coins: "+ 0 🪙",
    href: "/juegos/comparador",
  },
  {
    icon: Target,
    title: "Adivina el Municipio",
    description: "Adivina si un municipio es emisor o sumidero",
    coins: "+10 🪙",
    href: "/juegos/adivina",
  },
  {
    icon: ArrowUpDown,
    title: "Mayor o Menor",
    description: "Compara las emisiones entre municipios",
    coins: "+10 🪙",
    href: "/juegos/mayor-menor",
  },
  {
    icon: Trophy,
    title: "Desafío del Alcalde",
    description: "Completa desafíos de gestión climática",
    coins: "+50 🪙",
    href: "/juegos/desafio-alcalde",
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">🎮 Zona de Juegos</h1>
            <p className="text-lg text-muted-foreground">Aprende sobre el balance de carbono de forma interactiva</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {games.map((game, index) => {
              const Icon = game.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold mb-1">{game.title}</h3>
                        <p className="text-sm text-muted-foreground">{game.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">{game.coins}</span>
                        <Link href={game.href}>
                          <Button size="sm">Jugar</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">🏆 Tus Estadísticas</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold">0 🪙</div>
                <div className="text-sm text-muted-foreground">Total monedas</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Partidas jugadas</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Mejor racha</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
