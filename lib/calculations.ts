export function calculateStats(trades: any[]) {
  if (!trades || trades.length === 0) {
    return {
      totalTrades: 0,
      winrate: 0,
      totalResultado: 0,
      avgWin: 0,
      avgLoss: 0,
      expectancy: 0
    }
  }

  // 🔒 garante números válidos
  const validTrades = trades.filter(
    t => t.resultado !== null && !isNaN(Number(t.resultado))
  )

  const totalTrades = validTrades.length

  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      winrate: 0,
      totalResultado: 0,
      avgWin: 0,
      avgLoss: 0,
      expectancy: 0
    }
  }

  const wins = validTrades.filter(t => Number(t.resultado) > 0)
  const losses = validTrades.filter(t => Number(t.resultado) < 0)

  const totalResultado = validTrades.reduce(
    (acc, t) => acc + Number(t.resultado),
    0
  )

  const winrate = (wins.length / totalTrades) * 100

  const avgWin =
    wins.length > 0
      ? wins.reduce((acc, t) => acc + Number(t.resultado), 0) / wins.length
      : 0

  const avgLoss =
    losses.length > 0
      ? losses.reduce((acc, t) => acc + Number(t.resultado), 0) / losses.length
      : 0

  const expectancy =
    (winrate / 100) * avgWin +
    ((100 - winrate) / 100) * avgLoss

  return {
    total: totalTrades,
    winRate: winrate,
    totalResultado,
    avgWin,
    avgLoss,
    expectancy
  }
}