"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts"
import { createClient } from "@supabase/supabase-js"
import AppCard from "@/components/ui-custom/AppCard"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface HourData {
  hour: string
  resultado: number
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null

  const value = payload[0].value
  const isPositive = value >= 0

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-zinc-400">{label}</p>
      <p
        className={`text-sm font-semibold ${
          isPositive ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {isPositive ? "+" : ""}
        {value.toFixed(2)}
      </p>
    </div>
  )
}

export default function PerformanceByHourChart() {
  const [data, setData] = useState<HourData[]>([])

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {
    const { data: trades, error } = await supabase
      .from("trades")
      .select("resultado, entrada_time")

    if (error || !trades) {
      console.error(error)
      return
    }

    const grouped: Record<string, number> = {}

    trades.forEach((trade) => {
      if (!trade.entrada_time) return
      const date = new Date(trade.entrada_time)
      const hour = date.getHours().toString().padStart(2, "0") + ":00"
      grouped[hour] = (grouped[hour] || 0) + Number(trade.resultado || 0)
    })

    const formatted = Object.entries(grouped)
      .map(([hour, resultado]) => ({ hour, resultado }))
      .sort((a, b) => a.hour.localeCompare(b.hour))

    setData(formatted)
  }

  return (
    <AppCard title="Performance By Hour">
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="40%"  // espaço entre grupos de barras
            barGap={4}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"         // zinc-800, grade bem discreta
              vertical={false}         // só linhas horizontais, mais limpo
            />

            <XAxis
              dataKey="hour"
              tick={{ fill: "#71717a", fontSize: 11 }}  // zinc-500
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v) => (v >= 0 ? `+${v}` : `${v}`)}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />

            {/* linha de referência no zero */}
            <ReferenceLine y={0} stroke="#52525b" strokeWidth={1} />

            <Bar dataKey="resultado" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.resultado >= 0 ? "#34d399" : "#f43f5e"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppCard>
  )
}