export function generateExecutiveSummary(
  trades: any[]
) {

  if (!trades.length) {
    return "No trading data available."
  }

  const pnl =
    trades.reduce(
      (acc, trade) =>
        acc + Number(trade.resultado || 0),
      0
    )

  const wins =
    trades.filter(
      (trade) =>
        Number(trade.resultado) > 0
    ).length

  const winrate =
    (wins / trades.length) * 100

  if (
    pnl > 0 &&
    winrate >= 60
  ) {

    return `
      Trading performance is
      currently stable with
      positive expectancy and
      strong execution quality.
    `
  }

  if (pnl < 0) {

    return `
      Negative expectancy
      detected. Focus on
      emotional discipline,
      risk control and
      execution consistency.
    `
  }

  return `
    Performance is neutral.
    Continue gathering data
    to identify stronger
    behavioral patterns.
  `
}