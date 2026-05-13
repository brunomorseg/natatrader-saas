"use client"

import { useEffect, useState } from "react"

import { createClient }
from "@supabase/supabase-js"

import AppCard
from "@/components/ui-custom/AppCard"

import {
  useTradingFilters
} from "@/contexts/TradingFiltersContext"

import {
  filterTrades
} from "@/lib/filters/filterTrades"

import {
  generateBehaviorInsights
} from "@/lib/ai/AIBehaviorEngine"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface DayData {
  date: string
  pnl: number
  trades: number
}

interface Trade {
  resultado: number
  entrada_time?: string
  setup?: string
  cenario?: string
}

export default function TradingCalendar() {

  const [days, setDays] =
    useState<DayData[]>([])

  const [selectedDay, setSelectedDay] =
    useState<DayData | null>(null)

  const [selectedTrades, setSelectedTrades] =
    useState<Trade[]>([])

  const [allTrades, setAllTrades] =
    useState<Trade[]>([])

  const { filters } =
    useTradingFilters()

  const behaviorInsights =
    generateBehaviorInsights(
      selectedTrades
    )

  useEffect(() => {
    fetchTrades()
  }, [filters])

  async function fetchTrades() {

    const { data, error } = await supabase
      .from("trades")
      .select(`
        resultado,
        entrada_time,
        setup,
        cenario
      `)

    if (error || !data) {
      console.error(error)
      return
    }

    const filtered =
      filterTrades(data, filters)

    setAllTrades(filtered)

    const grouped:
      Record<
        string,
        {
          pnl: number
          trades: number
        }
      > = {}

    filtered.forEach((trade) => {

      if (!trade.entrada_time) return

      const date =
        new Date(trade.entrada_time)
          .toISOString()
          .split("T")[0]

      if (!grouped[date]) {

        grouped[date] = {
          pnl: 0,
          trades: 0
        }
      }

      grouped[date].pnl +=
        Number(trade.resultado || 0)

      grouped[date].trades += 1
    })

    const formatted =
      Object.entries(grouped)
        .map(([date, values]) => ({
          date,
          pnl: values.pnl,
          trades: values.trades
        }))
        .sort((a, b) =>
          b.date.localeCompare(a.date)
        )

    setDays(formatted)
  }

  return (

    <AppCard title="Trading Calendar">

      {/* GRID */}

      <div className="
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-4
        xl:grid-cols-4
      ">

        {days.map((day) => {

          const positive =
            day.pnl >= 0

          return (

            <div
              key={day.date}
              onClick={() => {

                setSelectedDay(day)

                const tradesOfDay =
                  allTrades.filter((trade) => {

                    if (!trade.entrada_time)
                      return false

                    const tradeDate =
                      new Date(trade.entrada_time)
                        .toISOString()
                        .split("T")[0]

                    return tradeDate === day.date
                  })

                setSelectedTrades(tradesOfDay)
              }}

              className={`
                rounded-2xl
                border
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:scale-[1.02]
                hover:shadow-2xl
                cursor-pointer

                ${
                  positive
                    ? `
                      border-emerald-900/40
                      bg-emerald-950/20
                    `
                    : `
                      border-rose-900/40
                      bg-rose-950/20
                    `
                }
              `}
            >

              <p className="
                mb-3
                text-xs
                uppercase
                tracking-wide
                text-zinc-400
              ">

                {new Date(day.date)
                  .toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric"
                    }
                  )}

              </p>

              <h3
                className={`
                  text-xl
                  break-all
                  font-bold

                  ${
                    positive
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                `}
              >

                {positive ? "+" : ""}

                {day.pnl.toFixed(2)}

              </h3>

              <p className="
                mt-2
                text-sm
                text-zinc-400
              ">

                {day.trades} trades

              </p>

            </div>
          )
        })}

      </div>

      {/* DRAWER */}

      {selectedDay && (

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900/50
            p-6
          "
        >

          {/* HEADER */}

          <div className="
            mb-4
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-zinc-400
              ">
                Selected Day
              </p>

              <h2 className="
                text-2xl
                font-bold
                text-white
              ">

                {new Date(selectedDay.date)
                  .toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    }
                  )}

              </h2>

            </div>

            <button
              onClick={() =>
                setSelectedDay(null)
              }
              className="
                rounded-lg
                border
                border-zinc-700
                px-3
                py-2
                text-sm
                text-zinc-300
                hover:bg-zinc-800
              "
            >
              Close
            </button>

          </div>

          {/* SUMMARY */}

          <div className="
            flex
            flex-col
            gap-4
          ">

            {/* DAILY PNL */}

            <div
              className="
                rounded-xl
                bg-zinc-950/60
                p-4
              "
            >

              <p className="
                text-sm
                text-zinc-400
              ">
                Daily PnL
              </p>

              <h3
                className={`
                  mt-2
                  text-2xl
                  font-bold

                  ${
                    selectedDay.pnl >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                `}
              >

                {selectedDay.pnl >= 0
                  ? "+"
                  : ""}

                {selectedDay.pnl.toFixed(2)}

              </h3>

            </div>

            {/* TRADES COUNT */}

            <div
              className="
                rounded-xl
                bg-zinc-950/60
                p-4
              "
            >

              <p className="
                text-sm
                text-zinc-400
              ">
                Trades
              </p>

              <h3 className="
                mt-2
                text-2xl
                font-bold
                text-white
              ">
                {selectedDay.trades}
              </h3>

            </div>

            {/* AI INSIGHTS */}

            <div
              className="
                rounded-xl
                bg-zinc-950/60
                p-4
              "
            >

              <p className="
                text-sm
                text-zinc-400
              ">
                AI Insight
              </p>

              <div className="
                mt-3
                space-y-3
              ">

                {behaviorInsights.map(
                  (insight, index) => (

                    <div
                      key={index}
                      className="
                        rounded-xl
                        border
                        border-zinc-800
                        bg-zinc-950/40
                        p-3
                      "
                    >

                      <p className="
                        text-sm
                        leading-relaxed
                        text-zinc-300
                      ">

                        {insight}

                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* TRADES LIST */}

            <div>

              <h3 className="
                mb-4
                text-lg
                font-semibold
                text-white
              ">
                Trades
              </h3>

              <div className="space-y-3">

                {selectedTrades.map(
                  (trade, index) => {

                    const positive =
                      Number(trade.resultado) >= 0

                    return (

                      <div
                        key={index}
                        className="
                          rounded-xl
                          border
                          border-zinc-800
                          bg-zinc-950/40
                          p-4
                        "
                      >

                        <div className="
                          flex
                          items-center
                          justify-between
                        ">

                          <div>

                            {/* BADGES */}

                            <div className="
                              flex
                              items-center
                              gap-2
                              flex-wrap
                            ">

                              {/* WIN / LOSS */}

                              <div
                                className={`
                                  inline-flex
                                  rounded-full
                                  px-2
                                  py-1
                                  text-[10px]
                                  font-semibold
                                  uppercase
                                  tracking-wide

                                  ${
                                    positive
                                      ? `
                                        bg-emerald-500/15
                                        text-emerald-400
                                      `
                                      : `
                                        bg-rose-500/15
                                        text-rose-400
                                      `
                                  }
                                `}
                              >

                                {positive
                                  ? "WIN"
                                  : "LOSS"}

                              </div>

                              {/* SETUP */}

                              <div className="
                                inline-flex
                                rounded-full
                                bg-zinc-800
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-zinc-300
                              ">

                                {trade.setup || "No setup"}

                              </div>

                              {/* SCENARIO */}

                              <div className="
                                inline-flex
                                rounded-full
                                bg-sky-500/10
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-sky-400
                              ">

                                {trade.cenario || "No scenario"}

                              </div>

                            </div>

                            {/* TIME */}

                            <p className="
                              mt-3
                              text-xs
                              text-zinc-500
                            ">

                              {trade.entrada_time
                                ? new Date(
                                    trade.entrada_time
                                  ).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    }
                                  )
                                : "--"}

                            </p>

                          </div>

                          {/* RESULT */}

                          <div
                            className={`
                              text-lg
                              font-bold

                              ${
                                positive
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }
                            `}
                          >

                            {positive ? "+" : ""}

                            {Number(
                              trade.resultado
                            ).toFixed(2)}

                          </div>

                        </div>

                      </div>
                    )
                  }
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </AppCard>
  )
}