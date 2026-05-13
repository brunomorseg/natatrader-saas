interface Trade {
  resultado: number
  setup?: string
  cenario?: string
  entrada_time?: string
  tags?: string[]
}

export function generateInsights(
  trades: Trade[]
) {

  const insights: string[] = []

 const revengeTrades =
  trades.filter((trade) =>
    trade.tags?.includes(
      "Revenge"
    )
  )

const revengePnL =
  revengeTrades.reduce(
    (acc, trade) =>
      acc + Number(trade.resultado),
    0
  )

if (
  revengeTrades.length >= 3 &&
  revengePnL < 0
) {

  insights.push(
    `
    Revenge-tagged trades
    are producing negative
    performance overall.
    `
  )
}

const disciplinedTrades =
  trades.filter((trade) =>
    trade.tags?.includes(
      "Discipline"
    )
  )

const disciplinePnL =
  disciplinedTrades.reduce(
    (acc, trade) =>
      acc + Number(trade.resultado),
    0
  )

if (
  disciplinedTrades.length >= 3 &&
  disciplinePnL > 0
) {

  insights.push(
    `
    Disciplined executions
    are strongly correlated
    with positive results.
    `
  )
}

  /* =========================
   SETUP PERFORMANCE
========================= */

const setupStats:
  Record<
    string,
    {
      pnl: number
      trades: number
      wins: number
    }
  > = {}

trades.forEach((trade) => {

  const setup =
    trade.setup || "Unknown"

  if (!setupStats[setup]) {

    setupStats[setup] = {
      pnl: 0,
      trades: 0,
      wins: 0
    }
  }

  setupStats[setup].pnl +=
    Number(trade.resultado || 0)

  setupStats[setup].trades += 1

  if (Number(trade.resultado) > 0) {
    setupStats[setup].wins += 1
  }
})

const rankedSetups =
  Object.entries(setupStats)
    .map(([setup, stats]) => ({
      setup,
      pnl: stats.pnl,
      trades: stats.trades,
      winrate:
        (stats.wins / stats.trades) * 100
    }))
    .filter((s) => s.trades >= 3)
    .sort((a, b) => b.pnl - a.pnl)

if (rankedSetups.length > 0) {

  const best =
    rankedSetups[0]

  insights.push(
    `
    Your best performing setup
    is "${best.setup}"
    with ${best.winrate.toFixed(0)}%
    win rate across
    ${best.trades} trades.
    `
  )
}

if (rankedSetups.length > 1) {

  const worst =
    rankedSetups[
      rankedSetups.length - 1
    ]

  if (worst.pnl < 0) {

    insights.push(
      `
      Setup "${worst.setup}"
      is currently generating
      negative expectancy.
      Consider reviewing
      execution quality.
      `
    )
  }
}

/* =========================
   HOUR PERFORMANCE
========================= */

const hourStats:
  Record<
    string,
    {
      pnl: number
      trades: number
    }
  > = {}

trades.forEach((trade) => {

  if (!trade.entrada_time)
    return

  const hour =
    new Date(
      trade.entrada_time
    )
      .getHours()
      .toString()

  if (!hourStats[hour]) {

    hourStats[hour] = {
      pnl: 0,
      trades: 0
    }
  }

  hourStats[hour].pnl +=
    Number(trade.resultado || 0)

  hourStats[hour].trades += 1
})

const rankedHours =
  Object.entries(hourStats)
    .map(([hour, stats]) => ({
      hour,
      pnl: stats.pnl,
      trades: stats.trades
    }))
    .filter((h) => h.trades >= 3)
    .sort((a, b) => b.pnl - a.pnl)

if (rankedHours.length > 0) {

  const bestHour =
    rankedHours[0]

  insights.push(
    `
    Your strongest trading
    window is around
    ${bestHour.hour}:00,
    where performance
    is consistently higher.
    `
  )
}

const badHours =
  rankedHours.filter(
    (h) => h.pnl < 0
  )

if (badHours.length > 0) {

  insights.push(
    `
    Some trading hours
    are generating negative
    performance. Avoid trading
    during low focus periods.
    `
  )
}

/* =========================
   LOSING STREAK
========================= */

let currentLossStreak = 0
let maxLossStreak = 0

trades.forEach((trade) => {

  const result =
    Number(trade.resultado || 0)

  if (result < 0) {

    currentLossStreak += 1

    if (
      currentLossStreak >
      maxLossStreak
    ) {

      maxLossStreak =
        currentLossStreak
    }

  } else {

    currentLossStreak = 0
  }
})

if (maxLossStreak >= 3) {

  insights.push(
    `
    A losing streak of
    ${maxLossStreak} trades
    was detected.
    Consider reducing size
    after consecutive losses.
    `
  )
}

/* =========================
   OVERTRADING
========================= */

const tradesPerDay:
  Record<string, number> = {}

trades.forEach((trade) => {

  if (!trade.entrada_time)
    return

  const date =
    new Date(
      trade.entrada_time
    )
      .toISOString()
      .split("T")[0]

  tradesPerDay[date] =
    (tradesPerDay[date] || 0) + 1
})

const heavyDays =
  Object.values(tradesPerDay)
    .filter((count) => count >= 10)

if (heavyDays.length > 0) {

  insights.push(
    `
    High trading frequency
    detected on some sessions.
    Monitor emotional fatigue
    and execution quality.
    `
  )
}

  return insights
}