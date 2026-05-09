"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { calculateDuration } from "@/lib/analysis"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TradeList() {

  const [trades, setTrades] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [selectedTrades, setSelectedTrades] = useState<string[]>([])

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id)
      .order("data_hora", { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setTrades(data || [])
  }

  async function deleteTrade(id: string) {

    await supabase
      .from("trades")
      .delete()
      .eq("id", id)

    fetchTrades()
  }

  function startEdit(trade: any) {
    setEditingId(trade.id)
    setEditData(trade)
  }

  function handleChange(e: any) {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  async function saveEdit() {

    await supabase
      .from("trades")
      .update({
        ativo: editData.ativo,
        entrada: Number(editData.entrada),
        saida: Number(editData.saida),
        resultado: Number(editData.resultado),
        lote: Number(editData.lote),
        setup: editData.setup,
        cenario: editData.cenario
      })
      .eq("id", editingId)

    setEditingId(null)

    fetchTrades()
  }
  function toggleSelect(id: string) {

  setSelectedTrades((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
  )
}

function selectAll() {

  if (selectedTrades.length === trades.length) {
    setSelectedTrades([])
  } else {
    setSelectedTrades(trades.map((t) => t.id))
  }
}

async function deleteSelected() {

  if (selectedTrades.length === 0) return

  await supabase
    .from("trades")
    .delete()
    .in("id", selectedTrades)

  setSelectedTrades([])

  fetchTrades()
}

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-4">

  <button
    onClick={selectAll}
    className="bg-zinc-200 hover:bg-zinc-300 px-4 py-2 rounded-xl"
  >
    {selectedTrades.length === trades.length
      ? "Desmarcar Todos"
      : "Selecionar Todos"}
  </button>

  <button
    onClick={deleteSelected}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
  >
    Deletar Selecionados
  </button>

</div>

      {trades.length === 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <p className="text-zinc-500">
            Nenhum trade encontrado.
          </p>
        </div>
      )}

      {trades.map((t) => (

        <div
          key={t.id}
          className="bg-white border border-zinc-100 shadow-sm p-5 rounded-2xl"
        >
          <div className="flex justify-between items-start">

  <input
    type="checkbox"
    checked={selectedTrades.includes(t.id)}
    onChange={() => toggleSelect(t.id)}
    className="w-5 h-5 mt-1"
  />

</div>

          {editingId === t.id ? (

            <div className="grid grid-cols-2 gap-3">

              <input
                name="ativo"
                value={editData.ativo || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                name="setup"
                value={editData.setup || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                name="cenario"
                value={editData.cenario || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                name="entrada"
                value={editData.entrada || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                name="saida"
                value={editData.saida || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                name="lote"
                value={editData.lote || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <input
                name="resultado"
                value={editData.resultado || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <div className="flex gap-2 mt-2">

                <button
                  onClick={saveEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Salvar
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="bg-zinc-300 px-4 py-2 rounded-xl"
                >
                  Cancelar
                </button>

              </div>

            </div>

          ) : (

            <div className="space-y-3">

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="text-xl font-bold text-zinc-800">
                    {t.ativo}
                  </h3>

                  <p className="text-zinc-500">
                    {t.setup || "Sem setup"}
                  </p>

                </div>

                <div
                  className={`text-lg font-bold ${
                    Number(t.resultado) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.resultado}
                </div>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">

                <div>
                  <p className="text-zinc-400">Entrada</p>
                  <p className="font-medium text-zinc-700">
                    {t.entrada}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-400">Saída</p>
                  <p className="font-medium text-zinc-700">
                    {t.saida}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-400">Lote</p>
                  <p className="font-medium text-zinc-700">
                    {t.lote}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-400">Duração</p>
                  <p className="font-medium text-zinc-700">
                    {calculateDuration(t) ?? 0} min
                  </p>
                </div>

              </div>

              {t.cenario && (

                <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-xl">

                  <p className="text-sm text-zinc-500 mb-1">
                    Cenário
                  </p>

                  <p className="text-zinc-700">
                    {t.cenario}
                  </p>

                </div>

              )}

              <div className="flex gap-2 pt-2">

                <button
                  onClick={() => startEdit(t)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Editar
                </button>

                <button
                  onClick={() => deleteTrade(t.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Deletar
                </button>

              </div>

            </div>

          )}

        </div>

      ))}

    </div>
  )
}