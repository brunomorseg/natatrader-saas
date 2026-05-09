"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"

type Trade = {
  resultado: number
  data_hora: string
}

type Props = {
  trades: Trade[]
}

export default function Charts({ trades }: Props) {

  // =========================
  // 1. Curva de capital
  // =========================
  let cumulative = 0

  const equityData = trades
    .sort(
      (a, b) =>
        new Date(a.data_hora).getTime() -
        new Date(b.data_hora).getTime()
    )
    .map((trade, index) => {
      cumulative += trade.resultado
      return {
        name: index + 1,
        equity: cumulative
      }
    })

  // =========================
  // 2. Resultado por trade
  // =========================
  const resultData = trades.map((t, i) => ({
    name: i + 1,
    resultado: t.resultado
  }))

  return (
    <div className="space-y-10 mt-6">

      {/* Curva de capital */}
      <div>
        <h2 className="text-xl font-bold mb-2">
          Curva de Capital
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={equityData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="equity"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resultado por trade */}
      <div>
        <h2 className="text-xl font-bold mb-2">
          Resultado por Trade
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resultData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="resultado" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}