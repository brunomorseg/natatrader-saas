"use client"

import { useEffect, useState } from "react"

import { createClient } from "@supabase/supabase-js"

import AppCard from "@/components/ui-custom/AppCard"
import {
  useTradingFilters
} from "@/contexts/TradingFiltersContext"

import {
  filterTrades
} from "@/lib/filters/filterTrades"

import { generateInsights }
from "@/lib/ai/generateInsights"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AIInsightsCard() {

  const [insights, setInsights] =
    useState<string[]>([])

  const { filters } =
  useTradingFilters()

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {

    const { data, error } = await supabase
      .from("trades")
      .select(`
        resultado,
        setup,
        cenario,
        entrada_time
      `)

    if (error || !data) {
      console.error(error)
      return
    }

    const filteredTrades =
  filterTrades(data, filters)

    const generated =
  generateInsights(filteredTrades)

    setInsights(generated)
  }

  return (
    <AppCard title="AI Insights">

      <div className="space-y-3">

        {insights.map(
          (insight, index) => (

            <div
              key={index}
              className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-800/20
                p-4
              "
            >

              <p className="
                text-sm
                leading-relaxed
                text-zinc-000
              ">
                {insight}
              </p>

            </div>
          )
        )}

      </div>

    </AppCard>
  )
}