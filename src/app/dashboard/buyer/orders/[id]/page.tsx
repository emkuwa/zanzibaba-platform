"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Package, Phone, Star, Truck, CheckCircle, Clock, PackageCheck, XCircle, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const orderData = {
  id: "ORD-2024-0018",
  date: "Dec 10, 2024",
  status: "shipped",
  supplier: {
    name: "Zanzibar Cement Ltd",
    contact: "+255 777 123 456",
    email: "orders@zanzibacement.co.tz",
    location: "Zanzibar City, Tanzania",
  },
  items: [
    { name: "Portland Cement Grade 42.5N", sku: "CEM-425N", qty: "500 bags", unitPrice: "$78.00", total: "$39,000.00" },
    { name: "Delivery & Handling", sku: "DEL-001", qty: "1 lot", unitPrice: "$3,800.00", total: "$3,800.00" },
  ],
  subtotal: "$42,800.00",
  tax: "$0.00",
  total: "$42,800.00",
  paymentMethod: "Bank Transfer",
  paymentStatus: "Paid",
  tracking: {
    number: "ZCL-98472",
    url: "https://zanzibacement.co.tz/track",
  },
  timeline: [
    { label: "Order Placed", date: "Dec 10, 2024 · 10:30 AM", completed: true },
    { label: "Payment Confirmed", date: "Dec 10, 2024 · 2:15 PM", completed: true },
    { label: "Processing", date: "Dec 11, 2024 · 8:00 AM", completed: true },
    { label: "Shipped", date: "Dec 15, 2024 · 9:00 AM", completed: true },
    { label: "In Transit", date: "Expected Dec 18-20", completed: false, current: true },
    { label: "Delivered", date: "Pending", completed: false },
  ],
}

const statusVariant: Record<string, "default" | "warning" | "success" | "danger"> = {
  confirmed: "default",
  processing: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const order = orderData

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{order.id}</h2>
          <p className="text-sm text-gray-500">Placed on {order.date}</p>
        </div>
        <Badge variant={statusVariant[order.status]} className="text-sm">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Items Ordered</h3>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-gray-100">
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Item</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">SKU</th>
                    <th className="px-5 py-3 text-center font-medium text-gray-500">Qty</th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">Unit Price</th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <tr key={item.sku}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                            <Package className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{item.sku}</td>
                      <td className="px-5 py-3.5 text-center text-gray-600">{item.qty}</td>
                      <td className="px-5 py-3.5 text-right text-gray-600">{item.unitPrice}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-gray-900">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-100">
                    <td colSpan={4} className="px-5 py-3 text-right text-sm text-gray-500">Subtotal</td>
                    <td className="px-5 py-3 text-right text-sm font-medium text-gray-900">{order.subtotal}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="px-5 py-3 text-right text-sm text-gray-500">Tax</td>
                    <td className="px-5 py-3 text-right text-sm font-medium text-gray-900">{order.tax}</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td colSpan={4} className="px-5 py-3 text-right text-sm font-semibold text-gray-900">Total</td>
                    <td className="px-5 py-3 text-right text-sm font-bold text-gray-900">{order.total}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Tracking Timeline</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {order.timeline.map((step, i) => (
                  <div key={step.label} className="relative flex gap-3 pb-6 last:pb-0">
                    {i < order.timeline.length - 1 && (
                      <div
                        className={cn(
                          "absolute left-[9px] top-5 w-0.5 -translate-x-1/2",
                          step.completed ? "bg-zanzibar-500" : "bg-gray-200",
                          i === order.timeline.length - 2 && !step.completed && "h-0"
                        )}
                        style={{ height: step.completed || (i < order.timeline.length - 1 && order.timeline[i + 1].completed) ? "calc(100% - 1.25rem)" : undefined }}
                      />
                    )}
                    <div
                      className={cn(
                        "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        step.completed
                          ? "bg-zanzibar-500 text-white"
                          : step.current
                            ? "border-2 border-zanzibar-500 bg-white"
                            : "bg-gray-200"
                      )}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : step.current ? (
                        <div className="h-2 w-2 rounded-full bg-zanzibar-500" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium", step.current ? "text-zanzibar-700" : "text-gray-700")}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Supplier</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zanzibar-100 text-sm font-semibold text-zanzibar-700">
                  ZC
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.supplier.name}</p>
                  <p className="text-xs text-gray-500">{order.supplier.location}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{order.supplier.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span>{order.supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{order.supplier.location}</span>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="mr-1.5 h-4 w-4" /> Contact Supplier
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Payment Info</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <Badge variant="success">{order.paymentStatus}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-gray-900">{order.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Tracking</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Number</span>
                <span className="font-mono text-xs font-medium text-gray-900">{order.tracking.number}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Truck className="mr-1.5 h-4 w-4" /> Track Shipment
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <Star className="mr-1.5 h-4 w-4" /> Leave a Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
