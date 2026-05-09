"use client"


export default function AIInsights({ insights }: any) {
  if (!insights || insights.length === 0) {
    return null
  }

  return (
    <div className="mt-6 border p-4 rounded bg-yellow-50">
      <h2 className="text-xl font-bold mb-2">
        Insights Inteligentes
      </h2>

      <ul className="list-disc pl-5 space-y-1">
        {insights.map((i: string, index: number) => (
          <li key={index}>{i}</li>
        ))}
      </ul>
    </div>
  )
}