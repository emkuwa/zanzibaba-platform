import type { ProductKey } from './config'

interface PaymentTransaction {
  id: string
  userId?: string
  productKey: ProductKey
  productName: string
  amount: number
  currency: string
  gateway: 'selcom' | 'flutterwave' | 'stripe' | 'manual'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentId?: string
  createdAt: Date
  completedAt?: Date
}

type TransactionStatus = PaymentTransaction['status']
type Gateway = PaymentTransaction['gateway']

const transactions: PaymentTransaction[] = [
  {
    id: 'TXN-001',
    userId: 'USR-001',
    productKey: 'verifiedSupplier',
    productName: 'Verified Supplier',
    amount: 199,
    currency: 'USD',
    gateway: 'stripe',
    status: 'completed',
    paymentId: 'pi_stripe_001',
    createdAt: new Date('2025-05-15'),
    completedAt: new Date('2025-05-15'),
  },
  {
    id: 'TXN-002',
    userId: 'USR-002',
    productKey: 'featuredSupplier',
    productName: 'Featured Supplier',
    amount: 99,
    currency: 'USD',
    gateway: 'selcom',
    status: 'completed',
    paymentId: 'selcom_txn_002',
    createdAt: new Date('2025-05-20'),
    completedAt: new Date('2025-05-20'),
  },
  {
    id: 'TXN-003',
    userId: 'USR-003',
    productKey: 'advertisingBasic',
    productName: 'Basic Advertising Package',
    amount: 299,
    currency: 'USD',
    gateway: 'flutterwave',
    status: 'pending',
    createdAt: new Date('2025-05-28'),
  },
  {
    id: 'TXN-004',
    userId: 'USR-004',
    productKey: 'featuredContractor',
    productName: 'Featured Contractor',
    amount: 99,
    currency: 'USD',
    gateway: 'manual',
    status: 'completed',
    paymentId: 'manual_cash_001',
    createdAt: new Date('2025-05-25'),
    completedAt: new Date('2025-05-25'),
  },
  {
    id: 'TXN-005',
    userId: 'USR-005',
    productKey: 'verifiedSupplier',
    productName: 'Verified Supplier',
    amount: 199,
    currency: 'USD',
    gateway: 'stripe',
    status: 'failed',
    createdAt: new Date('2025-06-01'),
  },
]

let nextTxnId = 6

function generateTxnId(): string {
  const num = String(nextTxnId).padStart(3, '0')
  nextTxnId++
  return `TXN-${num}`
}

export function createTransaction(
  tx: Omit<PaymentTransaction, 'id' | 'createdAt'>
): PaymentTransaction {
  const newTx: PaymentTransaction = {
    ...tx,
    id: generateTxnId(),
    createdAt: new Date(),
  }
  transactions.push(newTx)
  return newTx
}

export function getTransactions(): PaymentTransaction[] {
  return [...transactions]
}

export function getTransactionsByStatus(status: TransactionStatus): PaymentTransaction[] {
  return transactions.filter((t) => t.status === status)
}

export function getTransactionsByDateRange(start: Date, end: Date): PaymentTransaction[] {
  return transactions.filter((t) => {
    const d = new Date(t.createdAt)
    return d >= start && d <= end
  })
}

export function getRevenueSummary() {
  const completed = transactions.filter((t) => t.status === 'completed')

  const total = completed.reduce((sum, t) => sum + t.amount, 0)

  const byProduct: Record<string, number> = {}
  const byGateway: Record<string, number> = {}

  for (const t of completed) {
    byProduct[t.productName] = (byProduct[t.productName] || 0) + t.amount
    byGateway[t.gateway] = (byGateway[t.gateway] || 0) + t.amount
  }

  return { total, byProduct, byGateway }
}

export type { PaymentTransaction, TransactionStatus, Gateway }
