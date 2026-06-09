import { cn } from "@/lib/utils"

const BADGE_STYLES: Record<string, string> = {
  UNCLAIMED: "bg-amber-50 text-amber-700 border-amber-200",
  CLAIMED: "bg-blue-50 text-blue-700 border-blue-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FEATURED: "bg-gold-50 text-amber-700 border-gold-200",
  FOUNDING: "bg-purple-50 text-purple-700 border-purple-200",
}

const BADGE_LABELS: Record<string, string> = {
  UNCLAIMED: "Unclaimed",
  CLAIMED: "Claimed",
  VERIFIED: "Verified",
  FEATURED: "Founding Supplier",
  FOUNDING: "Founding Supplier",
}

export function SupplierBadge({ status }: { status: string }) {
  const style = BADGE_STYLES[status] || BADGE_STYLES.UNCLAIMED
  const label = BADGE_LABELS[status] || status
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", style)}>
      {label}
    </span>
  )
}

export function ActivationBadges({ activationStatus, isFounding }: { activationStatus: string; isFounding?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1">
      {activationStatus === "UNCLAIMED" && <SupplierBadge status="UNCLAIMED" />}
      {activationStatus === "CLAIMED" && <SupplierBadge status="CLAIMED" />}
      {activationStatus === "VERIFIED" && <SupplierBadge status="VERIFIED" />}
      {(activationStatus === "FEATURED" || isFounding) && <SupplierBadge status="FOUNDING" />}
    </div>
  )
}
