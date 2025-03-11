import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // Parse the incoming request JSON payload
    const data = await req.json()

    // Forward the request to the Flask app running on localhost:5000
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

    // Return the prediction response from the Flask backend
    const predictionData = await flaskResponse.json()
    return NextResponse.json(predictionData)
  } catch (error) {
    console.error("Error in predict route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

