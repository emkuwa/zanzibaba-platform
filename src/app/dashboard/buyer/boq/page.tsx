/**
 * Buyer dashboard — BOQ upload + parse + schedule
 * /dashboard/buyer/boq
 */

"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Layers, Loader2, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"

interface ParsedLine {
  description: string
  qty: number
  unit?: string | null
  rate?: number | null
  amount?: number | null
  materialId?: string | null
  matchScore?: number | null
}
interface BOQDoc {
  id: string
  filename: string | null
  status: string
  itemCount: number
  matchedCount: number
  parsed?: { lines?: ParsedLine[]; warnings?: string[] } | null
}
interface ScheduleLine {
  description: string
  qty: number | string
  unit?: string | null
  unitPriceMedian?: number | string | null
  costMedian?: number | string | null
  categorySlug?: string | null
  needsReview: boolean
}
interface Schedule {
  id: string
  title: string | null
  grandTotalTzs?: number | string | null
  grandTotalUsd?: number | string | null
  region: { code: string; name: string }
  lineItems: ScheduleLine[]
}

const fmtN = (v: number | string | null | undefined) =>
  v ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(v)) : "—"

export default function BOQUploadPage() {
  const [paste, setPaste] = useState("")
  const [region, setRegion] = useState("ZNZ")
  const [doc, setDoc] = useState<BOQDoc | null>(null)
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  const submit = () => {
    setErr(null)
    setSchedule(null)
    start(async () => {
      try {
        const r1 = await fetch("/api/boq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: paste, filename: "paste.txt" }),
        })
        if (!r1.ok) throw new Error((await r1.json()).message ?? "Parse failed")
        const data = await r1.json()
        setDoc(data.document)
        // immediately build a priced schedule
        const r2 = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ boqDocumentId: data.document.id, regionCode: region }),
        })
        if (!r2.ok) throw new Error((await r2.json()).message ?? "Schedule failed")
        setSchedule(await r2.json())
      } catch (e) {
        setErr((e as Error).message)
      }
    })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">BOQ Intelligence</h1>
          <p className="mt-2 text-slate-600">
            Paste your Bill of Quantities (Excel/CSV/text). We&apos;ll parse it, match each line to a canonical
            material, price it against the regional index, and produce a priced schedule + supplier candidates.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Region</label>
              <div className="flex flex-wrap gap-2">
                {[["ZNZ","Zanzibar"],["DSM","Dar es Salaam"],["ARU","Arusha"],["DOD","Dodoma"],["MWZ","Mwanza"]].map(([v,l])=>(
                  <button key={v} type="button" onClick={()=>setRegion(v)} className={`rounded-full px-3 py-1 text-sm ${region===v?"bg-amber-600 text-white":"border bg-white"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Paste BOQ (tab / comma / space separated)</label>
              <textarea
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                rows={14}
                placeholder={`OPC 42.5N Cement 50 kg, 250, bag\nY12 Rebar 12m, 180, piece\nHollow Block 6", 4500, piece\n`}
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="mt-1 text-xs text-slate-400">{paste.split("\n").filter(Boolean).length} rows</p>
            </div>
            <Button onClick={submit} disabled={pending || paste.trim().length < 20} size="lg" className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
              {pending ? (<><Loader2 className="h-4 w-4 animate-spin" /> Parsing & pricing…</>) : (<><FileText className="h-4 w-4" /> Parse + Price</>)}
            </Button>
            {err && <p className="text-sm text-red-600">{err}</p>}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {!doc && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              <Layers className="mx-auto h-10 w-10 text-amber-500" />
              <p className="mt-3 text-sm">Your priced schedule will appear here.</p>
            </div>
          )}

          {doc && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Parsed BOQ</h2>
                  <Badge variant={doc.status === "PARSED" ? "default" : "secondary"}>{doc.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {doc.itemCount} rows · {doc.matchedCount} matched ({Math.round((doc.matchedCount/Math.max(doc.itemCount,1))*100)}%)
                </p>
              </CardContent>
            </Card>
          )}

          {schedule && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">{schedule.title ?? "Priced Schedule"}</h2>
                  <Badge variant="outline">{schedule.region.name}</Badge>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-amber-700">TZS {fmtN(schedule.grandTotalTzs)}</span>
                  {schedule.grandTotalUsd ? (
                    <span className="text-sm text-slate-500">≈ USD {fmtN(schedule.grandTotalUsd)}</span>
                  ) : null}
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Description</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Unit price</th>
                        <th className="px-3 py-2 text-right">Total (TZS)</th>
                        <th className="px-3 py-2 text-center">Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schedule.lineItems.map((li, i) => (
                        <tr key={i} className={li.needsReview ? "bg-amber-50" : ""}>
                          <td className="px-3 py-2 text-slate-800">{li.description}</td>
                          <td className="px-3 py-2 text-right text-slate-700">{fmtN(li.qty)} {li.unit}</td>
                          <td className="px-3 py-2 text-right text-slate-700">{fmtN(li.unitPriceMedian)}</td>
                          <td className="px-3 py-2 text-right font-medium text-slate-900">{fmtN(li.costMedian)}</td>
                          <td className="px-3 py-2 text-center">
                            {li.needsReview ? (
                              <AlertTriangle className="mx-auto h-4 w-4 text-amber-600" />
                            ) : (
                              <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/dashboard/buyer/procurement?scheduleId=${schedule.id}`}>
                    <Button className="gap-1 bg-amber-600 hover:bg-amber-700">
                      Create Procurement Plan <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Link href="/rfq">
                    <Button variant="outline">Send to Suppliers</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}
