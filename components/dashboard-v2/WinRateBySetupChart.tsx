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
} from "recharts"

import { createClient } from "@supabase/supabase-js"

import AppCard from "@/components/ui-custom/AppCard"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SetupWinRate {
  setup: string
  winrate: number
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: any) => {

  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 shadow-xl">

      <p className="mb-1 text-xs text-zinc-400">
        {label}
      </p>

      <p className="text-sm font-semibold text-emerald-400">
        {payload[0].value.toFixed(1)}%
      </p>

    </div>
  )
}

export default function WinRateBySetupChart() {

  const [data, setData] = useState<SetupWinRate[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {

    const { data: trades, error } = await supabase
      .from("trades")
      .select("setup, resultado")

    if (error || !trades) return

    const grouped: Record<
      string,
      {
        wins: number
        total: number
      }
    > = {}

    trades.forEach((trade) => {

      const setup =
        trade.setup?.trim() || "Sem setup"

      if (!grouped[setup]) {
        grouped[setup] = {
          wins: 0,
          total: 0
        }
      }

      grouped[setup].total += 1

      if (Number(trade.resultado) > 0) {
        grouped[setup].wins += 1
      }
    })

    const formatted = Object.entries(grouped)
      .map(([setup, stats]) => ({
        setup,
        winrate:
          (stats.wins / stats.total) * 100
      }))
      .sort((a, b) => b.winrate - a.winrate)

    setData(formatted)
  }

  return (
    <AppCard title="Win Rate By Setup">

      <div className="h-[340px]">

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
              domain={[0, 100]}
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

            <Bar
              dataKey="winrate"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
            >

              {data.map((_, index) => (

                <Cell
                  key={index}
                  fill="#34d399"
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
