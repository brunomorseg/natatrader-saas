"use client"

type Props = {
  stats: {
    total: number
    winRate: number
    avgWin: number
    avgLoss: number
    expectancy: number
  }
}

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

      <Card
        title="Trades"
        value={stats.total}
      />

      <Card
        title="Win Rate"
        value={`${stats.winRate?.toFixed(1) ?? 0}%`}
      />

      <Card
        title="Gain Médio"
        value={stats.avgWin?.toFixed(2)}
      />

      <Card
        title="Loss Médio"
        value={stats.avgLoss?.toFixed(2)}
      />

      <Card
        title="Expectancy"
        value={stats.expectancy?.toFixed(2)}
      />

    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white shadow-sm border border-zinc-100 p-6 rounded-2xl">

      <p className="text-zinc-500 text-sm mb-2">
        {title}
      </p>

      <p className="text-3xl font-bold text-zinc-800">
        {value}
      </p>

    </div>
  )
}