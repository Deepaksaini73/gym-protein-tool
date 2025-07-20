import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Helper: Check if question is fitness/nutrition related
function isFitnessNutritionQuestion(question: string) {
    const keywords = [
        'protein', 'calorie', 'nutrition', 'diet', 'workout', 'exercise', 'meal', 'food', 'macros', 'fat', 'carbs', 'weight', 'muscle', 'hydration', 'supplement', 'fitness', 'gym', 'training', 'goal', 'plan', 'lose', 'gain', 'build', 'health', 'healthy', 'body', 'BMI', 'water', 'intake', 'burn', 'maintenance', 'endurance', 'bulk', 'cut', 'cardio', 'strength', 'recovery', 'metabolism', 'coach', 'tracker', 'log', 'track', 'progress', 'activity', 'active', 'sedentary', 'maintenance', 'deficit', 'surplus', 'lean', 'mass', 'nutritionist', 'personal trainer'
    ]
    const lower = question.toLowerCase()
    return keywords.some(k => lower.includes(k))
}

export async function POST(req: NextRequest) {
    try {
        const { question, userProfile } = await req.json()
        if (!question || !userProfile) {
            return NextResponse.json({ answer: 'Missing question or user profile.' }, { status: 400 })
        }

        // Restrict to fitness/nutrition topics
        if (!isFitnessNutritionQuestion(question)) {
            return NextResponse.json({ answer: 'Please ask a fitness or nutrition-related question.' })
        }

        // Compose prompt for Gemini
        const prompt = `
                        You are a professional AI fitness and nutrition coach trained to deliver precise, personalized, and actionable advice.

                        ## Instructions:
                        - Use the user's profile data **proactively** in your answer (e.g., reference their weight, height, age, fitness goal, and activity level).
                        - Be concise, friendly, and sound like a real coach.
                        - Format your answer using **Markdown**: use headings, bullet points, and bold for important values (but without asterisks).
                        - Do NOT repeat the user's question.
                        - Do NOT include greetings, disclaimers, or generic statements.
                        - ONLY respond to health, fitness, or nutrition-related questions.
                        - DO NOT mention that you're an AI.

                        ## User Profile:
                        ${JSON.stringify(userProfile, null, 2)}

                        ## Question:
                        ${question}
                        `


        const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        })
        if (!geminiRes.ok) {
            return NextResponse.json({ answer: 'AI service error.' }, { status: 500 })
        }
        const geminiData = await geminiRes.json()
        const answer = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
        return NextResponse.json({ answer })
    } catch (err) {
        return NextResponse.json({ answer: 'Server error.' }, { status: 500 })
    }
} 