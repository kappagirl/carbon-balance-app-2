"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Shuffle } from "lucide-react"
import Link from "next/link"
import { useGameStats } from "@/hooks/use-game-stats"
import { GameStatsCard } from "@/components/game-stats-card"

interface Municipality {
  municipio: string
  balanceCarbono: number
  clasificacion: string
  emisionesTotales: number
  capturaBosques: number
}

export default function ComparadorPage() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selected, setSelected] = useState<string[]>(["", "", "", ""])
  const [sorted, setSorted] = useState<Municipality[]>([])
  const [showResult, setShowResult] = useState(false)
  const { stats, updateStats, averageScore } = useGameStats("comparador")

  useEffect(() => {
    fetch("/data/santander-data.json")
      .then((res) => res.json())
      .then((data) => setMunicipalities(data))
      .catch(console.error)
  }, [])

  const handleSelect = (index: number, value: string) => {
    const newSelected = [...selected]
    newSelected[index] = value
    setSelected(newSelected)
    setShowResult(false)
  }

  const handleCompare = () => {
    const selectedMunicipalities = selected
      .filter((name) => name !== "")
      .map((name) => municipalities.find((m) => m.municipio === name))
      .filter(Boolean) as Municipality[]

    const sortedList = [...selectedMunicipalities].sort((a, b) => a.balanceCarbono - b.balanceCarbono)
    setSorted(sortedList)
    setShowResult(true)

    updateStats(1)
  }

  const handleReset = () => {
    setSelected(["", "", "", ""])
    setSorted([])
    setShowResult(false)
  }

  const formatBalance = (balance: number) => {
    const sign = balance > 0 ? "+" : ""
    return `${sign}${balance.toLocaleString("es-CO")} ton CO₂eq`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/juegos">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          <GameStatsCard stats={stats} averageScore={averageScore} />

          <div className="text-center my-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shuffle className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Comparador de Municipios</h1>
            </div>
            <p className="text-muted-foreground">Selecciona hasta 4 municipios y compara su balance de carbono</p>
          </div>

          <Card className="p-6 mb-6 mt-6">
            <h3 className="font-semibold mb-4">Selecciona municipios:</h3>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              {selected.map((value, index) => (
                <Select key={index} value={value} onValueChange={(val) => handleSelect(index, val)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Municipio ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities
                      .filter((m) => !selected.includes(m.municipio) || m.municipio === value)
                      .map((m) => (
                        <SelectItem key={m.municipio} value={m.municipio}>
                          {m.municipio}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCompare} disabled={selected.filter((s) => s !== "").length < 2} className="flex-1">
                Comparar
              </Button>
              <Button onClick={handleReset} variant="outline">
                Limpiar
              </Button>
            </div>
          </Card>

          {showResult && sorted.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Resultado (de menor a mayor balance):</h3>
              <div className="space-y-3">
                {sorted.map((m, index) => (
                  <div key={m.municipio} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{m.municipio}</div>
                        <div className="text-sm text-muted-foreground">{m.clasificacion}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${m.balanceCarbono > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {formatBalance(m.balanceCarbono)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.balanceCarbono > 0 ? "Emisor neto" : "Sumidero neto"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
