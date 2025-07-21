import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function POST(req: NextRequest) {
  try {
    const { foodName, quantity, unit } = await req.json()
    if (!foodName || !quantity || !unit) {
      return NextResponse.json({ error: 'Missing foodName, quantity, or unit.' }, { status: 400 })
    }
const prompt = `
Give me the nutrition facts (calories, protein, carbs, fats) for ${quantity} ${unit} of "${foodName}". 
If the food name is unclear or not recognized, use the closest common or similar food (especially Indian/global foods). 
NEVER return null, undefined, or NaN — always provide realistic numeric values.
Respond ONLY in this exact JSON format:
{ "calories": number, "protein": number, "carbs": number, "fats": number }
`;
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
    let nutrition = null
    try {
      nutrition = JSON.parse(text)
    } catch {
      // Try to extract JSON from text if Gemini adds extra text
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          nutrition = JSON.parse(match[0])
        } catch {}
      }
    }
    if (!nutrition) {
      return NextResponse.json({ error: 'Could not parse nutrition info.' }, { status: 500 })
    }
    return NextResponse.json({ nutrition })
  } catch (err) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
} 