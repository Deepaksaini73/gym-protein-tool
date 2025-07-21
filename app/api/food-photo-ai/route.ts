import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const imageFile = formData.get("image") as File

  if (!imageFile) {
    return new Response(JSON.stringify({ error: "No image uploaded" }), { status: 400 })
  }

  // Read image as buffer
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Azure Vision API details
  const endpoint = process.env.AZURE_VISION_ENDPOINT // e.g. https://<your-resource>.cognitiveservices.azure.com/
  const apiKey = process.env.AZURE_VISION_API_KEY

  // Call Azure Vision API
  const visionRes = await fetch(
    `${endpoint}/vision/v3.2/analyze?visualFeatures=Tags,Description`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey!,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    }
  )

  if (!visionRes.ok) {
    return new Response(JSON.stringify({ error: "Azure Vision API error" }), { status: 500 })
  }

  const visionData = await visionRes.json()
  // Try to get the best guess food name
  const tags = visionData.tags || []
  const description = visionData.description?.captions?.[0]?.text || ""
  // Pick the first tag that looks like food
  const foodTag = tags.find((tag: any) => tag.name && tag.hint === "food")?.name
  const foodName = foodTag || description || "Unknown food"

  // (Optional) Lookup nutrition info from your mock database
  // You can replace this with Gemini or other AI if needed
  const mockFoodDatabase = [
    { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, per: "100g" },
    { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fats: 11, per: "100g" },
    { name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, per: "100g" },
    // ...add more as needed
  ]
  const nutrition = mockFoodDatabase.find(
    (food) => foodName.toLowerCase().includes(food.name.toLowerCase())
  )

  return new Response(
    JSON.stringify({
      nutrition: nutrition
        ? { ...nutrition, food_name: nutrition.name }
        : { food_name: foodName },
    }),
    { status: 200 }
  )
}