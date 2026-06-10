"use client"

import { useState } from "react"
import { ImageIcon, Loader2, Palette } from "lucide-react"
import { CATEGORY_COLORS, getCategoryPromptTemplate } from "@/lib/ai/cover-image"

const CATEGORIES = [
  { slug: "steel-manufacturers", label: "Steel Manufacturers" },
  { slug: "prefab-houses", label: "Prefab Houses" },
  { slug: "hotel-furniture", label: "Hotel Furniture" },
  { slug: "building-materials", label: "Building Materials" },
  { slug: "hvac", label: "HVAC" },
  { slug: "solar-systems", label: "Solar Systems" },
]

interface CoverImagePromptsProps {
  companyName?: string
  currentCategory?: string
}

export function CoverImagePrompts({ companyName, currentCategory }: CoverImagePromptsProps) {
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || CATEGORIES[0].slug)
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState<string | null>(null)
  const [colors, setColors] = useState<string[]>(CATEGORY_COLORS[selectedCategory] || CATEGORY_COLORS["general"])

  async function generatePrompt() {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/cover-image-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorySlug: selectedCategory, companyName: companyName || "Supplier" }),
      })
      const data = await res.json()
      setPrompt(data.prompt?.prompt || data.template || getCategoryPromptTemplate(selectedCategory))
      setColors(data.colors || CATEGORY_COLORS[selectedCategory] || CATEGORY_COLORS["general"])
    } catch {
      setPrompt(getCategoryPromptTemplate(selectedCategory))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => { setSelectedCategory(cat.slug); setPrompt(null) }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              selectedCategory === cat.slug
                ? "bg-zanzibar-600 text-white border-zanzibar-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-zanzibar-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {colors.map((c) => (
          <div key={c} className="h-6 w-6 rounded-full border border-gray-300" style={{ backgroundColor: c }} title={c} />
        ))}
        <span className="text-xs text-gray-400 ml-1">Suggested palette</span>
      </div>

      <button
        onClick={generatePrompt}
        disabled={loading}
        className="flex items-center gap-2 text-sm font-medium text-zanzibar-700 bg-zanzibar-50 hover:bg-zanzibar-100 border border-zanzibar-200 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        Generate Cover Image Prompt
      </button>

      {prompt && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-zanzibar-600" />
            <span className="text-sm font-medium text-gray-700">AI-Generated Prompt</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{prompt}</p>
          <p className="text-[11px] text-gray-400 mt-2">
            Use this prompt with AI image generators (DALL·E, Midjourney, Stable Diffusion) to create your cover image.
          </p>
        </div>
      )}
    </div>
  )
}
