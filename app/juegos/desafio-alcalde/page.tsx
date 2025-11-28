"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { useGameStats } from "@/hooks/use-game-stats"
import { GameStatsCard } from "@/components/game-stats-card"

interface Challenge {
  id: number
  scenario: string
  question: string
  options: { text: string; isCorrect: boolean; feedback: string }[]
}

const challenges: Challenge[] = [
  {
    id: 1,
    scenario: "Tu municipio es un emisor neto con altas emisiones de deforestación. El presupuesto es limitado.",
    question: "¿Cuál es tu primera acción como alcalde?",
    options: [
      {
        text: "Implementar un programa de reforestación comunitaria",
        isCorrect: true,
        feedback: "¡Excelente! La reforestación ayuda a capturar carbono y es económica con apoyo comunitario.",
      },
      {
        text: "Construir una nueva planta de tratamiento de residuos",
        isCorrect: false,
        feedback: "Aunque es útil, no aborda el principal problema: la deforestación.",
      },
      {
        text: "Invertir en paneles solares municipales",
        isCorrect: false,
        feedback: "Buena idea a futuro, pero la deforestación es el problema más urgente.",
      },
    ],
  },
  {
    id: 2,
    scenario: "Las emisiones por agricultura están aumentando debido al uso de fertilizantes químicos.",
    question: "¿Qué estrategia propones?",
    options: [
      {
        text: "Prohibir el uso de fertilizantes químicos inmediatamente",
        isCorrect: false,
        feedback: "Muy drástico. Los agricultores necesitan alternativas viables primero.",
      },
      {
        text: "Crear un programa de agricultura sostenible con incentivos",
        isCorrect: true,
        feedback: "¡Correcto! Los incentivos ayudan a transicionar gradualmente a prácticas más limpias.",
      },
      {
        text: "Ignorar el problema y enfocarse en otras áreas",
        isCorrect: false,
        feedback: "La agricultura es una fuente importante de emisiones que no se puede ignorar.",
      },
    ],
  },
  {
    id: 3,
    scenario: "Tu municipio tiene potencial para energía solar, pero la inversión inicial es alta.",
    question: "¿Cómo financias el proyecto?",
    options: [
      {
        text: "Buscar alianzas público-privadas y fondos verdes",
        isCorrect: true,
        feedback: "¡Excelente! Las alianzas reducen riesgos y comparten costos de inversión.",
      },
      {
        text: "Aumentar los impuestos locales significativamente",
        isCorrect: false,
        feedback: "Esto puede generar rechazo ciudadano sin considerar otras opciones.",
      },
      {
        text: "Posponer el proyecto indefinidamente",
        isCorrect: false,
        feedback: "Posponer solo aumenta las emisiones a largo plazo.",
      },
    ],
  },
  {
    id: 4,
    scenario: "El sector transporte está generando muchas emisiones en el casco urbano.",
    question: "¿Cuál es tu plan de acción?",
    options: [
      {
        text: "Prohibir vehículos privados en el centro",
        isCorrect: false,
        feedback: "Muy radical sin infraestructura alternativa. Genera rechazo.",
      },
      {
        text: "Mejorar transporte público e incentivar bicicletas",
        isCorrect: true,
        feedback: "¡Correcto! Ofrecer alternativas es más efectivo que prohibir.",
      },
      {
        text: "Construir más parqueaderos para facilitar el acceso",
        isCorrect: false,
        feedback: "Esto incentiva más uso de vehículos y aumenta emisiones.",
      },
    ],
  },
  {
    id: 5,
    scenario: "Los residuos sólidos no tienen tratamiento adecuado y generan metano.",
    question: "¿Qué sistema implementas?",
    options: [
      {
        text: "Separación en la fuente y compostaje comunitario",
        isCorrect: true,
        feedback: "¡Excelente! Reduce metano y crea economía circular con participación ciudadana.",
      },
      {
        text: "Exportar toda la basura a otro municipio",
        isCorrect: false,
        feedback: "Solo traslada el problema, no lo resuelves.",
      },
      {
        text: "Crear un relleno sanitario sin tratamiento",
        isCorrect: false,
        feedback: "Los rellenos sin tratamiento siguen generando metano.",
      },
    ],
  },
]

export default function DesafioAlcaldePage() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const { stats, updateStats, averageScore } = useGameStats("desafio-alcalde")

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleSelectOption = (index: number) => {
    if (showFeedback) return

    setSelectedOption(index)
    setShowFeedback(true)

    if (challenges[currentChallenge].options[index].isCorrect) {
      setScore(score + 10)
    }
  }

  const handleNext = () => {
    if (currentChallenge + 1 >= challenges.length) {
      updateStats(score)
      setGameOver(true)
    } else {
      setCurrentChallenge(currentChallenge + 1)
      setShowFeedback(false)
      setSelectedOption(null)
    }
  }

  const handleRestart = () => {
    setCurrentChallenge(0)
    setScore(0)
    setShowFeedback(false)
    setSelectedOption(null)
    setGameStarted(false)
    setGameOver(false)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/juegos">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>

            <GameStatsCard stats={stats} averageScore={averageScore} />

            <Card className="p-8 text-center mt-6">
              <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Desafío del Alcalde</h1>
              <p className="text-muted-foreground mb-6">
                Enfrenta desafíos reales de gestión climática municipal. Cada decisión correcta suma 10 puntos. ¿Estás
                listo para liderar tu municipio hacia la sostenibilidad?
              </p>
              <div className="bg-muted/30 p-4 rounded-lg mb-6">
                <p className="text-sm">
                  <strong>{challenges.length} desafíos</strong> • <strong>50 puntos máximos</strong>
                </p>
              </div>
              <Button onClick={handleStart} size="lg" className="w-full">
                Aceptar el Desafío
              </Button>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (gameOver) {
    const maxScore = challenges.length * 10
    const percentage = (score / maxScore) * 100
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/juegos">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>

            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 60 ? "🥈" : "🥉"}</div>
              <h2 className="text-3xl font-bold mb-4">¡Desafío Completado!</h2>
              <div className="text-5xl font-bold text-primary mb-4">
                {score}/{maxScore} puntos
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                {percentage >= 80
                  ? "¡Excelente! Eres un líder climático excepcional"
                  : percentage >= 60
                    ? "Bien hecho. Con más práctica serás un experto"
                    : "Sigue aprendiendo sobre gestión climática municipal"}
              </p>
              <div className="space-y-3">
                <Button onClick={handleRestart} className="w-full">
                  Intentar de Nuevo
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

  const challenge = challenges[currentChallenge]
  const progress = ((currentChallenge + 1) / challenges.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/juegos">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Desafío {currentChallenge + 1} de {challenges.length}
              </span>
              <span className="text-sm font-semibold">Puntos: {score}</span>
            </div>
            <Progress value={progress} />
          </div>

          <Card className="p-6 mb-6">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Escenario
              </div>
              <p className="text-lg">{challenge.scenario}</p>
            </div>
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">{challenge.question}</h3>
              <div className="space-y-3">
                {challenge.options.map((option, index) => {
                  const isSelected = selectedOption === index
                  const showCorrect = showFeedback && option.isCorrect
                  const showIncorrect = showFeedback && isSelected && !option.isCorrect

                  return (
                    <Button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      disabled={showFeedback}
                      variant={showCorrect ? "default" : showIncorrect ? "destructive" : "outline"}
                      className={`w-full h-auto py-4 px-6 text-left justify-start ${
                        showCorrect ? "bg-emerald-600 hover:bg-emerald-700" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-1">{option.text}</div>
                        {showCorrect && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                        {showIncorrect && <XCircle className="w-5 h-5 shrink-0" />}
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          </Card>

          {showFeedback && selectedOption !== null && (
            <Card className="p-6 mb-6">
              <div
                className={`font-semibold mb-2 ${
                  challenge.options[selectedOption].isCorrect ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {challenge.options[selectedOption].isCorrect ? "✓ Correcto" : "✗ Incorrecto"}
              </div>
              <p className="text-muted-foreground">{challenge.options[selectedOption].feedback}</p>
            </Card>
          )}

          {showFeedback && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentChallenge + 1 >= challenges.length ? "Ver Resultados" : "Siguiente Desafío"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
