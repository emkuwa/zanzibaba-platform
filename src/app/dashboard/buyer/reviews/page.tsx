"use client"

import { useState } from "react"
import { Star, Edit3, Trash2, Plus, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  supplier: string
  product: string
  rating: number
  text: string
  date: string
  helpful: number
}

const initialReviews: Review[] = [
  { id: "R-001", supplier: "Azam Building Supplies", product: "Portland Cement Grade 42.5N", rating: 5, text: "Excellent quality cement. The delivery was prompt and the price was competitive. Highly recommended for any construction project.", date: "Dec 5, 2024", helpful: 12 },
  { id: "R-002", supplier: "Zanzibar Cement Ltd", product: "Bulk Cement Supply", rating: 4, text: "Good quality and consistent supply. Delivery was on time. Would appreciate better communication on delivery schedules.", date: "Nov 28, 2024", helpful: 8 },
  { id: "R-003", supplier: "East Africa Materials Co", product: "Steel Reinforcement Bars Grade 60", rating: 5, text: "Top quality steel bars. Met all our specifications. The pricing was fair and the team was very professional.", date: "Nov 15, 2024", helpful: 15 },
  { id: "R-004", supplier: "Mombasa Building Centre", product: "Roofing Materials", rating: 3, text: "Average quality roofing materials. Some items arrived with minor damage. Customer service was responsive though.", date: "Nov 2, 2024", helpful: 5 },
  { id: "R-005", supplier: "Coastal Electricals Ltd", product: "Electrical Cables 10mm", rating: 4, text: "Good quality cables at reasonable prices. Stock availability was good. Will order again.", date: "Oct 20, 2024", helpful: 7 },
]

function StarRating({ rating, onChange, readonly }: { rating: number; onChange?: (r: number) => void; readonly?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn("transition-colors", readonly ? "cursor-default" : "cursor-pointer hover:scale-110")}
        >
          <Star
            className={cn(
              "h-4 w-4",
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"new" | "edit">("new")
  const [formRating, setFormRating] = useState(5)
  const [formText, setFormText] = useState("")

  function openNewReview() {
    setDialogMode("new")
    setFormRating(5)
    setFormText("")
    setEditingReview(null)
    setShowDialog(true)
  }

  function openEditReview(review: Review) {
    setDialogMode("edit")
    setFormRating(review.rating)
    setFormText(review.text)
    setEditingReview(review)
    setShowDialog(true)
  }

  function handleSave() {
    if (!formText.trim()) return
    if (dialogMode === "new") {
      const newReview: Review = {
        id: `R-${String(reviews.length + 1).padStart(3, "0")}`,
        supplier: "Current Supplier",
        product: "Product",
        rating: formRating,
        text: formText,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        helpful: 0,
      }
      setReviews((prev) => [newReview, ...prev])
    } else if (editingReview) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id ? { ...r, rating: formRating, text: formText } : r
        )
      )
    }
    setShowDialog(false)
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Reviews</h2>
          <p className="text-sm text-gray-500">Reviews you have written ({reviews.length})</p>
        </div>
        <Button onClick={openNewReview}>
          <Plus className="mr-1.5 h-4 w-4" /> Write Review
        </Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zanzibar-100 text-sm font-semibold text-zanzibar-700">
                      {review.supplier.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.supplier}</p>
                      <p className="text-xs text-gray-400">{review.product}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <StarRating rating={review.rating} readonly />
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.text}</p>

                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-zanzibar-600">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{review.helpful} helpful</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditReview(review)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Star className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">Write a review for a supplier or product you have ordered</p>
              <Button className="mt-4" onClick={openNewReview}>
                <Plus className="mr-1.5 h-4 w-4" /> Write Your First Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} title={dialogMode === "new" ? "Write a Review" : "Edit Review"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="mt-1">
              <StarRating rating={formRating} onChange={setFormRating} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              className="mt-1 flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500"
              placeholder="Share your experience with this supplier..."
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formText.trim()}>
              {dialogMode === "new" ? "Submit Review" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
