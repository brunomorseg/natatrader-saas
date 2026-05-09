"use client"

import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">

      <h1 className="text-2xl font-bold text-zinc-800 mb-10">
        Trade SaaS
      </h1>

      <nav className="space-y-3">

        <Link
          href="/dashboard"
          className="block p-3 rounded-xl hover:bg-zinc-100 text-zinc-700"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/trades/new"
          className="block p-3 rounded-xl hover:bg-zinc-100 text-zinc-700"
        >
          Novo Trade
        </Link>

        <Link
          href="/dashboard/import"
          className="block p-3 rounded-xl hover:bg-zinc-100 text-zinc-700"
        >
          Importar CSV
        </Link>

      </nav>
    </aside>
  )
}