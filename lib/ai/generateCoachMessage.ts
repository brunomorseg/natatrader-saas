export function generateCoachMessage(
  trades: any[]
) {

  if (!trades.length) {
    return null
  }

  const pnl =
    trades.reduce(
      (acc, trade) =>
        acc + Number(trade.resultado || 0),
      0
    )

  const revengeTrades =
    trades.filter((trade) =>
      trade.tags?.includes(
        "Revenge"
      )
    )

  if (
    revengeTrades.length >= 3 &&
    pnl < 0
  ) {

    return `
      Your recent trades show
      signs of emotional
      reactivity after losses.

      Consider introducing a
      cooldown period after
      consecutive losing trades.
    `
  }

  const disciplineTrades =
    trades.filter((trade) =>
      trade.tags?.includes(
        "Discipline"
      )
    )

  if (
    disciplineTrades.length >= 5 &&
    pnl > 0
  ) {

    return `
      Your disciplined executions
      are strongly correlated
      with positive performance.

      Continue prioritizing
      patience and selective
      execution.
    `
  }

  return `
    Continue collecting data.
    Your behavioral patterns
    will become clearer with
    more trading sessions.
  `
}