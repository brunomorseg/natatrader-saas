"use client"

import { useEffect, useState } from "react"

import { createClient } from "@supabase/supabase-js"

import KpiCard from "@/components/ui-custom/KpiCard"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Trade {
  resultado: number
}

export default function KPISection() {

  const [netProfit, setNetProfit] = useState(0)
  const [winRate, setWinRate] = useState(0)
  const [profitFactor, setProfitFactor] = useState(0)
  const [totalTrades, setTotalTrades] = useState(0)

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {

    const { data: trades, error } = await supabase
      .from("trades")
      .select("resultado")

    if (error || !trades) {
      console.error(error)
      return
    }

    const total = trades.reduce(
      (acc, trade) => acc + Number(trade.resultado || 0),
      0
    )

    const wins = trades.filter(
      (trade) => Number(trade.resultado) > 0
    )

    const losses = trades.filter(
      (trade) => Number(trade.resultado) < 0
    )

    const grossProfit = wins.reduce(
      (acc, trade) => acc + Number(trade.resultado),
      0
    )

    const grossLoss = losses.reduce(
      (acc, trade) => acc + Math.abs(Number(trade.resultado)),
      0
    )

    const calculatedWinRate =
      trades.length > 0
        ? (wins.length / trades.length) * 100
        : 0

    const calculatedProfitFactor =
      grossLoss > 0
        ? grossProfit / grossLoss
        : grossProfit

    setNetProfit(total)

    setWinRate(calculatedWinRate)

    setProfitFactor(calculatedProfitFactor)

    setTotalTrades(trades.length)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <KpiCard
        title="Net Profit"
        value={`R$ ${netProfit.toFixed(2)}`}
        trend={`${winRate.toFixed(1)}% WR`}
        positive={netProfit >= 0}
      />

      <KpiCard
        title="Win Rate"
        value={`${winRate.toFixed(1)}%`}
        trend={`${totalTrades} trades`}
        positive={winRate >= 50}
      />

      <KpiCard
        title="Profit Factor"
        value={profitFactor.toFixed(2)}
        positive={profitFactor >= 1}
      />

      <KpiCard
        title="Trades"
        value={String(totalTrades)}
      />

    </div>
  )
}