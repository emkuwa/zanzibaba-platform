import { cn } from "@/lib/utils"
import { ShieldCheck, ShieldX } from "lucide-react"

interface VerificationBadgeProps {
  type: "supplier" | "contractor" | "professional"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  verified: boolean
}

const typeLabels = {
  supplier: "Verified Supplier",
  contractor: "Verified Contractor",
  professional: "Verified Professional",
}

const sizeClasses = {
  sm: { icon: "h-3.5 w-3.5", text: "text-xs", gap: "gap-1" },
  md: { icon: "h-4 w-4", text: "text-sm", gap: "gap-1.5" },
  lg: { icon: "h-5 w-5", text: "text-sm", gap: "gap-2" },
}

export function VerificationBadge({ type, size = "md", showLabel = true, verified }: VerificationBadgeProps) {
  const s = sizeClasses[size]

  if (!verified) {
    return (
      <span className={cn("inline-flex items-center text-gray-400", s.gap)} title="Unverified">
        <ShieldX className={cn(s.icon, "shrink-0")} />
        {showLabel && size !== "sm" && (
          <span className={cn(s.text, "font-medium")}>Unverified</span>
        )}
      </span>
    )
  }

  return (
    <span
      className={cn("inline-flex items-center text-zanzibar-600", s.gap)}
      title={typeLabels[type]}
    >
      <ShieldCheck className={cn(s.icon, "shrink-0 fill-zanzibar-100")} />
      {showLabel && (
        <span className={cn(s.text, "font-medium")}>
          {size === "sm" ? "Verified" : typeLabels[type]}
        </span>
      )}
    </span>
  )
}
