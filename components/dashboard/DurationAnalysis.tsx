"use client"

export default function DurationAnalysis({ data }: any) {
  if (!data || data.length === 0) {
    return <p>Nenhum dado de duração</p>
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">
        Performance por Duração
      </h2>

      <div className="space-y-2">
        {data.map((d: any, i: number) => (
          <div key={i} className="border p-3 rounded">
            <p className="font-bold">{d.label}</p>
            <p>Trades: {d.total}</p>
            <p>Win Rate: {d.winRate.toFixed(2)}%</p>
            <p>Resultado: {d.resultado.toFixed(2)}</p>
            <p>Média: {d.avg.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}