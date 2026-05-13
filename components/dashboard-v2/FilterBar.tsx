"use client"

import {
  useTradingFilters
} from "@/contexts/TradingFiltersContext"

import AppCard from "@/components/ui-custom/AppCard"

export default function FilterBar() {

  const {
    filters,
    setFilters
  } = useTradingFilters()

  return (

    <AppCard title="Filters">

      <div className="
        flex
        flex-wrap
        gap-4
      ">

        {/* PERIOD */}

        <select
          value={filters.period}
          onChange={(e) =>
            setFilters(prev => ({
              ...prev,
              period: e.target.value
            }))
          }
          className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            px-4
            py-2
            text-sm
            text-zinc-200
          "
        >

          <option value="7d">
            Last 7 days
          </option>

          <option value="30d">
            Last 30 days
          </option>

          <option value="90d">
            Last 90 days
          </option>

          <option value="all">
            All time
          </option>

        </select>

        {/* SETUP */}

        <select
          value={filters.setup}
          onChange={(e) =>
            setFilters(prev => ({
              ...prev,
              setup: e.target.value
            }))
          }
          className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            px-4
            py-2
            text-sm
            text-zinc-200
          "
        >

          <option value="all">
            All setups
          </option>

          <option value="trap">
            Trap
          </option>

          <option value="breakout">
            Breakout
          </option>

        </select>

        {/* SCENARIO */}

        <select
          value={filters.scenario}
          onChange={(e) =>
            setFilters(prev => ({
              ...prev,
              scenario: e.target.value
            }))
          }
          className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            px-4
            py-2
            text-sm
            text-zinc-200
          "
        >

          <option value="all">
            All scenarios
          </option>

          <option value="trend">
            Trend
          </option>

          <option value="range">
            Range
          </option>

        </select>

      </div>

    </AppCard>
  )
}