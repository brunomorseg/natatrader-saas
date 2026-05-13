"use client"

import { useEffect, useState } from "react"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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

interface SetupData {
  setup: string
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

  const positive = value >= 0

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 shadow-xl">

      <p className="mb-1 text-xs font-medium text-zinc-400">
        {label}
      </p>

      <p
        className={`text-sm font-semibold ${
          positive
            ? "text-emerald-400"
            : "text-rose-400"
        }`}
      >
        {positive ? "+" : ""}
        {value.toFixed(2)}
      </p>

    </div>
  )
}

export default function SetupAnalysisChart() {

  const [data, setData] = useState<SetupData[]>([])

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {

    const { data: trades, error } = await supabase
      .from("trades")
      .select("setup, resultado")

    if (error || !trades) {
      console.error(error)
      return
    }

    const grouped: Record<string, number> = {}

    trades.forEach((trade) => {

      const setup =
        trade.setup?.trim() || "Sem setup"

      grouped[setup] =
        (grouped[setup] || 0) +
        Number(trade.resultado || 0)
    })

    const formatted = Object.entries(grouped)
      .map(([setup, resultado]) => ({
        setup,
        resultado
      }))
      .sort((a, b) => b.resultado - a.resultado)

    setData(formatted)
  }

  return (
    <AppCard title="Performance By Setup">

      <div className="h-[360px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 8,
              right: 12,
              left: 18,
              bottom: 8,
            }}
            barCategoryGap="28%"
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              type="number"
              tick={{
                fill: "#71717a",
                fontSize: 11
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="setup"
              tick={{
                fill: "#a1a1aa",
                fontSize: 12
              }}
              axisLine={false}
              tickLine={false}
              width={110}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "rgba(255,255,255,0.03)"
              }}
            />

            <ReferenceLine
              x={0}
              stroke="#52525b"
            />

            <Bar
              dataKey="resultado"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
            >

              {data.map((entry, index) => (

                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.resultado >= 0
                      ? "#34d399"
                      : "#f43f5e"
                  }
                  fillOpacity={0.9}
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </AppCard>
  )
}