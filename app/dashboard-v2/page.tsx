import DashboardLayout from "@/components/layout/DashboardLayout"
import KPISection from "@/components/dashboard-v2/KPISection"
import DashboardTabs from "@/components/dashboard-v2/DashboardTabs"
import {TradingFiltersProvider} from "@/contexts/TradingFiltersContext"

export default function DashboardV2() {

  return (
    <DashboardLayout>
      <TradingFiltersProvider>
      <div className="space-y-6">

        <KPISection />

        <DashboardTabs />

      </div>
    </TradingFiltersProvider>
    </DashboardLayout>
  )
}