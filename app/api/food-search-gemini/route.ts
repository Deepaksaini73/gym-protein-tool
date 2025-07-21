import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query) {
      return NextResponse.json({ error: 'Missing query.' }, { status: 400 })
    }
const prompt = `You are a nutrition expert. Given a food item "${query}", suggest 5 similar or commonly eaten foods (preferably Indian if "${query}" is Indian) along with detailed nutrition facts per standard serving. Respond ONLY in **valid JSON array format** (no text outside JSON).

Each item must include:
- "name": name of the food,
- "calories": total calories (kcal),
- "protein": grams of protein,
- "carbs": grams of carbohydrates,
- "fats": grams of fat.

If "${query}" is unclear or missing, suggest 5 popular healthy foods instead.

Return format:
[
  {
    "name": "Food Name",
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  ...
]`;
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