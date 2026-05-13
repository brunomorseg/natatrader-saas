"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import ReactMarkdown from "react-markdown"
import TradeCard from "@/components/ui-custom/TraderCard"
import { generateInsights} from "@/lib/ai/generateInsights"
import {generateCoachMessage} from "@/lib/ai/generateCoachMessage"
import {generateEmotionStats} from "@/lib/ai/generateEmotionStats"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Trade {
  id: string
  resultado: number
  entrada_time?: string
  data_hora?: string
  setup?: string
  cenario?: string
  observacoes?: string
  tags?: string[]
  screenshot_url?: string
}

export default function TradeListV2() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({})
  const [selectedTrades, setSelectedTrades] = useState<string[]>([])
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSaving, setIsSaving] = useState<"idle" | "saving" | "error">("idle")
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [fullscreenImage,setFullscreenImage] = useState<string | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [ loadingAI, setLoadingAI] = useState(false)

  useEffect(() => {
    fetchTrades()
  }, [])

  useEffect(() => {

  if (trades.length >= 5) {
    generateAIAnalysis()
  }

}, [trades])

  // Fechar drawer com Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false)
        setEditingTrade(null)
      }
    }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [])

  // Autosave de observacoes com debounce
  useEffect(() => {
    if (!editingTrade) return

    const timeout = setTimeout(async () => {
      setIsSaving("saving")

      const { error } = await supabase
        .from("trades")
        .update({ observacoes: editingTrade.observacoes })
        .eq("id", editingTrade.id)

      if (error) {
        console.error("Autosave falhou:", error)
        setIsSaving("error")
      } else {
        setIsSaving("idle")
      }
    }, 1200)

    return () => clearTimeout(timeout)
  }, [editingTrade?.observacoes, editingTrade?.id])

  async function fetchTrades() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("entrada_time", { ascending: false })

      if (error) {
        console.error("Erro ao buscar trades:", error)
        return
      }

      if (data) setTrades(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteTrade(id: string) {
    try {
      const { error } = await supabase
        .from("trades")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Erro ao deletar trade:", error)
        return
      }

      setTrades((prev) => prev.filter((trade) => trade.id !== id))
      setSelectedTrades((prev) => prev.filter((tradeId) => tradeId !== id))
    } catch (err) {
      console.error(err)
    }
  }

  async function bulkDeleteTrades() {
    if (selectedTrades.length === 0) return

    try {
      const { error } = await supabase
        .from("trades")
        .delete()
        .in("id", selectedTrades)

      if (error) {
        console.error("Erro ao deletar trades:", error)
        return
      }

      setTrades((prev) =>
        prev.filter((trade) => !selectedTrades.includes(trade.id))
      )
      setSelectedTrades([])
      setShowDeleteConfirm(false)
    } catch (err) {
      console.error(err)
    }
  }

  async function saveTrade() {
    if (!editingTrade) return

    try {
      const { error } = await supabase
        .from("trades")
        .update({
          setup: editingTrade.setup,
          cenario: editingTrade.cenario,
          resultado: editingTrade.resultado,
          observacoes: editingTrade.observacoes,
          tags: editingTrade.tags,
        })
        .eq("id", editingTrade.id)

      if (error) {
        console.error("Erro ao salvar trade:", error)
        return
      }

      setTrades((prev) =>
        prev.map((trade) =>
          trade.id === editingTrade.id ? editingTrade : trade
        )
      )

      setIsDrawerOpen(false)
      setEditingTrade(null)
    } catch (err) {
      console.error(err)
    }
  }

  function toggleDay(date: string) {
    setOpenDays((prev) => ({ ...prev, [date]: !prev[date] }))
  }

  function toggleTradeSelection(id: string) {
    setSelectedTrades((prev) =>
      prev.includes(id)
        ? prev.filter((tradeId) => tradeId !== id)
        : [...prev, id]
    )
  }

  const filteredTrades =
  trades.filter((trade) => {

    const text = `
      ${trade.setup || ""}
      ${trade.cenario || ""}
      ${trade.observacoes || ""}
      ${(trade.tags || []).join(" ")}
    `.toLowerCase()

    return text.includes(
      search.toLowerCase()
    )
  })

  const groupedTrades = useMemo(() => {
    return filteredTrades.reduce((acc, trade) => {
      const rawDate = trade.entrada_time || trade.data_hora
      if (!rawDate) return acc

      const date = new Date(rawDate).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      if (!acc[date]) acc[date] = []
      acc[date].push(trade)
      return acc
    }, {} as Record<string, Trade[]>)
  }, [trades])



  const savingLabel =
    isSaving === "saving"
      ? "Salvando..."
      : isSaving === "error"
      ? "Erro ao salvar"
      : "Salvo automaticamente"

  const pnlFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const insights = generateInsights(trades)

  async function uploadScreenshot(
  e: React.ChangeEvent<HTMLInputElement>
) {

  if (
    !e.target.files ||
    !editingTrade
  ) return

  const file =
    e.target.files[0]

  const filePath =
    `${editingTrade.id}-${Date.now()}`

  const { error } =
    await supabase.storage
      .from("trade-screenshots")
      .upload(filePath, file)

  if (error) {
    console.error(error)
    return
  }

  const { data } =
    supabase.storage
      .from("trade-screenshots")
      .getPublicUrl(filePath)

  const publicUrl =
    data.publicUrl

  setEditingTrade({
    ...editingTrade,
    screenshot_url: publicUrl
  })

  await supabase
    .from("trades")
    .update({
      screenshot_url:
        publicUrl
    })
    .eq("id", editingTrade.id)
}

  const coachMessage =
    generateCoachMessage(
    trades
  )

  const currentTradeIndex =
  trades.findIndex(
    (trade) =>
      trade.id === editingTrade?.id
  )

  const previousTrade = currentTradeIndex > 0 ? trades[currentTradeIndex - 1] : null

  const nextTrade =currentTradeIndex < trades.length - 1 ? trades[currentTradeIndex + 1] : null

  const emotionStats =generateEmotionStats(trades)

  async function generateAIAnalysis() {

  try {

    setLoadingAI(true)

    const response =
      await fetch(
        "/api/ai-analysis",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            trades
          })
        }
      )

    const data =
      await response.json()

    setAiAnalysis(
      data.insight || ""
    )

  } catch (error) {

    console.error(error)

  } finally {

    setLoadingAI(false)
  }
}

  return (
    <div className="space-y-8">
      {/* BULK ACTION BAR  SEACRCH*/}
      {selectedTrades.length > 0 && (
        
        <div
          className="
            sticky top-4 z-50 mb-6
            flex items-center justify-between
            rounded-2xl border border-zinc-800
            bg-zinc-900/95 p-4 backdrop-blur
          "
        >
          <div>
            <p className="text-sm text-zinc-400">Trades selecionados</p>
            <h3 className="text-lg font-bold text-white">
              {selectedTrades.length}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTrades([])}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Limpar
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Deletar
            </button>
          </div>
        </div>
      )}

      

      {/* MODAL DE CONFIRMAÇÃO DE DELEÇÃO */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Confirmar deleção</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Você está prestes a deletar{" "}
              <span className="font-semibold text-white">
                {selectedTrades.length} trade
                {selectedTrades.length !== 1 ? "s" : ""}
              </span>
              . Essa ação não pode ser desfeita.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                Cancelar
              </button>
              <button
                onClick={bulkDeleteTrades}
                className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Sim, deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          Carregando trades...
        </div>
      )}

      {/* AI ANALYSIS */}

<div
  className="
    mb-6
    rounded-3xl
    border
    border-sky-900/40
    bg-sky-950/20
    p-6
  "
>

  <div className="
    mb-4
    flex
    items-center
    justify-between
  ">

    <div>

      <p className="
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-sky-400
      ">
        AI Analysis
      </p>

      <h3 className="
        mt-1
        text-xl
        font-bold
        text-white
      ">
        Trading Psychology
      </h3>

    </div>

    {loadingAI && (

      <div className="
        text-sm
        text-zinc-400
      ">
        Analyzing...
      </div>

    )}

  </div>

  <p className="
    whitespace-pre-line
    text-sm
    leading-relaxed
    text-zinc-100
  ">

    {aiAnalysis ||
      "Waiting for AI analysis..."}

  </p>

</div>

      {/* AI INSIGHTS */}

      {coachMessage && (

  <div
    className="
      mb-6
      rounded-3xl
      border
      border-sky-900/40
      bg-sky-950/20
      p-6
    "
  >

    <p className="
      mb-2
      text-xs
      font-semibold
      uppercase
      tracking-wide
      text-sky-500
    ">
      AI Coach
    </p>

    {emotionStats.length > 0 && (

  <div className="
    mb-6
    rounded-3xl
    border
    border-zinc-800
    bg-zinc-900/50
    p-6
  ">

    <h3 className="
      mb-5
      text-lg
      font-bold
      text-white
    ">
      Emotional Analytics
    </h3>

    <div className="
      grid
      gap-4
      sm:grid-cols-2
      xl:grid-cols-4
    ">

      {emotionStats.map(
        (emotion) => {

          const positive =
            emotion.pnl >= 0

          return (

            <div
              key={emotion.tag}
              className="
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-950/40
                p-4
              "
            >

              <p className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
              ">
                {emotion.tag}
              </p>

              <h3
                className={`
                  mt-2
                  text-2xl
                  font-bold

                  ${
                    positive
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                `}
              >

                {positive ? "+" : ""}
                {emotion.pnl.toFixed(2)}

              </h3>

              <p className="
                mt-2
                text-sm
                text-zinc-500
              ">
                {emotion.trades} trades
              </p>

            </div>
          )
        }
      )}

    </div>

  </div>
)}

    <p className="
      text-sm
      leading-relaxed
      text-zinc-800
    ">

      {coachMessage}

    </p>

  </div>
)}

    {insights.length > 0 && (

      <div className="
        mb-6
        space-y-3
      ">

        {insights.map(
          (insight, index) => (

            <div
              key={index}
              className="
                rounded-2xl
                border
                border-emerald-900/40
                bg-emerald-950/20
                p-4
              "
            >

              <p className="
                text-sm
                leading-relaxed
                text-zinc-1200
              ">

                {insight}

              </p>

            </div>
          )
        )}

      </div>
      )}



      {/* LIST */}
      {!loading &&
        Object.entries(groupedTrades).map(([date, dayTrades]) => {
          const pnl = dayTrades.reduce(
            (acc, trade) => acc + Number(trade.resultado || 0),
            0
          )
          const positive = pnl >= 0

          return (
            <div
              key={date}
              className="rounded-3xl border border-zinc-800 bg-zinc-600/35 p-5"
            >
              {/* HEADER */}
              <div
                onClick={() => toggleDay(date)}
                className="
                  mb-6 flex cursor-pointer flex-col gap-3
                  border-b border-zinc-800 pb-4 transition-all
                  hover:opacity-80 sm:flex-row sm:items-center sm:justify-between
                "
              >
                <div>
                  <h2 className="flex items-center gap-3 text-xl font-bold text-white">
                    <span className="text-sm text-zinc-500">
                      {openDays[date] ? "▼" : "▶"}
                    </span>
                    {date}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {dayTrades.length} trades
                  </p>
                </div>

                <div
                  className={`text-2xl font-bold ${
                    positive ? "text-emerald-400" : "text-rose-500"
                  }`}
                >
                  {pnlFormatter.format(pnl)}
                </div>
              </div>

              {/* TRADES */}
              {openDays[date] && (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {dayTrades.map((trade) => (
                    <div key={trade.id} className="relative">
                      <button
                        onClick={() => toggleTradeSelection(trade.id)}
                        className={`
                          absolute right-3 top-3 z-20
                          flex h-5 w-5 items-center justify-center
                          rounded-md border
                          ${
                            selectedTrades.includes(trade.id)
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-zinc-700 bg-zinc-900"
                          }
                        `}
                      >
                        {selectedTrades.includes(trade.id) && (
                          <div className="h-2 w-2 rounded-sm bg-white" />
                        )}
                      </button>

                      <TradeCard
                        trade={trade}
                        onEdit={() => {
                          setEditingTrade(trade)
                          setIsDrawerOpen(true)
                        }}
                        onDelete={() => deleteTrade(trade.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

      {/* DRAWER */}
      {isDrawerOpen && editingTrade && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
          <div
            className="
              h-full w-full max-w-xl
              overflow-y-auto border-l border-zinc-800
              bg-zinc-950 p-6 shadow-2xl
            "
          >
            {/* HEADER Search */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Trade Editor</p>
                <p
                  className={`mt-1 text-xs ${
                    isSaving === "error"
                      ? "text-rose-400"
                      : "text-zinc-500"
                  }`}
                >
                  {savingLabel}
                </p>
                <h2 className="text-2xl font-bold text-white">
                  Editar Trade
                </h2>
              </div>

              <div className="
  mt-4
  flex
  items-center
  gap-3
">

  <button
    disabled={!previousTrade}
    onClick={() =>
      setEditingTrade(previousTrade)
    }
    className="
      rounded-xl
      border
      border-zinc-800
      px-3
      py-2
      text-sm
      text-zinc-300
      disabled:opacity-30
    "
  >
    ← Previous
  </button>

  <button
    disabled={!nextTrade}
    onClick={() =>
      setEditingTrade(nextTrade)
    }
    className="
      rounded-xl
      border
      border-zinc-800
      px-3
      py-2
      text-sm
      text-zinc-300
      disabled:opacity-30
    "
  >
    Next →
  </button>

</div>

              <button
                onClick={() => {
                  setIsDrawerOpen(false)
                  setEditingTrade(null)
                }}
                className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                Fechar
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-5">
              {/* SETUP */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Setup
                </label>
                <input
                  value={editingTrade.setup || ""}
                  onChange={(e) =>
                    setEditingTrade({ ...editingTrade, setup: e.target.value })
                  }
                  className="
                    w-full rounded-xl border border-zinc-800
                    bg-zinc-900 px-4 py-3 text-white
                    outline-none focus:border-emerald-500
                  "
                />
              </div>

              {/* SCENARIO */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Cenário
                </label>
                <input
                  value={editingTrade.cenario || ""}
                  onChange={(e) =>
                    setEditingTrade({
                      ...editingTrade,
                      cenario: e.target.value,
                    })
                  }
                  className="
                    w-full rounded-xl border border-zinc-800
                    bg-zinc-900 px-4 py-3 text-white
                    outline-none focus:border-emerald-500
                  "
                />
              </div>

              {/* TAGS ATUAIS DO TRADE (corrigido: era "trade.tags", agora "editingTrade.tags") */}
              {editingTrade.tags && editingTrade.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {editingTrade.tags.map((tag) => (
                    <div
                      key={tag}
                      className="
                        rounded-full border border-zinc-700
                        bg-zinc-900 px-2 py-1 text-[10px]
                        uppercase tracking-wide text-zinc-300
                      "
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}

              {/* RESULT */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Resultado
                </label>
                <input
                  type="number"
                  value={editingTrade.resultado}
                  onChange={(e) =>
                    setEditingTrade({
                      ...editingTrade,
                      resultado: Number(e.target.value),
                    })
                  }
                  className="
                    w-full rounded-xl border border-zinc-800
                    bg-zinc-900 px-4 py-3 text-white
                    outline-none focus:border-emerald-500
                  "
                />
              </div>

              {/* TAGS */}
              <div>
                <label className="mb-3 block text-sm text-zinc-400">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "A+",
                    "FOMO",
                    "Revenge",
                    "Discipline",
                    "Impulse",
                    "Patience",
                    "Overtrade",
                    "Hesitation",
                  ].map((tag) => {
                    const selected = editingTrade.tags?.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const currentTags = editingTrade.tags || []
                          const updated = selected
                            ? currentTags.filter((t) => t !== tag)
                            : [...currentTags, tag]
                          setEditingTrade({ ...editingTrade, tags: updated })
                        }}
                        className={`
                          rounded-full border px-3 py-2
                          text-xs font-medium transition-all
                          ${
                            selected
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                              : "border-zinc-700 bg-zinc-900 text-zinc-400"
                          }
                        `}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* NOTES */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Notas
                </label>
                <textarea
                  rows={6}
                  value={editingTrade.observacoes || ""}
                  onChange={(e) =>
                    setEditingTrade({
                      ...editingTrade,
                      observacoes: e.target.value,
                    })
                  }
                  className="
                    w-full rounded-xl border border-zinc-800
                    bg-zinc-900 px-4 py-3 text-white
                    outline-none focus:border-emerald-500
                  "
                />

                <div
                  className="
                    mt-5 rounded-2xl border border-zinc-800
                    bg-zinc-900/60 p-4
                  "
                >
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Preview
                  </p>
                  <div
                    className="
                      prose prose-invert max-w-none
                      prose-p:text-zinc-300 prose-headings:text-white
                      prose-strong:text-white prose-li:text-zinc-300
                    "
                  >
                    <ReactMarkdown>
                      {editingTrade.observacoes || "Nada escrito ainda."}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              

              {/* SCREENSHOT */}

              <div>

                <label className="
    mb-3
    block
    text-sm
    text-zinc-400
  ">
    Screenshot
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadScreenshot}
                  className="
                    block
                    w-full
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-3
                    text-sm
                    text-zinc-400
                 "
                />

                {editingTrade.screenshot_url && (

                  <img
                  src={editingTrade.screenshot_url}
                  alt="Trade Screenshot"
                  onClick={() =>
                    setFullscreenImage(
                      editingTrade.screenshot_url!
                    )
                  }
                  className="
                    mt-4
                    cursor-zoom-in
                    rounded-2xl
                    border
                   border-zinc-800
                    transition-all
                    hover:opacity-90
                  "
                />

                )}

              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false)
                    setEditingTrade(null)
                  }}
                  className="rounded-xl border border-zinc-700 px-5 py-3 text-zinc-300 hover:bg-zinc-900"
                >
                  Cancelar
                </button>

                <button
                  onClick={saveTrade}
                  className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-black hover:opacity-90"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* FULLSCREEN IMAGE */}

      {fullscreenImage && (

  <div
    onClick={() =>
      setFullscreenImage(null)
    }
    className="
      fixed
      inset-0
      z-[300]
      flex
      items-center
      justify-center
      bg-black/90
      p-10
      backdrop-blur-sm
    "
  >

    <img
      src={fullscreenImage}
      alt="Fullscreen"
      className="
        max-h-full
        max-w-full
        rounded-2xl
        shadow-2xl
      "
    />

  </div>
      )}
    </div>
  )
}
