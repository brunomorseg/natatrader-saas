export function generateEmotionStats(
  trades: any[]
) {

  const stats:
    Record<
      string,
      {
        trades: number
        pnl: number
      }
    > = {}

  trades.forEach((trade) => {

    if (!trade.tags) return

    trade.tags.forEach(
      (tag: string) => {

        if (!stats[tag]) {

          stats[tag] = {
            trades: 0,
            pnl: 0
          }
        }

        stats[tag].trades += 1

        stats[tag].pnl +=
          Number(
            trade.resultado || 0
          )
      }
    )
  })

  return Object.entries(stats)
    .map(([tag, values]) => ({
      tag,
      trades: values.trades,
      pnl: values.pnl
    }))
    .sort((a, b) =>
      b.pnl - a.pnl
    )
}