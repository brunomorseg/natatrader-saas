import OpenAI from "openai"

const openai =
  new OpenAI({
    apiKey:
      process.env.OPENAI_API_KEY
  })

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json()

    const trades =
      body.trades || []

    const prompt = `
      You are a professional
      trading psychology coach.

      Analyze the following
      trader data and provide:

      - behavioral patterns
      - emotional tendencies
      - execution quality
      - risk management issues
      - psychological observations
      - strengths and weaknesses

      Keep the response concise,
      intelligent and practical.

      Trades:
      ${JSON.stringify(trades)}
    `

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "You are an elite trading performance coach."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })

    return Response.json({
      insight:
        response.choices[0]
          .message.content
    })

  } catch (error) {

    

    console.error(error)

    return Response.json(
      {
        error:
          "AI analysis failed."
      },
      {
        status: 500
      }
    )
  }
}