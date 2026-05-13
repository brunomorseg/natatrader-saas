"use client"

import { useEffect, useState } from "react"

import { createClient } from "@supabase/supabase-js"

import AppCard from "@/components/ui-custom/AppCard"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface DayStats {
  bestDay: {
    date: string
    resultado: number
  } | null

  worstDay: {
    date: string
    resultado: number
  } | null
}

export default function BestWorstDays() {

  const [stats, setStats] =
    useState<DayStats>({
      bestDay: null,
      worstDay: null
    })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {

    const { data: trades, error } = await supabase
      .from("trades")
      .select("resultado, entrada_time")

    if (error || !trades) return

    const grouped: Record<string, number> = {}

    trades.forEach((trade) => {

      if (!trade.entrada_time) return

      const date =
        new Date(trade.entrada_time)
          .toISOString()
          .split("T")[0]

      grouped[date] =
        (grouped[date] || 0) +
        Number(trade.resultado || 0)
    })

    const days = Object.entries(grouped).map(
      ([date, resultado]) => ({
        date,
        resultado
      })
    )

    const bestDay =
      [...days].sort(
        (a, b) => b.resultado - a.resultado
      )[0]

    const worstDay =
      [...days].sort(
        (a, b) => a.resultado - b.resultado
      )[0]

    setStats({
      bestDay,
      worstDay
    })
  }

  return (
    <AppCard title="Best & Worst Days">

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4">

          <p className="mb-2 text-xs uppercase tracking-wide text-emerald-400">
            Best Day
          </p>

          <h3 className="text-lg font-semibold text-white">
            {stats.bestDay?.date || "-"}
          </h3>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            +{stats.bestDay?.resultado.toFixed(2) || 0}
          </p>

        </div>

        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4">

          <p className="mb-2 text-xs uppercase tracking-wide text-rose-400">
            Worst Day
          </p>

          <h3 className="text-lg font-semibold text-white">
            {stats.worstDay?.date || "-"}
          </h3>

          <p className="mt-2 text-2xl font-bold text-rose-400">
            {stats.worstDay?.resultado.toFixed(2) || 0}
          </p>

        </div>

      </div>

    </AppCard>
  )
}