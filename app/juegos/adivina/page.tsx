"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, TargetIcon, CheckCircle2Icon, XCircleIcon } from "@/components/icons"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { useGameStats } from "@/hooks/use-game-stats"
import { GameStatsCard } from "@/components/game-stats-card"

interface Municipality {
  municipio: string
  balanceCarbono: number
  clasificacion: string
  totalPoblacion: number
  emisionesTotales: number
}

export default function AdivinaPage() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [currentMunicipality, setCurrentMunicipality] = useState<Municipality | null>(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const totalRounds = 10

  const { stats, updateStats, averageScore } = useGameStats("adivina")

  useEffect(() => {
    fetch("/data/santander-data.json")
      .then((res) => res.json())
      .then((data) => {
        setMunicipalities(data)
        selectRandomMunicipality(data)
      })
      .catch(console.error)
  }, [])

  const selectRandomMunicipality = (data: Municipality[]) => {
    const randomIndex = Math.floor(Math.random() * data.length)
    setCurrentMunicipality(data[randomIndex])
  }

  const handleGuess = (guess: "Emisor" | "Sumidero") => {
    if (!currentMunicipality) return

    const correct = currentMunicipality.clasificacion === guess
    setIsCorrect(correct)
    if (correct) setScore(score + 1)
    setShowResult(true)

    setTimeout(() => {
      if (round + 1 >= totalRounds) {
        updateStats(score + (correct ? 1 : 0))
        setGameOver(true)
      } else {
        setRound(round + 1)
        setShowResult(false)
        selectRandomMunicipality(municipalities)
      }
    }, 2000)
  }

  const handleRestart = () => {
    setScore(0)
    setRound(0)
    setGameOver(false)
    setShowResult(false)
    selectRandomMunicipality(municipalities)
  }

  if (!currentMunicipality && municipalities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (gameOver) {
    const percentage = (score / totalRounds) * 100
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Link href="/juegos">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>

            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-4">¡Juego Terminado!</h2>
              <div className="text-5xl font-bold text-primary mb-4">
                {score}/{totalRounds}
              </div>
              <p className="text-muted-foreground mb-6">
                {percentage >= 80
                  ? "¡Excelente! Conoces muy bien Santander"
                  : percentage >= 60
                    ? "¡Bien hecho! Sigue aprendiendo"
                    : "Sigue practicando para mejorar"}
              </p>
              <div className="space-y-3">
                <Button onClick={handleRestart} className="w-full">
                  Jugar de Nuevo
                </Button>
                <Link href="/juegos" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Otros Juegos
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/juegos">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          <GameStatsCard stats={stats} averageScore={averageScore} />

          <div className="text-center my-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TargetIcon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Adivina el Municipio</h1>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>
                Ronda: {round + 1}/{totalRounds}
              </span>
              <span>•</span>
              <span>Puntos: {score}</span>
            </div>
            <Progress value={((round + 1) / totalRounds) * 100} className="mt-4" />
          </div>

          {currentMunicipality && (
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">{currentMunicipality.municipio}</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>Población: {currentMunicipality.totalPoblacion.toLocaleString("es-CO")}</p>
                  <p>Emisiones: {currentMunicipality.emisionesTotales.toLocaleString("es-CO")} ton CO₂eq</p>
                </div>
              </div>

              {!showResult ? (
                <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                  <p className="text-center font-semibold mb-4 md:col-span-2">¿Este municipio es emisor o sumidero?</p>
                  <Button onClick={() => handleGuess("Emisor")} className="w-full h-16 text-lg" variant="destructive">
                    🏭 Emisor
                  </Button>
                  <Button
                    onClick={() => handleGuess("Sumidero")}
                    className="w-full h-16 text-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    🌲 Sumidero
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  {isCorrect ? (
                    <div className="space-y-4">
                      <CheckCircle2Icon className="w-16 h-16 text-emerald-600 mx-auto" />
                      <h3 className="text-2xl font-bold text-emerald-600">¡Correcto!</h3>
                      <p className="text-muted-foreground">
                        {currentMunicipality.municipio} es un {currentMunicipality.clasificacion}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <XCircleIcon className="w-16 h-16 text-rose-600 mx-auto" />
                      <h3 className="text-2xl font-bold text-rose-600">Incorrecto</h3>
                      <p className="text-muted-foreground">
                        {currentMunicipality.municipio} es un {currentMunicipality.clasificacion}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
