interface Trade {

  resultado: number
  entrada_time?: string
  setup?: string
  cenario?: string
}

export function generateBehaviorInsights(
  trades: Trade[]
) {

  const insights: string[] = []

  if (!trades.length)
    return insights

  // total pnl

  const total =
    trades.reduce(
      (acc, trade) =>
        acc + Number(trade.resultado || 0),
      0
    )

  // losses seguidos

  let consecutiveLosses = 0

  for (const trade of trades) {

    if (Number(trade.resultado) < 0) {
      consecutiveLosses++
    }
  }

  if (consecutiveLosses >= 3) {

    insights.push(
      "Multiple consecutive losses detected. Possible emotional deterioration."
    )
  }

  // overtrading

  if (trades.length >= 8) {

    insights.push(
      "High trading frequency detected. Review trade selectivity."
    )
  }

  // profitable session

  if (total > 500) {

    insights.push(
      "Strong profitability with good execution consistency."
    )
  }

  // negative session

  if (total < -300) {

    insights.push(
      "Large drawdown detected. Review risk management and emotional control."
    )
  }

  return insights
}