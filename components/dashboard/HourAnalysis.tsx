"use client"

export default function HourAnalysis({ data }: any) {
  if (!data || data.length === 0) {
    return <p>Nenhum dado por horário</p>
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">
        Performance por Horário
      </h2>

      <div className="space-y-2">
        {data.map((h: any, i: number) => (
          <div key={i} className="border p-3 rounded">
            <p className="font-bold">
              {h.hour}h
            </p>
            <p>Trades: {h.total}</p>
            <p>Win Rate: {h.winRate.toFixed(2)}%</p>
            <p>Resultado: {h.resultado.toFixed(2)}</p>
            <p>Média: {h.avg.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}