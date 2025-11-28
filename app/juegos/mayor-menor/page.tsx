"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowUpDown, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { useGameStats } from "@/hooks/use-game-stats"
import { GameStatsCard } from "@/components/game-stats-card"

interface Municipality {
  municipio: string
  balanceCarbono: number
  emisionesTotales: number
  clasificacion: string
}

export default function MayorMenorPage() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [currentPair, setCurrentPair] = useState<[Municipality, Municipality] | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const { stats, updateStats, averageScore } = useGameStats("mayor-menor")

  useEffect(() => {
    fetch("/data/santander-data.json")
      .then((res) => res.json())
      .then((data) => setMunicipalities(data))
      .catch(console.error)
  }, [])

  const selectRandomPair = () => {
    const shuffled = [...municipalities].sort(() => Math.random() - 0.5)
    setCurrentPair([shuffled[0], shuffled[1]])
  }

  const handleStart = () => {
    setGameStarted(true)
    selectRandomPair()
  }

  const handleGuess = (guess: "mayor" | "menor") => {
    if (!currentPair) return

    const [first, second] = currentPair
    const correct =
      (guess === "mayor" && second.emisionesTotales >= first.emisionesTotales) ||
      (guess === "menor" && second.emisionesTotales < first.emisionesTotales)

    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      setShowResult(false)
      selectRandomPair()
    }, 2000)
  }

  const handleRestart = () => {
    if (gameStarted && score > 0) {
      updateStats(score)
    }
    setScore(0)
    setStreak(0)
    setGameStarted(false)
    setShowResult(false)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Link href="/juegos">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>

            <GameStatsCard stats={stats} averageScore={averageScore} />

            <Card className="p-8 text-center mt-6">
              <ArrowUpDown className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Mayor o Menor</h1>
              <p className="text-muted-foreground mb-8">
                Compara las emisiones totales de CO₂ entre municipios. ¿El segundo municipio emite más o menos que el
                primero?
              </p>
              <Button onClick={handleStart} size="lg" className="w-full">
                Comenzar Juego
              </Button>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPair) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  const [first, second] = currentPair

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/juegos">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Puntos</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            <div className="space-y-1 text-center">
              <div className="text-sm text-muted-foreground">Racha</div>
              <div className="text-2xl font-bold text-primary">{streak} 🔥</div>
            </div>
            <Button onClick={handleRestart} variant="outline">
              Reiniciar
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">{first.municipio}</h3>
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Emisiones Totales</div>
                  <div className="text-3xl font-bold text-rose-600">
                    {first.emisionesTotales.toLocaleString("es-CO")}
                  </div>
                  <div className="text-sm text-muted-foreground">ton CO₂eq</div>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-muted text-sm">{first.clasificacion}</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">{second.municipio}</h3>
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Emisiones Totales</div>
                  {showResult ? (
                    <>
                      <div className="text-3xl font-bold text-rose-600">
                        {second.emisionesTotales.toLocaleString("es-CO")}
                      </div>
                      <div className="text-sm text-muted-foreground">ton CO₂eq</div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-muted-foreground">???</div>
                  )}
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-muted text-sm">{second.clasificacion}</div>
              </div>
            </Card>
          </div>

          {!showResult ? (
            <div className="mt-6 space-y-3">
              <p className="text-center font-semibold">
                ¿{second.municipio} emite más o menos que {first.municipio}?
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={() => handleGuess("mayor")} className="h-16 text-lg" variant="default">
                  📈 Mayor
                </Button>
                <Button
                  onClick={() => handleGuess("menor")}
                  className="h-16 text-lg bg-emerald-600 hover:bg-emerald-700"
                >
                  📉 Menor
                </Button>
              </div>
            </div>
          ) : (
            <Card className="mt-6 p-6">
              <div className="text-center">
                {isCorrect ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-xl font-bold text-emerald-600">¡Correcto! +1 punto</h3>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <XCircle className="w-12 h-12 text-rose-600 mx-auto" />
                    <h3 className="text-xl font-bold text-rose-600">Incorrecto</h3>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
