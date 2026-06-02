import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { VerificationBadge } from "@/components/ui/verification-badge"
import { FeaturedBadge } from "@/components/ui/featured-badge"

interface TrustIndicatorsProps {
  verified: boolean
  verifiedType?: "supplier" | "contractor" | "professional"
  featured?: boolean
  featuredTier?: "featured" | "top-rated" | "rising"
  rating: number
  reviewCount: number
  size?: "sm" | "md"
  className?: string
}

export function TrustIndicators({
  verified,
  verifiedType = "supplier",
  featured = false,
  featuredTier = "featured",
  rating,
  reviewCount,
  size = "sm",
  className,
}: TrustIndicatorsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
              i < Math.floor(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200",
            )}
          />
        ))}
        <span className={cn("ml-1 font-medium text-gray-600", size === "sm" ? "text-xs" : "text-sm")}>
          {rating}
        </span>
        <span className={cn("ml-0.5 text-gray-400", size === "sm" ? "text-[10px]" : "text-xs")}>
          ({reviewCount})
        </span>
      </div>
      <VerificationBadge type={verifiedType} size={size === "sm" ? "sm" : "md"} verified={verified} />
      {featured && <FeaturedBadge tier={featuredTier} size={size} />}
    </div>
  )
}
