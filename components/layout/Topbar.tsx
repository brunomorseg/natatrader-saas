"use client"

export default function Topbar() {

  return (
    <div className="flex items-center justify-between mb-6">

      {/* LEFT */}
      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Trading performance overview
        </p>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <button className="border rounded-lg px-4 py-2 hover:bg-muted transition">
          Hoje
        </button>

        <button className="border rounded-lg px-4 py-2 hover:bg-muted transition">
          7D
        </button>

        <button className="border rounded-lg px-4 py-2 hover:bg-muted transition">
          30D
        </button>

        <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
          Import CSV
        </button>

      </div>

    </div>
  )
}