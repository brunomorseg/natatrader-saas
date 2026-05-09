"use client"

import TradeForm from "@/components/trade/tradeform"
import { createClient } from "@supabase/supabase-js"
import { useEffect } from "react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewTradePage() {

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/login"
      }
    }

    checkUser()
  }, [])

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Novo Trade
      </h1>

      <TradeForm />

    </div>
  )
}