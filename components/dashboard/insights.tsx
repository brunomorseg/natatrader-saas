"use client"

type Props = {
  insights: string[]
}

export default function Insights({ insights }: Props) {
  if (!insights.length) {
    return <p>Nenhum insight ainda (mais dados necessários)</p>
  }

  return (
    <div className="space-y-3 mt-6">
      <h2 className="text-xl font-bold">Insights</h2>

      {insights.map((insight, i) => (
        <div key={i} className="border p-3 rounded bg-yellow-50">
          ⚡ {insight}
        </div>
      ))}
    </div>
  )
}