import { Card } from "@/components/ui/card"
import { Trophy, TrendingUp, Target, Calendar } from "lucide-react"
import type { GameStats } from "@/hooks/use-game-stats"

interface GameStatsCardProps {
  stats: GameStats
  averageScore: number
}

export function GameStatsCard({ stats, averageScore }: GameStatsCardProps) {
  if (stats.gamesPlayed === 0) {
    return (
      <Card className="p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          Aún no has jugado. ¡Empieza ahora para ver tus estadísticas!
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Tus Estadísticas</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
          <div className="text-xs text-muted-foreground">Partidas</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.highScore}</div>
          <div className="text-xs text-muted-foreground">Mejor</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{averageScore}</div>
          <div className="text-xs text-muted-foreground">Promedio</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.totalScore}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>
    </Card>
  )
}
