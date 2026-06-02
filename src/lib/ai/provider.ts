import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export function getModel() {
  return OPENAI_API_KEY ? openai("gpt-4o-mini") : null
}

export function isAIEnabled(): boolean {
  return !!OPENAI_API_KEY
}

export async function generateWithAI(system: string, prompt: string): Promise<string | null> {
  if (!OPENAI_API_KEY) return null
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 2000,
    })
    return text
  } catch (error) {
    console.error("AI generation error:", error)
    return null
  }
}

export async function generateJSON<T>(system: string, prompt: string): Promise<T | null> {
  if (!OPENAI_API_KEY) return null
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `${system}\nRespond ONLY with valid JSON. No markdown, no code fences.`,
      prompt,
      temperature: 0.5,
      maxOutputTokens: 3000,
    })
    return JSON.parse(text) as T
  } catch (error) {
    console.error("AI JSON generation error:", error)
    return null
  }
}
