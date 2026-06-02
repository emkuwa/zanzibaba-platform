import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical"
}

export function Separator({ orientation = "horizontal", className, ...props }: SeparatorProps) {
  return (
    <hr
      className={cn(
        "shrink-0 bg-gray-200 border-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
}
