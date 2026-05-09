"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TradeForm() {
  const [form, setForm] = useState({
  ativo: "",
  entrada: "",
  saida: "",
  resultado: "",
  setup: "",
  lote: "",
  entrada_time: "",
  saida_time: "",
  cenario: ""
})
    
  

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage("Você precisa estar logado")
        window.location.href = "/login"
        return
      }

      const resultadoCalculado =
        (Number(form.saida) - Number(form.entrada)) * Number(form.lote)

      const resultadoFinal =
        form.resultado !== ""
          ? Number(form.resultado)
          : resultadoCalculado

      const { error } = await supabase.from("trades").insert([
        {
          ativo: form.ativo,
          entrada: Number(form.entrada),
          saida: Number(form.saida),
          resultado: resultadoFinal,
          setup: form.setup,
          cenario: form.cenario,
          lote: Number(form.lote),
          entrada_time: form.entrada_time,
          saida_time: form.saida_time,
          data_hora: new Date().toISOString(),
          user_id: user.id
        }
      ])

      if (error) throw error

      setMessage("Trade salvo com sucesso!")
      window.location.href = "/dashboard"

      setForm({
        ativo: "",
        entrada: "",
        saida: "",
        resultado: "",
        setup: "",
        lote: "",
        entrada_time: "",
        saida_time: "",
        cenario: ""
      })

    } catch (err: any) {
      console.error(err)
      setMessage("Erro ao salvar trade")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

      <input name="ativo" placeholder="Ativo" value={form.ativo} onChange={handleChange} className="w-full border p-2 rounded" required />

      <input name="entrada" type="number" placeholder="Entrada" value={form.entrada} onChange={handleChange} className="w-full border p-2 rounded" required />

      <input name="saida" type="number" placeholder="Saída" value={form.saida} onChange={handleChange} className="w-full border p-2 rounded" required />

      <input name="lote" type="number" placeholder="Lote" value={form.lote} onChange={handleChange} className="w-full border p-2 rounded" required />

      {/* ⏱️ NOVOS CAMPOS */}
      <input name="entrada_time" type="datetime-local" value={form.entrada_time} onChange={handleChange} className="w-full border p-2 rounded" required />

      <input name="saida_time" type="datetime-local" value={form.saida_time} onChange={handleChange} className="w-full border p-2 rounded" required />

      <input name="resultado" type="number" placeholder="Resultado (opcional)" value={form.resultado} onChange={handleChange} className="w-full border p-2 rounded" />

      <input name="setup" placeholder="Setup" value={form.setup} onChange={handleChange} className="w-full border p-2 rounded" required />

      <div>
  <label className="block mb-1 font-medium">
    Cenário
  </label>

  <input
    type="text"
    name="cenario"
    placeholder="Ex: Tendência, Canal, Lateralização..."
    value={form.cenario}
    onChange={handleChange}
    className="w-full border p-2 rounded"
  />
</div>

      <button type="submit" disabled={loading} className="w-full bg-black text-white p-2 rounded">
        {loading ? "Salvando..." : "Salvar Trade"}
      </button>

      {message && <p className="text-center">{message}</p>}

    </form>
  )
}