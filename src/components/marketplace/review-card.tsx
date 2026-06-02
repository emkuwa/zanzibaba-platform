import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { getInitials, formatDate } from "@/lib/utils"
import type { Review } from "@/lib/reviews/review-store"

interface ReviewCardProps {
  review: Review
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-gold-400 text-gold-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  )
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="md" fallback={getInitials(review.reviewerName)} />
            <div>
              <p className="font-semibold text-gray-900">{review.reviewerName}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
          {review.isVerified && (
            <Badge variant="success" className="text-[10px] px-2 py-0">
              Verified Purchase
            </Badge>
          )}
        </div>

        {review.title && (
          <h4 className="mt-3 font-medium text-gray-900">{review.title}</h4>
        )}

        {review.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{review.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
