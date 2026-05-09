"use client"

export default function SetupAnalysis({ data }: any) {
  if (!data || data.length === 0) {
    return <p>Nenhum dado de setup</p>
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">
        Performance por Setup
      </h2>

      <div className="space-y-2">
        {data.map((s: any, i: number) => (
          <div
            key={i}
            className="border p-3 rounded"
          >
            <p className="font-bold">{s.setup}</p>
            <p>Trades: {s.total}</p>
            <p>Win Rate: {s.winRate.toFixed(2)}%</p>
            <p>Resultado: {s.resultado.toFixed(2)}</p>
            <p>Média: {s.avg.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}