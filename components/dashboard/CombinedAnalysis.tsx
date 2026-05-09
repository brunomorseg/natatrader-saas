"use client"

export default function CombinedAnalysis({ data }: any) {
  if (!data || data.length === 0) {
    return <p>Nenhum dado combinado</p>
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">
        Análise Combinada (Setup + Hora + Duração)
      </h2>

      <div className="space-y-2">
        {data.slice(0, 10).map((d: any, i: number) => (
          <div key={i} className="border p-3 rounded">
            <p className="font-bold">
              {d.setup} | {d.hour}h | {d.duration}
            </p>

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