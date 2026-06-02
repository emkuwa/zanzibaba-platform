import type { Metadata } from "next"
import { ChevronRight, HelpCircle, ShoppingCart, Store, HardHat, Shield, CreditCard } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ - Zanzibaba",
  description: "Frequently asked questions about Zanzibaba marketplace for buyers, suppliers, and contractors.",
}

const categories = [
  {
    id: "buyers",
    label: "For Buyers",
    icon: ShoppingCart,
    questions: [
      { q: "How do I search for products?", a: "Use the search bar at the top of any page. You can search by product name, category, supplier, or keyword. Use filters to narrow down by price, location, and supplier verification status." },
      { q: "How do I request a quote?", a: "Click 'Request Quote' on any product page, or use the RFQ center to post your requirements for multiple items. Suppliers will respond with competitive quotes within 24 hours." },
      { q: "Can I contact suppliers directly?", a: "Yes, you can use our in-platform messaging system or contact suppliers directly via WhatsApp using the button on their profile page." },
      { q: "How are suppliers verified?", a: "Suppliers undergo a verification process including business license validation, physical address verification, and review of company credentials. Verified suppliers display a shield badge." },
    ],
  },
  {
    id: "suppliers",
    label: "For Suppliers",
    icon: Store,
    questions: [
      { q: "How do I register as a supplier?", a: "Create an account and select 'Supplier' as your account type. Complete your company profile with business information, upload your product catalog, and submit for verification." },
      { q: "What membership plans are available?", a: "We offer Basic ($49/mo), Professional ($149/mo), and Enterprise ($499/mo) plans. Each tier offers increasing visibility, features, and support. See our pricing page for details." },
      { q: "How do I receive RFQs?", a: "When you post as a supplier, you'll receive RFQ notifications matching your product categories. Professional and Enterprise members get priority matching." },
      { q: "Is there a transaction fee?", a: "Free and Basic plans include a 3% transaction fee. Professional plans include 1.5%. Enterprise plans have custom negotiated rates." },
    ],
  },
  {
    id: "contractors",
    label: "For Contractors",
    icon: HardHat,
    questions: [
      { q: "How do I find projects to bid on?", a: "Browse the Projects section and use filters to find projects matching your specialties and budget range. Submit your bid directly through the platform." },
      { q: "Can I list my completed projects?", a: "Yes, you can build a portfolio of completed projects on your profile to showcase your work to potential clients." },
      { q: "How do I get verified as a contractor?", a: "Submit your contractor license, business registration, and references. Our team reviews your application within 2-3 business days." },
    ],
  },
  {
    id: "verification",
    label: "About Verification",
    icon: Shield,
    questions: [
      { q: "What does the verification badge mean?", a: "The verified shield badge indicates that the supplier, contractor, or professional has been reviewed and approved by Zanzibaba's verification team." },
      { q: "How long does verification take?", a: "Standard verification takes 2-5 business days. Premium members get expedited verification within 24 hours." },
      { q: "What documents are needed for verification?", a: "Business registration certificate, tax ID, physical address proof, and valid contact information. Additional documents may be required based on your business type." },
    ],
  },
  {
    id: "payments",
    label: "About Payments",
    icon: CreditCard,
    questions: [
      { q: "What payment methods are accepted?", a: "We accept mobile money (M-Pesa, Tigo Pesa, Airtel Money), bank transfers, credit/debit cards, and PayPal." },
      { q: "Is my payment information secure?", a: "Yes, all payments are processed through secure, encrypted channels. We use industry-standard security protocols to protect your financial data." },
      { q: "How do refunds work?", a: "Refund requests are handled on a case-by-case basis. Contact our support team within 14 days of purchase to initiate a refund request." },
      { q: "Can I pay in Tanzanian Shillings?", a: "Yes, we support TZS, USD, EUR, and GBP. You can select your preferred currency in your account settings." },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-gray-300">
              Everything you need to know about using Zanzibaba. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{cat.label}</h2>
                  </div>
                  <div className="space-y-3">
                    {cat.questions.map((faq) => (
                      <details key={faq.q} className="group rounded-xl border border-gray-200 bg-white">
                        <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium text-gray-900">
                          {faq.q}
                          <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                        </summary>
                        <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-600 leading-relaxed">
                          {faq.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
