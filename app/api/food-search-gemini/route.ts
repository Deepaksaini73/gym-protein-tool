import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query) {
      return NextResponse.json({ error: 'Missing query.' }, { status: 400 })
    }
    const prompt = `Suggest 5 foods similar to "${query}" with their nutrition facts (calories, protein, carbs, fats). Respond ONLY in JSON: [{ "name": string, "calories": number, "protein": number, "carbs": number, "fats": number }]`;
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })
    if (!geminiRes.ok) {
      return NextResponse.json({ error: 'AI service error.' }, { status: 500 })
    }
    const geminiData = await geminiRes.json()
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    // Try to parse JSON from Gemini response
    let suggestions = null
    try {
      suggestions = JSON.parse(text)
    } catch {
      // Try to extract JSON from text if Gemini adds extra text
      const match = text.match(/\[.*\]/s)
      if (match) {
        try {
          suggestions = JSON.parse(match[0])
        } catch {}
      }
    }
    if (!suggestions) {
      return NextResponse.json({ error: 'Could not parse suggestions.' }, { status: 500 })
    }
    return NextResponse.json({ suggestions })
  } catch (err) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
} 