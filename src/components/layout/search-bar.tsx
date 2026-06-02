"use client"

import { useState, type FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "building-materials", label: "Building Materials" },
  { value: "tools", label: "Tools & Equipment" },
  { value: "finishes", label: "Finishes & Interiors" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "prefab", label: "Prefab Structures" },
]

interface SearchBarProps {
  className?: string
  variant?: "default" | "compact"
  onSearch?: (query: string, category: string) => void
}

export function SearchBar({ className, variant = "default", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSearch?.(query, category)
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={cn("relative", className)}>
        <input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
        />
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex w-full max-w-2xl", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search suppliers, products, categories... Steel, Cement, FF&E, Tiles, Kitchens"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-l-lg border border-r-0 border-gray-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500"
        />
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="hidden h-12 border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-zanzibar-500 sm:block"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="flex h-12 items-center gap-2 rounded-r-lg bg-zanzibar-600 px-6 text-sm font-medium text-white transition-colors hover:bg-zanzibar-700"
      >
        <Search className="h-5 w-5" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  )
}
