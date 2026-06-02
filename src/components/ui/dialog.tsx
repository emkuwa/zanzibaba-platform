"use client"

import { useEffect, useRef, type DialogHTMLAttributes, type ReactNode, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Dialog({ open, onClose, title, children, className, ...props }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) {
      el.showModal()
    } else {
      el.close()
    }
  }, [open])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener("close", handleClose)
    return () => el.removeEventListener("close", handleClose)
  }, [handleClose])

  return (
    <dialog
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 m-auto max-h-[85vh] w-full max-w-lg rounded-xl border border-gray-200 bg-white p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm open:flex open:flex-col",
        className
      )}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <div className="overflow-y-auto p-6">{children}</div>
    </dialog>
  )
}
