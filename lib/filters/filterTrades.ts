interface Trade {

  resultado: number

  setup?: string

  cenario?: string

  entrada_time?: string
}

interface Filters {

  period: string

  setup: string

  scenario: string
}

export function filterTrades(
  trades: Trade[],
  filters: Filters
) {

  let filtered = [...trades]

  // =====================================
  // PERIOD
  // =====================================

  if (filters.period !== "all") {

    const now = new Date()

    const days =
      filters.period === "7d"
        ? 7
        : filters.period === "30d"
        ? 30
        : 90

    const cutoff = new Date()

    cutoff.setDate(
      now.getDate() - days
    )

    filtered = filtered.filter(
      trade =>
        trade.entrada_time &&
        new Date(trade.entrada_time) >= cutoff
    )
  }

  // =====================================
  // SETUP
  // =====================================

  if (filters.setup !== "all") {

    filtered = filtered.filter(
      trade =>
        trade.setup?.toLowerCase() ===
        filters.setup.toLowerCase()
    )
  }

  // =====================================
  // SCENARIO
  // =====================================

  if (filters.scenario !== "all") {

    filtered = filtered.filter(
      trade =>
        trade.cenario?.toLowerCase() ===
        filters.scenario.toLowerCase()
    )
  }

  return filtered
}