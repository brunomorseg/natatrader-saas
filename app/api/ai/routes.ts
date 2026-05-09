import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const body = await req.json()

  const { trades } = body

  const prompt = `
Você é um coach de trading profissional.

Analise os trades abaixo e dê insights claros, diretos e acionáveis:

${JSON.stringify(trades, null, 2)}
`

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "Você é especialista em trading." },
      { role: "user", content: prompt }
    ]
  })

  return Response.json({
    text: response.choices[0].message.content
  })
}