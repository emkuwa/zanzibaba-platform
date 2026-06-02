"use client"

import { Phone } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { getWhatsAppLink } from "@/lib/whatsapp/whatsapp"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps extends Omit<ButtonProps, "children"> {
  phoneNumber: string
  message?: string
  label?: string
}

export function WhatsAppButton({
  phoneNumber,
  message,
  label = "Chat on WhatsApp",
  className,
  variant = "default",
  size = "md",
  ...props
}: WhatsAppButtonProps) {
  const waLink = getWhatsAppLink(phoneNumber, message)

  return (
    <div className="relative group inline-flex">
      <Button
        variant={variant}
        size={size}
        className={cn(
          "gap-2 bg-[#25D366] text-white hover:bg-[#1DA851] border-[#25D366]",
          variant === "outline" && "bg-white text-[#25D366] hover:bg-[#f0fdf4]",
          variant === "ghost" && "bg-transparent text-[#25D366] hover:bg-[#f0fdf4]",
          className
        )}
        onClick={() => window.open(waLink, "_blank", "noopener,noreferrer")}
        {...props}
      >
        <Phone className="h-4 w-4" />
        {label}
      </Button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
        <div className="whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-sm">
          {phoneNumber}
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  )
}
