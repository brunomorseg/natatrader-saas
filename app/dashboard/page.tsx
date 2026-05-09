"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

import StatsCards from "@/components/dashboard/statscards"
import TradeList from "@/components/trade/tradelist"
import Insights from "@/components/dashboard/insights"
import Charts from "@/components/dashboard/charts"
import SetupAnalysis from "@/components/dashboard/SetupAnalysis"
import HourAnalysis from "@/components/dashboard/HourAnalysis"
import DurationAnalysis from "@/components/dashboard/DurationAnalysis"
import CombinedAnalysis from "@/components/dashboard/CombinedAnalysis"
import AIInsights from "@/components/dashboard/AIInsights"
import AINarrative from "@/components/dashboard/AINarrative"
import { calculateStats } from "@/lib/calculations"
import { generateInsights } from "@/lib/insights"
import UploadCSV from "@/components/trade/UploadCSV"
import Sidebar from "@/components/layout/Sidebar"


import {
  analyzeBySetup,
  analyzeByHour,
  analyzeByDuration,
  analyzeCombined
} from "@/lib/analysis"

import { generateAIInsights } from "@/lib/aiInsights"
import { generateNarrative } from "@/lib/aiNarrative"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const [trades, setTrades] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [insights, setInsights] = useState<string[]>([])

  const [setupData, setSetupData] = useState<any[]>([])
  const [hourData, setHourData] = useState<any[]>([])
  const [durationData, setDurationData] = useState<any[]>([])
  const [combinedData, setCombinedData] = useState<any[]>([])

  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [narrative, setNarrative] = useState("")

  const [aiReal, setAiReal] = useState("")

  useEffect(() => {
  async function init() {
    // 🔐 Verifica usuário
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = "/login"
      return
    }

    // 📊 Busca trades
    const { data } = await supabase
      .from("trades")
      .select("*")

    console.log("TRADES:", data)

    if (data) {
      try {
        const setup = analyzeBySetup(data)
        const hour = analyzeByHour(data)
        const duration = analyzeByDuration(data)
        const combined = analyzeCombined(data)

        setTrades(data)
        setStats(calculateStats(data))
        setInsights(generateInsights(data))

        setSetupData(setup)
        setHourData(hour)
        setDurationData(duration)
        setCombinedData(combined)

        setAiInsights(
          generateAIInsights({
            trades: data,
            setupData: setup,
            hourData: hour,
            durationData: duration,
            combinedData: combined
          })
        )

        setNarrative(
          generateNarrative({
            setupData: setup,
            hourData: hour,
            durationData: duration,
            combinedData: combined
          })
        )

        // 🔥 IA REAL (protegida)
        try {
          const res = await fetch("/api/ai", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ trades: data })
          })

          const json = await res.json()
          setAiReal(json.text)

        } catch (err) {
          console.log("Erro IA ignorado:", err)
        }

      } catch (err) {
        console.error("Erro geral:", err)
      }
    }
  }

  init()
}, [])

  if (!stats) return <p>Carregando dashboard...</p>

 return (
  <div className="flex bg-[#f5f7fb] min-h-screen">

    <Sidebar />

    <main className="flex-1 p-8 overflow-auto">

      <h1 className="text-4xl font-bold text-zinc-800 mb-8">
        Dashboard
      </h1>
      <div className="flex gap-3 mb-8">

  <a
    href="/dashboard/trades/new"
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl"
  >
    Novo Trade
  </a>

  <UploadCSV />

</div>

      {/* STATS */}
      <section className="mb-8">
        <StatsCards stats={stats} />
      </section>

      {/* IA */}
      <section className="mb-8">
        <AIInsights insights={aiInsights} />
      </section>

      {/* NARRATIVA */}
      <section className="mb-8">
        <AINarrative text={narrative} />
      </section>

      {/* CHARTS */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <Charts trades={trades} />
      </section>

      {/* ANÁLISES */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <SetupAnalysis data={setupData} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <HourAnalysis data={hourData} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <DurationAnalysis data={durationData} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <CombinedAnalysis data={combinedData} />
        </div>

      </section>

      {/* TRADES */}
      <section className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-2xl font-bold text-zinc-800 mb-6">
          Trades Recentes
        </h2>

        <TradeList />

      </section>

    </main>

  </div>
)
}