type Trade = {
  resultado: number
  setup: string
  data_hora: string
}

export function generateInsights(trades: Trade[]) {
  const insights: string[] = []

  if (!trades.length) return insights

  // =========================
  // 1. Resultado por horário
  // =========================
  const byHour: Record<number, number[]> = {}

  trades.forEach((t) => {
    const hour = new Date(t.data_hora).getHours()
    if (!byHour[hour]) byHour[hour] = []
    byHour[hour].push(t.resultado)
  })

  Object.entries(byHour).forEach(([hour, results]) => {
    const avg =
      results.reduce((a, b) => a + b, 0) / results.length

    if (results.length >= 5 && avg < 0) {
      insights.push(`Você perde dinheiro às ${hour}h`)
    }

    if (results.length >= 5 && avg > 0) {
      insights.push(`Você tem bons resultados às ${hour}h`)
    }
  })

  // =========================
  // 2. Resultado por setup
  // =========================
  const bySetup: Record<string, number[]> = {}

  trades.forEach((t) => {
    if (!bySetup[t.setup]) bySetup[t.setup] = []
    bySetup[t.setup].push(t.resultado)
  })

  Object.entries(bySetup).forEach(([setup, results]) => {
    const avg =
      results.reduce((a, b) => a + b, 0) / results.length

    if (results.length >= 5 && avg < 0) {
      insights.push(`O setup "${setup}" está negativo`)
    }

    if (results.length >= 5 && avg > 0) {
      insights.push(`O setup "${setup}" é lucrativo`)
    }
  })

  // =========================
  // 3. Sequência de perdas
  // =========================
  let streak = 0
  let maxLossStreak = 0

  trades.forEach((t) => {
    if (t.resultado < 0) {
      streak++
      if (streak > maxLossStreak) maxLossStreak = streak
    } else {
      streak = 0
    }
  })

  if (maxLossStreak >= 3) {
    insights.push(`Você teve uma sequência de ${maxLossStreak} perdas seguidas`)
  }

  // =========================
  // 4. Gain vs Loss
  // =========================
  const wins = trades.filter(t => t.resultado > 0)
  const losses = trades.filter(t => t.resultado < 0)

  const avgWin = wins.reduce((a, t) => a + t.resultado, 0) / wins.length || 0
  const avgLoss = losses.reduce((a, t) => a + t.resultado, 0) / losses.length || 0

  if (Math.abs(avgLoss) > avgWin) {
    insights.push("Seu loss médio é maior que seu gain médio")
  }

  return insights
}