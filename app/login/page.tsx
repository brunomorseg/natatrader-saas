"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = "/dashboard"
    }
  }

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Conta criada! Agora faça login.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="w-full max-w-md space-y-4 border p-6 rounded">

        <h1 className="text-xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded"
        >
          Entrar
        </button>

        <button
          onClick={handleRegister}
          className="w-full border p-2 rounded"
        >
          Criar conta
        </button>

      </div>
    </div>
  )
}