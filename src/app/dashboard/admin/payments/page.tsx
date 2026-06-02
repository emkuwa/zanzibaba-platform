'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import { paymentConfig, type ProductKey, type GatewayKey } from '@/lib/payments/config'
import { getTransactions, getRevenueSummary, createTransaction } from '@/lib/payments/payment-store'
import {
  DollarSign,
  CreditCard,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Wallet,
  Landmark,
  Globe,
  Building2,
} from 'lucide-react'

const gatewayIcons: Record<string, React.ElementType> = {
  stripe: CreditCard,
  selcom: Building2,
  flutterwave: Globe,
  manual: Wallet,
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'default' }> = {
  completed: { label: 'Completed', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  failed: { label: 'Failed', variant: 'danger' },
  refunded: { label: 'Refunded', variant: 'default' },
}

const gatewayNames: Record<string, string> = {
  stripe: 'Stripe',
  selcom: 'Selcom',
  flutterwave: 'Flutterwave',
  manual: 'Manual',
}

export default function AdminPaymentsPage() {
  const [showManualPayment, setShowManualPayment] = useState(false)
  const [manualForm, setManualForm] = useState({
    userId: '',
    productKey: 'verifiedSupplier' as ProductKey,
    amount: 199,
    currency: 'USD',
    paymentId: '',
  })
  const [isRecording, setIsRecording] = useState(false)

  const transactions = getTransactions()
  const revenue = getRevenueSummary()
  const products = Object.entries(paymentConfig.products)

  const handleRecordManual = () => {
    setIsRecording(true)
    setTimeout(() => {
      createTransaction({
        userId: manualForm.userId || undefined,
        productKey: manualForm.productKey,
        productName: paymentConfig.products[manualForm.productKey].name,
        amount: manualForm.amount,
        currency: manualForm.currency,
        gateway: 'manual',
        status: 'completed',
        paymentId: manualForm.paymentId || undefined,
      })
      setShowManualPayment(false)
      setIsRecording(false)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-500">Manage payments, products, and revenue</p>
        </div>
        <Button onClick={() => setShowManualPayment(true)}>
          <Plus className="mr-2 h-4 w-4" /> Manual Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(revenue.total)}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        {Object.entries(revenue.byGateway).map(([gateway, amount]) => {
          const Icon = gatewayIcons[gateway] || CreditCard
          return (
            <Card key={gateway}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zanzibar-100">
                  <Icon className="h-6 w-6 text-zanzibar-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(amount)}</p>
                  <p className="text-sm text-gray-500 capitalize">{gatewayNames[gateway] || gateway}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(([key, product]) => (
              <div key={key} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <Badge variant={product.type === 'one-time' ? 'default' : 'secondary'} className="text-[10px]">
                    {product.type}
                  </Badge>
                </div>
                <p className="mt-2 text-2xl font-bold text-zanzibar-600">{formatPrice(product.price)}</p>
                <p className="mt-1 text-xs text-gray-500">{product.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-600">Active</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Badge variant="outline" className="gap-1">
              <RefreshCw className="h-3 w-3" /> Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="text-left py-4 px-6 font-medium">ID</th>
                <th className="text-left py-4 px-6 font-medium">Product</th>
                <th className="text-left py-4 px-6 font-medium">Amount</th>
                <th className="text-left py-4 px-6 font-medium">Gateway</th>
                <th className="text-left py-4 px-6 font-medium">Status</th>
                <th className="text-left py-4 px-6 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
              {transactions.map((tx) => {
                const info = statusConfig[tx.status]
                const GatewayIcon = gatewayIcons[tx.gateway] || CreditCard
                return (
                  <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-mono text-gray-500">{tx.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{tx.productName}</td>
                    <td className="py-4 px-6 font-medium">{formatPrice(tx.amount, tx.currency)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <GatewayIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 capitalize">{gatewayNames[tx.gateway] || tx.gateway}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={info.variant} className="gap-1 capitalize">
                        {tx.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                        {tx.status === 'pending' && <Clock className="h-3 w-3" />}
                        {tx.status === 'failed' && <XCircle className="h-3 w-3" />}
                        {info.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{formatDate(tx.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Gateways</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(Object.entries(paymentConfig.gateways) as [GatewayKey, typeof paymentConfig.gateways[GatewayKey]][]).map(([key, gateway]) => {
              const Icon = gatewayIcons[key] || CreditCard
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      gateway.enabled ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      <Icon className={cn('h-5 w-5', gateway.enabled ? 'text-green-600' : 'text-gray-400')} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{gateway.name}</p>
                      <p className="text-xs text-gray-500">
                        {gateway.enabled ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    'h-3 w-3 rounded-full',
                    gateway.enabled ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showManualPayment} onClose={() => setShowManualPayment(false)} title="Record Manual Payment">
        <div className="space-y-4">
          <Input
            label="User ID (optional)"
            placeholder="e.g. USR-001"
            value={manualForm.userId}
            onChange={(e) => setManualForm({ ...manualForm, userId: e.target.value })}
          />
          <Select
            label="Product"
            value={manualForm.productKey}
            onChange={(e) => {
              const key = e.target.value as ProductKey
              setManualForm({ ...manualForm, productKey: key, amount: paymentConfig.products[key].price })
            }}
            options={products.map(([key, product]) => ({
              value: key,
              label: `${product.name} - ${formatPrice(product.price)}`,
            }))}
          />
          <Input
            label="Amount"
            type="number"
            value={manualForm.amount}
            onChange={(e) => setManualForm({ ...manualForm, amount: Number(e.target.value) })}
          />
          <Input
            label="Currency"
            value={manualForm.currency}
            onChange={(e) => setManualForm({ ...manualForm, currency: e.target.value })}
          />
          <Input
            label="Payment Reference (optional)"
            placeholder="Receipt or reference number"
            value={manualForm.paymentId}
            onChange={(e) => setManualForm({ ...manualForm, paymentId: e.target.value })}
          />
          <Separator />
          <Button className="w-full" onClick={handleRecordManual} disabled={isRecording}>
            {isRecording ? 'Recording...' : 'Record Payment'}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
