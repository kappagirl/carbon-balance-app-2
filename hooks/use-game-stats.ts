"use client"

import { useState, useEffect } from "react"

export interface GameStats {
  gamesPlayed: number
  totalScore: number
  highScore: number
  lastPlayed?: string
}

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  totalScore: 0,
  highScore: 0,
}

export function useGameStats(gameKey: string) {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoaded(true)
      return
    }

    // Load stats from localStorage
    const stored = localStorage.getItem(`game-stats-${gameKey}`)
    if (stored) {
      try {
        setStats(JSON.parse(stored))
      } catch (e) {
        console.error("Error loading game stats:", e)
      }
    }
    setIsLoaded(true)
  }, [gameKey])

  const updateStats = (score: number) => {
    if (typeof window === "undefined") return

    const newStats: GameStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      totalScore: stats.totalScore + score,
      highScore: Math.max(stats.highScore, score),
      lastPlayed: new Date().toISOString(),
    }
    setStats(newStats)
    localStorage.setItem(`game-stats-${gameKey}`, JSON.stringify(newStats))
  }

  const resetStats = () => {
    if (typeof window === "undefined") return

    setStats(DEFAULT_STATS)
    localStorage.removeItem(`game-stats-${gameKey}`)
  }

  const averageScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0

  return {
    stats,
    isLoaded,
    updateStats,
    resetStats,
    averageScore,
  }
}
