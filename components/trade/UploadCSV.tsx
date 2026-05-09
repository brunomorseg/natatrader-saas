"use client"

import { useState } from "react"
import Papa from "papaparse"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 🔥 converte número BR
function parseNumber(value: any) {
  if (!value) return 0

  return Number(
    value
      .toString()
      .replace(/\./g, "") // remove milhares
      .replace(",", ".") // troca decimal
      .trim()
  )
}

// 🔥 converte data (formato do Profit)
function parseDate(value: string) {
  if (!value) return null

  const [date, time] = value.split(" ")
  if (!date || !time) return null

  const [day, month, year] = date.split("/")

  return `${year}-${month}-${day}T${time}:00`
}

function normalize(text: string) {
  return text
    .toLowerCase()

    // corrige encoding quebrado
    .replace(/�/g, "e")

    // remove acentos
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

    // remove espaços extras
    .trim()
}

function getValue(row: any, field: string) {
  const keys = Object.keys(row)

  const match = keys.find((k: string) => {
    const normalized = normalize(k)

    switch (field) {

      case "ativo":
        return normalized.includes("ativo")

      case "abertura":
        return normalized.includes("abertura")

      case "fechamento":
        return normalized.includes("fechamento")

      case "precoCompra":
        return (
          normalized.includes("pre") &&
          normalized.includes("comp")
        )

      case "precoVenda":
        return (
          normalized.includes("pre") &&
          normalized.includes("vend")
        )

      case "qtdCompra":
        return (
          normalized.includes("qtd") &&
          normalized.includes("comp")
        )

      case "qtdVenda":
        return (
          normalized.includes("qtd") &&
          normalized.includes("vend")
        )

      case "resultado":
        return (
          normalized.includes("res") &&
          normalized.includes("intervalo")
        )

      default:
        return false
    }
  })

  return match ? row[match] : ""
}

export default function UploadCSV() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleFile(e: any) {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    setMessage("")

   const text = await file.text()

// 🔥 quebra o arquivo em linhas
const lines = text.split("\n")

// 🔍 encontra onde começa a tabela (linha com "Ativo")
const startIndex = lines.findIndex((line: string) =>
  line.toLowerCase().includes("ativo")
)

if (startIndex === -1) {
  setMessage("❌ Não encontrou cabeçalho de trades")
  setLoading(false)
  return
}

// 🔥 pega só a parte útil do CSV
const cleanCSV = lines.slice(startIndex).join("\n")

// 🔥 agora sim parse correto
Papa.parse(cleanCSV, {
  header: true,
  skipEmptyLines: true,
  delimiter: ";", // 🔥 IMPORTANTE (Profit usa ;)

  complete: async (results: any) => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage("Usuário não logado")
        return
      }

      console.log("HEADERS:", Object.keys(results.data[0]))
      console.log("PRIMEIRA LINHA:", results.data[0])

      const validRows = results.data.filter((row: any) => {
        return getValue(row, "ativo") !== ""
      })

      if (validRows.length === 0) {
        setMessage("❌ Nenhum trade válido encontrado")
        return
      }

      console.log("COLUNAS:", Object.keys(validRows[0]))
console.log("LINHA COMPLETA:", validRows[0])

     const trades = validRows.map((row: any) => ({
      
  ativo: getValue(row, "ativo"),

  entrada: parseNumber(
    getValue(row, "precoCompra")
  ),

  saida: parseNumber(
    getValue(row, "precoVenda")
  ),

  resultado: parseNumber(
    getValue(row, "resultado")
  ),

  lote:
    Number(getValue(row, "qtdCompra")) ||
    Number(getValue(row, "qtdVenda")) ||
    1,

  setup: "Importado",

  entrada_time: parseDate(
    getValue(row, "abertura")
  ),

  saida_time: parseDate(
    getValue(row, "fechamento")
  ),

  data_hora: parseDate(
    getValue(row, "abertura")
  ),

  user_id: user.id
}))

      console.log("TRADES FORMATADOS:", trades)

      

      const { error } = await supabase
        .from("trades")
        .insert(trades)

      if (error) {
        console.error(error)
        setMessage("❌ Erro no banco (veja console)")
        return
      }

      setMessage(`✅ ${trades.length} trades importados!`)

    } catch (err) {
      console.error(err)
      setMessage("❌ Erro ao processar trades")
    }

    setLoading(false)
  }
})
  }

  return (
    <div className="border p-4 rounded mb-6">
      <h2 className="font-bold mb-2">
        Importar CSV do Profit
      </h2>

      <input type="file" accept=".csv" onChange={handleFile} />

      {loading && <p>Importando...</p>}
      {message && <p>{message}</p>}
    </div>
  )
}