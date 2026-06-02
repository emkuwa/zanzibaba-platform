import { cn } from "@/lib/utils"
import { Award, TrendingUp, Star } from "lucide-react"

interface FeaturedBadgeProps {
  tier?: "featured" | "top-rated" | "rising"
  size?: "sm" | "md"
}

const tierConfig = {
  featured: {
    icon: Award,
    label: "Featured",
    className: "bg-gold-100 text-gold-800 border-gold-200",
  },
  "top-rated": {
    icon: Star,
    label: "Top Rated",
    className: "bg-zanzibar-100 text-zanzibar-800 border-zanzibar-200",
  },
  rising: {
    icon: TrendingUp,
    label: "Rising",
    className: "bg-green-100 text-green-800 border-green-200",
  },
}

const sizeClasses = {
  sm: { icon: "h-3 w-3", text: "text-[10px]", px: "px-1.5" },
  md: { icon: "h-3.5 w-3.5", text: "text-xs", px: "px-2" },
}

export function FeaturedBadge({ tier = "featured", size = "sm" }: FeaturedBadgeProps) {
  const config = tierConfig[tier]
  const Icon = config.icon
  const s = sizeClasses[size]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border py-0.5 font-semibold",
        config.className,
        s.px,
        s.text,
      )}
    >
      <Icon className={cn(s.icon, "shrink-0")} />
      {size === "md" && config.label}
    </span>
  )
}
