import { cn } from "@/lib/utils"

const BADGE_STYLES: Record<string, string> = {
  UNCLAIMED: "bg-amber-50 text-amber-700 border-amber-200",
  CLAIMED: "bg-blue-50 text-blue-700 border-blue-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FEATURED: "bg-gold-50 text-amber-700 border-gold-200",
  FOUNDING: "bg-purple-50 text-purple-700 border-purple-200",
}

const BADGE_LABELS: Record<string, string> = {
  UNCLAIMED: "Available Profile",
  CLAIMED: "Claimed Profile",
  VERIFIED: "Verified",
  FEATURED: "Founding Supplier",
  FOUNDING: "Founding Supplier",
}

const TOOLTIPS: Record<string, string> = {
  UNCLAIMED: "This company has been identified by Zanzibaba and may claim and enhance its profile.",
  CLAIMED: "This supplier has claimed and manages their own profile on Zanzibaba.",
  VERIFIED: "This supplier has been verified by Zanzibaba.",
}

export function SupplierBadge({ status }: { status: string }) {
  const style = BADGE_STYLES[status] || BADGE_STYLES.UNCLAIMED
  const label = BADGE_LABELS[status] || status
  const tooltip = TOOLTIPS[status]
  return (
    <span className={cn("relative inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium group/badge cursor-help", style)} title={tooltip}>
      {label}
      {tooltip && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover/badge:opacity-100 transition-opacity z-10 w-48 rounded-lg bg-gray-900 px-3 py-2 text-[10px] text-white shadow-lg pointer-events-none">
          {tooltip}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
        </span>
      )}
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

export function TrustBadges({
  hasWebsite,
  isStrategic,
  isFounding,
  isClaimed,
}: {
  hasWebsite: boolean
  isStrategic: boolean
  isFounding: boolean
  isClaimed: boolean
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {hasWebsite && (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Verified Website
        </span>
      )}
      {isStrategic && (
        <span className="inline-flex items-center gap-1 rounded-md bg-zanzibar-50 px-2 py-0.5 text-[10px] font-medium text-zanzibar-700 border border-zanzibar-200">
          <span className="h-1.5 w-1.5 rounded-full bg-zanzibar-500" />
          Strategic Supplier
        </span>
      )}
      {isFounding && (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 border border-purple-200">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          Founding Partner
        </span>
      )}
      {isClaimed && (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Claimed Profile
        </span>
      )}
    </div>
  )
}
