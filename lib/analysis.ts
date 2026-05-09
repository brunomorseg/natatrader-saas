export function analyzeBySetup(trades: any[]) {
  if (!trades || trades.length === 0) return []

  const map: Record<string, any> = {}

  trades.forEach((t) => {
    const setup = t.setup || "Sem setup"

    if (!map[setup]) {
      map[setup] = {
        setup,
        total: 0,
        resultado: 0,
        wins: 0
      }
    }

    map[setup].total += 1
    map[setup].resultado += Number(t.resultado)

    if (Number(t.resultado) > 0) {
      map[setup].wins += 1
    }
  })

  return Object.values(map).map((s: any) => ({
    ...s,
    winRate: (s.wins / s.total) * 100,
    avg: s.resultado / s.total
  }))
}

export function analyzeByHour(trades: any[]) {
  if (!trades || trades.length === 0) return []

  const map: Record<string, any> = {}

  trades.forEach((t) => {
    if (!t.data_hora) return

    const date = new Date(t.data_hora)
    const hour = date.getHours()

    if (!map[hour]) {
      map[hour] = {
        hour,
        total: 0,
        resultado: 0,
        wins: 0
      }
    }

    map[hour].total += 1
    map[hour].resultado += Number(t.resultado)

    if (Number(t.resultado) > 0) {
      map[hour].wins += 1
    }
  })

  return Object.values(map)
    .map((h: any) => ({
      ...h,
      winRate: (h.wins / h.total) * 100,
      avg: h.resultado / h.total
    }))
    .sort((a: any, b: any) => a.hour - b.hour)
}

export function calculateDuration(trade: any) {
  if (!trade.entrada_time || !trade.saida_time) return null

  const start = new Date(trade.entrada_time)
  const end = new Date(trade.saida_time)

  const diffMs = end.getTime() - start.getTime()
  const minutes = Math.floor(diffMs / 60000)

  return minutes
}

export function analyzeByDuration(trades: any[]) {
  if (!trades || trades.length === 0) return []

  const groups = {
    "0-5": { label: "0-5 min", total: 0, resultado: 0, wins: 0 },
    "5-15": { label: "5-15 min", total: 0, resultado: 0, wins: 0 },
    "15+": { label: "15+ min", total: 0, resultado: 0, wins: 0 }
  }

  trades.forEach((t) => {
    if (!t.entrada_time || !t.saida_time) return

    const start = new Date(t.entrada_time)
    const end = new Date(t.saida_time)

    const minutes = (end.getTime() - start.getTime()) / 60000

    let key: "0-5" | "5-15" | "15+" = "15+"
    if (minutes <= 5) key = "0-5"
    else if (minutes <= 15) key = "5-15"

    groups[key].total += 1
    groups[key].resultado += Number(t.resultado)

    if (Number(t.resultado) > 0) {
      groups[key].wins += 1
    }
  })

  return Object.values(groups).map((g: any) => ({
    ...g,
    winRate: g.total ? (g.wins / g.total) * 100 : 0,
    avg: g.total ? g.resultado / g.total : 0
  }))
}

export function analyzeCombined(trades: any[]) {
  if (!trades || trades.length === 0) return []

  const map: Record<string, any> = {}

  trades.forEach((t) => {
    if (!t.entrada_time || !t.saida_time) return

    const setup = t.setup || "Sem setup"

    const start = new Date(t.entrada_time)
    const end = new Date(t.saida_time)

    const hour = start.getHours()
    const minutes = (end.getTime() - start.getTime()) / 60000

    // 🎯 classificação duração
    let duration = "15+"
    if (minutes <= 5) duration = "0-5"
    else if (minutes <= 15) duration = "5-15"

    const key = `${setup}|${hour}|${duration}`

    if (!map[key]) {
      map[key] = {
        setup,
        hour,
        duration,
        total: 0,
        resultado: 0,
        wins: 0
      }
    }

    map[key].total += 1
    map[key].resultado += Number(t.resultado)

    if (Number(t.resultado) > 0) {
      map[key].wins += 1
    }
  })

  return Object.values(map)
    .map((g: any) => ({
      ...g,
      winRate: g.total ? (g.wins / g.total) * 100 : 0,
      avg: g.total ? g.resultado / g.total : 0
    }))
    .sort((a: any, b: any) => b.resultado - a.resultado)
}