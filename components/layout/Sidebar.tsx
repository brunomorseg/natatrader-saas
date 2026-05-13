"use client"

import Link from "next/link"

export default function Sidebar() {

  return (
    <aside className="w-50 border-r min-h-screen p-4 bg-background">

      {/* LOGO */}
      <div className="mb-8">

        <h1 className="text-2xl font-bold">
          NataTrader
        </h1>

        <p className="text-sm text-muted-foreground">
          Trading Analytics
        </p>

      </div>

      {/* MENU */}
      <nav className="space-y-2">

        <Link
          href="/dashboard-v2"
          className="block rounded-lg px-3 py-2 hover:bg-muted transition"
        >
          Dashboard
        </Link>

        <Link
          href="/journal"
          className="block rounded-lg px-3 py-2 hover:bg-muted transition"
        >
          Journal
        </Link>

        <Link
          href="/analytics"
          className="block rounded-lg px-3 py-2 hover:bg-muted transition"
        >
          Analytics
        </Link>

        <Link
          href="/playbook"
          className="block rounded-lg px-3 py-2 hover:bg-muted transition"
        >
          Playbook
        </Link>

        <Link
          href="/settings"
          className="block rounded-lg px-3 py-2 hover:bg-muted transition"
        >
          Settings
        </Link>

      </nav>

    </aside>
  )
}