"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"

import TradeListV2 from "@/components/dashboard-v2/TradeListv2"
import EquityCurveChart from "./EquityCurveChart"
import PerformanceByHourChart from "./PerformanceByHourChart"
import SetupAnalysisChart from "./SetupAnalysisChart"
import ScenarioAnalysisChart from "./ScenarioAnalysisChart"
import WinRateBySetupChart from "./WinRateBySetupChart"
import BestWorstDays from "./BestWorstDays"
import AIInsightsCard from "@/lib/ai/AIInsightsCard"
import FilterBar from "./FilterBar"
import TradingCalendar from "./TradingCalendar"

export default function DashboardTabs() {

  return (
    <Tabs
      defaultValue="overview"
      className="space-y-6"
    >

      {/* TAB BUTTONS */}
      <TabsList
  className="
    bg-muted
    p-1
    rounded-xl
    inline-flex
    gap-1
  "
>

        <TabsTrigger
  value="overview"
  className="
    rounded-lg
    px-4
    py-2
    text-sm
    font-medium
    data-[state=active]:bg-background
    data-[state=active]:shadow-sm
  "
>
  Overview
</TabsTrigger>

        <TabsTrigger
  value="trades"
  className="
    rounded-lg
    px-4
    py-2
    text-sm
    font-medium
    data-[state=active]:bg-background
    data-[state=active]:shadow-sm
  "
>
  Trades
</TabsTrigger>

        <TabsTrigger
  value="analytics"
  className="
    rounded-lg
    px-4
    py-2
    text-sm
    font-medium
    data-[state=active]:bg-background
    data-[state=active]:shadow-sm
  "
>
  Analytics
</TabsTrigger>

        <TabsTrigger
  value="ai"
  className="
    rounded-lg
    px-4
    py-2
    text-sm
    font-medium
    data-[state=active]:bg-background
    data-[state=active]:shadow-sm
  "
>
  AI Insights
</TabsTrigger>

      </TabsList>

      {/* OVERVIEW */}
      <TabsContent value="overview">

        <div className="space-y-6">

          <div className="grid gap-6 xl:grid-cols-2">
          <EquityCurveChart />
          <TradingCalendar />
          
          {/*Coloque aqui o calendar*/}
          </div>
          
          <div className="grid gap-6 xl:grid-cols-2">
            <PerformanceByHourChart />
            <ScenarioAnalysisChart />

          </div>

          <div className="grid gap-6 xl:grid-cols-2">

              <SetupAnalysisChart />

              <WinRateBySetupChart />

          </div>        

          
          <BestWorstDays />

          <AIInsightsCard />

          <FilterBar />

          <div className="border rounded-xl p-6">
            Performance
          </div>

        </div>

      </TabsContent>

      {/* TRADES */}
      <TabsContent value="trades">

        <TradeListV2 />

      </TabsContent>

      {/* ANALYTICS */}
      <TabsContent value="analytics">

        <div className="border rounded-xl p-6">
          Analytics
        </div>

      </TabsContent>

      {/* AI */}
      <TabsContent value="ai">

        <div className="border rounded-xl p-6">
          AI Insights
        </div>

      </TabsContent>

    </Tabs>
  )
}