"use client"

import { useEffect, useState } from "react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

import { createClient } from "@supabase/supabase-js"

import AppCard from "@/components/ui-custom/AppCard"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface EquityData {
  trade: number
  equity: number
}

export default function EquityCurveChart() {

  const [data, setData] = useState<EquityData[]>([])

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {

    const { data: trades, error } = await supabase
      .from("trades")
      .select("*")
      .order("data_hora", {
        ascending: true
      })

    if (error || !trades) {
      console.error(error)
      return
    }

    let cumulative = 0

    const equityData = trades.map((trade, index) => {

      cumulative += Number(trade.resultado || 0)

      return {
        trade: index + 1,
        equity: cumulative
      }
    })

    setData(equityData)
  }

  return (
    <AppCard title="Equity Curve">

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="trade" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="equity"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </AppCard>
  )
}