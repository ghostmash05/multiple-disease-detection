import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const flaskResponse = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!flaskResponse.ok) {
      const errorResponse = await flaskResponse.json()
      return NextResponse.json({ error: errorResponse.error || "Flask error" }, { status: flaskResponse.status })
    }

    const predictionData = await flaskResponse.json()
    return NextResponse.json(predictionData)
  } catch (error) {
    console.error("Error in predict route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

