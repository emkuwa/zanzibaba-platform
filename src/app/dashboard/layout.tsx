"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  LayoutDashboard,
  FileText,
  ShoppingCart,
  MessageSquare,
  Users,
  Star,
  Settings,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  Package,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Crown,
  Megaphone,
  Briefcase,
  UserCheck,
  TrendingUp,
  CreditCard,
  HardHat,
  Truck,
  LogOut,
  HelpCircle,
  FolderOpen,
  UserCircle,
  Receipt,
  Globe,
  DollarSign,
  AlertTriangle,
  CheckSquare,
  Contact2,
  BookOpen,
  Rocket,
  Compass,
  Zap,
  Radar,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const roleNavItems: Record<string, { label: string; href: string; icon: React.ElementType; badge?: number }[]> = {
  buyer: [
    { label: "Overview", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "Projects", href: "/dashboard/buyer/projects", icon: FolderOpen },
    { label: "RFQs", href: "/dashboard/buyer/rfqs", icon: FileText },
    { label: "Quotes", href: "/dashboard/buyer/quotes", icon: ClipboardList, badge: 12 },
    { label: "Shortlist", href: "/dashboard/buyer/shortlist", icon: Users },
    { label: "Orders", href: "/dashboard/buyer/orders", icon: ShoppingCart },
    { label: "Messages", href: "/dashboard/buyer/messages", icon: MessageSquare, badge: 3 },
    { label: "Reviews", href: "/dashboard/buyer/reviews", icon: Star },
    { label: "Profile", href: "/dashboard/buyer/profile", icon: Settings },
  ],
  supplier: [
    { label: "Overview", href: "/dashboard/supplier", icon: LayoutDashboard },
    { label: "Growth", href: "/dashboard/supplier/growth", icon: Zap },
    { label: "Acquisition", href: "/dashboard/supplier/acquisition", icon: Radar },
    { label: "Activation", href: "/dashboard/supplier/activation", icon: UserPlus },
    { label: "Products", href: "/dashboard/supplier/products", icon: Package },
    { label: "RFQs", href: "/dashboard/supplier/rfqs", icon: FileText, badge: 5 },
    { label: "Quotes", href: "/dashboard/supplier/quotes", icon: ClipboardList },
    { label: "Leads", href: "/dashboard/supplier/leads", icon: TrendingUp },
    { label: "Orders", href: "/dashboard/supplier/orders", icon: ShoppingCart },
    { label: "Messages", href: "/dashboard/supplier/messages", icon: MessageSquare, badge: 2 },
    { label: "Reviews", href: "/dashboard/supplier/reviews", icon: Star },
    { label: "Analytics", href: "/dashboard/supplier/analytics", icon: BarChart3 },
    { label: "Promotions", href: "/dashboard/supplier/promotions", icon: Megaphone },
    { label: "Plans", href: "/dashboard/supplier/plans", icon: Crown },
    { label: "Membership", href: "/dashboard/supplier/membership", icon: UserCheck },
    { label: "Verification", href: "/dashboard/supplier/verification", icon: ShieldCheck },
    { label: "Profile", href: "/dashboard/supplier/profile", icon: Settings },
  ],
  contractor: [
    { label: "Overview", href: "/dashboard/contractor", icon: LayoutDashboard },
    { label: "Portfolio", href: "/dashboard/contractor/projects", icon: FolderOpen },
    { label: "RFQs", href: "/dashboard/contractor/rfqs", icon: FileText, badge: 3 },
    { label: "Quotes", href: "/dashboard/contractor/quotes", icon: ClipboardList },
    { label: "Leads", href: "/dashboard/contractor/leads", icon: TrendingUp },
    { label: "Messages", href: "/dashboard/contractor/messages", icon: MessageSquare, badge: 1 },
    { label: "Reviews", href: "/dashboard/contractor/reviews", icon: Star },
    { label: "Team", href: "/dashboard/contractor/team", icon: Users },
    { label: "Membership", href: "/dashboard/contractor/membership", icon: Crown },
    { label: "Verification", href: "/dashboard/contractor/verification", icon: ShieldCheck },
    { label: "Profile", href: "/dashboard/contractor/profile", icon: Settings },
  ],
  professional: [
    { label: "Overview", href: "/dashboard/professional", icon: LayoutDashboard },
    { label: "Portfolio", href: "/dashboard/professional/portfolio", icon: FolderOpen },
    { label: "Leads", href: "/dashboard/professional/leads", icon: TrendingUp },
    { label: "Messages", href: "/dashboard/professional/messages", icon: MessageSquare },
    { label: "Reviews", href: "/dashboard/professional/reviews", icon: Star },
    { label: "Verification", href: "/dashboard/professional/verification", icon: ShieldCheck },
    { label: "Membership", href: "/dashboard/professional/membership", icon: Crown },
    { label: "Profile", href: "/dashboard/professional/profile", icon: Settings },
  ],
  admin: [
    { label: "Founder", href: "/dashboard/founder", icon: TrendingUp },
    { label: "Launch", href: "/dashboard/launch", icon: Rocket },
    { label: "Revenue", href: "/dashboard/revenue", icon: DollarSign },
    { label: "Population", href: "/dashboard/population", icon: Users },
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Suppliers", href: "/dashboard/admin/suppliers", icon: Truck },
    { label: "Contractors", href: "/dashboard/admin/contractors", icon: HardHat },
    { label: "Professionals", href: "/dashboard/admin/professionals", icon: Briefcase },
    { label: "Leads", href: "/dashboard/admin/leads", icon: TrendingUp },
    { label: "Products", href: "/dashboard/admin/products", icon: Package },
    { label: "Projects", href: "/dashboard/admin/projects", icon: FolderOpen },
    { label: "RFQs", href: "/dashboard/admin/rfqs", icon: FileText },
    { label: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
    { label: "Payment Review", href: "/dashboard/admin/payments/review", icon: CheckSquare },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: DollarSign },
    { label: "Verification", href: "/dashboard/admin/verification", icon: ShieldCheck },
    { label: "Memberships", href: "/dashboard/admin/memberships", icon: Crown },
    { label: "Categories", href: "/dashboard/admin/categories", icon: Globe },
    { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
    { label: "Growth Agents", href: "/dashboard/admin/agents", icon: TrendingUp },
    { label: "Discovery", href: "/dashboard/admin/discovery", icon: Compass },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Advertising", href: "/dashboard/admin/advertising", icon: Megaphone },
    { label: "Reviews", href: "/dashboard/admin/reviews", icon: Star },
    { label: "Import", href: "/dashboard/admin/import", icon: FileText },
    { label: "Seed Data", href: "/dashboard/admin/seed", icon: CheckSquare },
    { label: "CRM", href: "/dashboard/admin/crm", icon: Contact2 },
    { label: "Sales Toolkit", href: "/dashboard/admin/sales-toolkit", icon: BookOpen },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
}

function getRoleFromPath(path: string): string {
  const parts = path.split("/")
  if (parts.length >= 3) return parts[2]
  return "buyer"
}

function getPageTitle(path: string): string {
  const parts = path.split("/").filter(Boolean)
  if (parts.length < 3) return "Dashboard"
  const segment = parts[parts.length - 1]
  if (segment === "new") return "Create New"
  if (segment.startsWith("[")) return "Detail"
  if (!isNaN(Number(segment))) return "Detail"
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const role = getRoleFromPath(pathname)
  const navItems = roleNavItems[role] || roleNavItems.buyer
  const pageTitle = getPageTitle(pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zanzibar-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-zanzibar-600">Zanzibaba</span>
          <span className="rounded-md bg-zanzibar-100 px-2 py-0.5 text-xs font-medium text-zanzibar-700 capitalize">
            {role}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zanzibar-50 text-zanzibar-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="default" className="h-5 min-w-5 px-1.5 text-center text-[10px]">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600">
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            onClick={() => router.push("/")}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                4
              </span>
            </button>

            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <Avatar size="sm" fallback="JD" />
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium leading-tight text-gray-900">John Doe</p>
                  <p className="text-xs leading-tight text-gray-500 capitalize">{role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                    <Link
                      href={`/dashboard/${role}/profile`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      href={`/dashboard/${role}/membership`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Crown className="h-4 w-4" /> Membership
                    </Link>
                    <Link
                      href={`/dashboard/${role}/settings`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setUserMenuOpen(false)
                        router.push("/")
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
