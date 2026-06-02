export const paymentConfig = {
  currency: 'USD',
  defaultCurrency: 'TZS',

  gateways: {
    selcom: {
      enabled: false,
      name: 'Selcom',
      merchantId: process.env.SELCOM_MERCHANT_ID || '',
      apiKey: process.env.SELCOM_API_KEY || '',
      apiSecret: process.env.SELCOM_API_SECRET || '',
    },
    flutterwave: {
      enabled: false,
      name: 'Flutterwave',
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
    },
    stripe: {
      enabled: false,
      name: 'Stripe',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
    },
  },

  products: {
    verifiedSupplier: {
      name: 'Verified Supplier',
      price: 199,
      type: 'one-time',
      description: 'One-time verification fee + $49 annual renewal',
    },
    featuredSupplier: {
      name: 'Featured Supplier',
      price: 99,
      type: 'monthly',
      description: 'Featured placement in supplier directory',
    },
    featuredContractor: {
      name: 'Featured Contractor',
      price: 99,
      type: 'monthly',
      description: 'Featured placement in contractor directory',
    },
    advertisingBasic: {
      name: 'Basic Advertising Package',
      price: 299,
      type: 'monthly',
      description: 'Display banners on category pages',
    },
    advertisingPremium: {
      name: 'Premium Advertising Package',
      price: 999,
      type: 'monthly',
      description: 'Homepage banners + category exclusivity',
    },
  },
} as const

export type ProductKey = keyof typeof paymentConfig.products
export type GatewayKey = keyof typeof paymentConfig.gateways
