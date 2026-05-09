export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
     {/*  <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">
          Trade SaaS
        </h2>

        <nav className="space-y-2">
          <a href="/dashboard" className="block">
            Dashboard
          </a>

          <a href="/dashboard/trades/new" className="block">
            Novo Trade
          </a>
        </nav>
      </aside>*/}

      {/* Conteúdo */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>

    </div>
  )
}