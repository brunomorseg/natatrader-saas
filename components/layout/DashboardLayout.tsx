import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({
  children
}: DashboardLayoutProps) {

  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-6">
         <Topbar />
        {children}
      </main>

    </div>
  )
}