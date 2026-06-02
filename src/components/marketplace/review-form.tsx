"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  revieweeId: string
  revieweeType: "supplier" | "contractor" | "professional"
  onSuccess?: () => void
}

export function ReviewForm({ revieweeId, revieweeType, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const [reviewerName, setReviewerName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (rating === 0) {
      setError("Please select a star rating")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revieweeId,
          revieweeType,
          reviewerName: reviewerName || "Anonymous",
          rating,
          title,
          description,
          isVerified: false,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit review")
      }

      setRating(0)
      setReviewerName("")
      setTitle("")
      setDescription("")
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating *</label>
            <div className="mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      star <= (hoveredStar || rating)
                        ? "fill-gold-400 text-gold-400"
                        : "text-gray-200 hover:text-gold-200",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            id="reviewer-name"
            label="Your Name"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Your name (optional)"
          />

          <Input
            id="review-title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summary of your experience"
          />

          <div className="space-y-1">
            <label htmlFor="review-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="review-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell others about your experience..."
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
