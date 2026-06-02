"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CreatePlanForm(props: { preselectSchedule: { id: string; title: string; region: string } | null }) {
  const [title, setTitle] = useState(props.preselectSchedule ? `Procurement — ${props.preselectSchedule.title}` : "")
  const [description, setDescription] = useState("")
  const [err, setErr] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  const submit = () => {
    setErr(null)
    start(async () => {
      try {
        const r = await fetch("/api/procurement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description: description || undefined,
            scheduleId: props.preselectSchedule?.id,
          }),
        })
        if (!r.ok) throw new Error((await r.json()).message ?? "Failed to create plan")
        router.refresh()
      } catch (e) {
        setErr((e as Error).message)
      }
    })
  }

  return (
    <div className="space-y-3">
      {props.preselectSchedule && (
        <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Linked to schedule: <strong>{props.preselectSchedule.title}</strong> ({props.preselectSchedule.region})
        </p>
      )}
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Plan title (e.g. Villa Nungwi — Phase 1 procurement)" />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Optional notes"
        className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      <Button onClick={submit} disabled={pending || title.trim().length < 2} className="bg-amber-600 hover:bg-amber-700">
        {pending ? "Creating…" : "Create plan"}
      </Button>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </div>
  )
}
