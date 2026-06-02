import { NextResponse } from "next/server"
import { addReview, getReviews, getAverageRating } from "@/lib/reviews/review-store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { revieweeId, revieweeType, reviewerName, rating, title, description, isVerified } = body

    if (!revieweeId || !revieweeType) {
      return NextResponse.json({ error: "revieweeId and revieweeType are required" }, { status: 400 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const validTypes = ["supplier", "contractor", "professional"]
    if (!validTypes.includes(revieweeType)) {
      return NextResponse.json({ error: "Invalid revieweeType" }, { status: 400 })
    }

    const review = addReview({
      revieweeId,
      revieweeType,
      reviewerName: reviewerName || "Anonymous",
      rating,
      title: title || "",
      description: description || "",
      isVerified: isVerified || false,
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const revieweeId = searchParams.get("revieweeId")
  const revieweeType = searchParams.get("revieweeType")

  if (!revieweeId || !revieweeType) {
    return NextResponse.json({ error: "revieweeId and revieweeType are required" }, { status: 400 })
  }

  const reviews = getReviews(revieweeId, revieweeType)
  const stats = getAverageRating(revieweeId, revieweeType)

  return NextResponse.json({ reviews, stats })
}
