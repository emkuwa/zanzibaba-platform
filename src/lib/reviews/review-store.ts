export interface Review {
  id: string
  revieweeId: string
  revieweeType: "supplier" | "contractor" | "professional"
  reviewerName: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  description: string
  createdAt: Date
  isVerified: boolean
}

const reviews: Review[] = []

function generateId(): string {
  return `REV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function addReview(data: Omit<Review, "id" | "createdAt">): Review {
  const review: Review = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
  }
  reviews.unshift(review)
  return review
}

export function getReviews(revieweeId: string, revieweeType: string): Review[] {
  return reviews.filter((r) => r.revieweeId === revieweeId && r.revieweeType === revieweeType)
}

export function getAverageRating(revieweeId: string, revieweeType: string): { avg: number; count: number } {
  const filtered = reviews.filter((r) => r.revieweeId === revieweeId && r.revieweeType === revieweeType)
  if (filtered.length === 0) return { avg: 0, count: 0 }
  const total = filtered.reduce((sum, r) => sum + r.rating, 0)
  return { avg: Math.round((total / filtered.length) * 10) / 10, count: filtered.length }
}

export function getRecentReviews(limit = 5): Review[] {
  return reviews.slice(0, limit)
}
