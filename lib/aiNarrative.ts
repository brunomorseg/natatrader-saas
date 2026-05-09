export function generateNarrative({
  setupData,
  hourData,
  durationData,
  combinedData
}: any) {
  let text = ""

  // 🔥 Setup
  if (setupData?.length) {
    const best = [...setupData].sort((a, b) => b.resultado - a.resultado)[0]
    const worst = [...setupData].sort((a, b) => a.resultado - b.resultado)[0]

    if (best) {
      text += `Você apresentou melhor desempenho no setup ${best.setup}, `
      text += `com resultado acumulado de ${best.resultado.toFixed(2)}. `
    }

    if (worst?.resultado < 0) {
      text += `Por outro lado, o setup ${worst.setup} apresentou desempenho negativo, `
      text += `indicando possível necessidade de ajuste ou exclusão da estratégia. `
    }
  }

  // 🔥 Horário
  if (hourData?.length) {
    const bestHour = [...hourData].sort((a, b) => b.resultado - a.resultado)[0]
    const worstHour = [...hourData].sort((a, b) => a.resultado - b.resultado)[0]

    if (bestHour) {
      text += `Seu melhor desempenho ocorre por volta das ${bestHour.hour}h. `
    }

    if (worstHour?.resultado < 0) {
      text += `Já o período das ${worstHour.hour}h apresenta resultados negativos recorrentes. `
    }
  }

  // 🔥 Duração
  if (durationData?.length) {
    const best = [...durationData].sort((a, b) => b.resultado - a.resultado)[0]
    const worst = [...durationData].sort((a, b) => a.resultado - b.resultado)[0]

    if (best) {
      text += `Trades com duração de ${best.label} apresentam melhor performance. `
    }

    if (worst?.resultado < 0) {
      text += `Já trades mais longos (${worst.label}) tendem a gerar prejuízo. `
    }
  }

  // 🔥 Combinação
  if (combinedData?.length) {
    const best = combinedData[0]

    if (best) {
      text += `O padrão mais lucrativo identificado foi ${best.setup} às ${best.hour}h com duração ${best.duration}. `
    }
  }

  // 🔥 Conclusão inteligente
  text += `Com base nesses dados, você demonstra um perfil mais eficiente quando segue seus melhores setups, `
  text += `opera nos horários de maior performance e mantém disciplina na duração dos trades.`

  return text
}