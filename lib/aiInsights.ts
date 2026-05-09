export function generateAIInsights({
  trades,
  setupData,
  hourData,
  durationData,
  combinedData
}: any) {
  const insights: string[] = []

  if (!trades || trades.length < 3) {
    return ["Poucos dados ainda — continue operando para gerar insights."]
  }

  // 🔥 1. Melhor e pior setup
  if (setupData?.length) {
    const bestSetup = [...setupData].sort((a, b) => b.resultado - a.resultado)[0]
    const worstSetup = [...setupData].sort((a, b) => a.resultado - b.resultado)[0]

    if (bestSetup?.resultado > 0) {
      insights.push(
        `Seu melhor setup é ${bestSetup.setup} com resultado ${bestSetup.resultado.toFixed(2)}`
      )
    }

    if (worstSetup?.resultado < 0) {
      insights.push(
        `Evite o setup ${worstSetup.setup}, está negativo (${worstSetup.resultado.toFixed(2)})`
      )
    }
  }

  // 🔥 2. Horário
  if (hourData?.length) {
    const bestHour = [...hourData].sort((a, b) => b.resultado - a.resultado)[0]
    const worstHour = [...hourData].sort((a, b) => a.resultado - b.resultado)[0]

    if (bestHour) {
      insights.push(
        `Melhor horário: ${bestHour.hour}h com resultado ${bestHour.resultado.toFixed(2)}`
      )
    }

    if (worstHour?.resultado < 0) {
      insights.push(
        `Cuidado com ${worstHour.hour}h — prejuízo de ${worstHour.resultado.toFixed(2)}`
      )
    }
  }

  // 🔥 3. Duração
  if (durationData?.length) {
    const best = [...durationData].sort((a, b) => b.resultado - a.resultado)[0]
    const worst = [...durationData].sort((a, b) => a.resultado - b.resultado)[0]

    if (best) {
      insights.push(
        `Melhor duração: ${best.label} (${best.resultado.toFixed(2)})`
      )
    }

    if (worst?.resultado < 0) {
      insights.push(
        `Trades em ${worst.label} estão negativos (${worst.resultado.toFixed(2)})`
      )
    }
  }

  // 🔥 4. Padrão mais lucrativo (combinação)
  if (combinedData?.length) {
    const bestCombo = combinedData[0]

    if (bestCombo?.resultado > 0) {
      insights.push(
        `Seu melhor padrão é ${bestCombo.setup} às ${bestCombo.hour}h com duração ${bestCombo.duration}`
      )
    }
  }

  return insights
}