"use client"

export default function AINarrative({ text }: any) {
  if (!text) return null

  return (
    <div className="mt-6 border p-4 rounded bg-blue-50">
      <h2 className="text-xl font-bold mb-2">
        Análise Inteligente
      </h2>

      <p className="leading-relaxed">
        {text}
      </p>
    </div>
  )
}