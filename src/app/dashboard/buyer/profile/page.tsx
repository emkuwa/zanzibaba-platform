"use client"

import { useState } from "react"
import { Camera, Save, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const businessTypeOptions = [
  { value: "private", label: "Private Developer" },
  { value: "corporate", label: "Corporate" },
  { value: "government", label: "Government" },
  { value: "ngo", label: "NGO" },
  { value: "individual", label: "Individual" },
]

const notificationSettings = [
  { id: "email_quotes", label: "New Quotes", description: "When a supplier sends you a quote" },
  { id: "email_orders", label: "Order Updates", description: "When your order status changes" },
  { id: "email_messages", label: "Messages", description: "When you receive a new message" },
  { id: "email_marketing", label: "Promotions & Deals", description: "Special offers and discounts" },
  { id: "email_rfq_closing", label: "RFQ Closing Reminders", description: "When your RFQs are about to close" },
]

export default function ProfilePage() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@beachfrontvillars.com")
  const [phone, setPhone] = useState("+255 712 345 678")
  const [company, setCompany] = useState("Beachfront Villas Ltd")
  const [businessType, setBusinessType] = useState("private")
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email_quotes: true,
    email_orders: true,
    email_messages: true,
    email_marketing: false,
    email_rfq_closing: true,
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saved, setSaved] = useState(false)

  function toggleNotification(id: string) {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-sm text-gray-500">Manage your account information and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar size="lg" fallback="JD" />
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-zanzibar-600 text-white shadow-sm hover:bg-zanzibar-700">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
              <Button variant="outline" size="sm" className="mt-2">Change Photo</Button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="phone" label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input id="company" label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="max-w-xs">
            <Select
              id="business_type"
              label="Business Type"
              options={businessTypeOptions}
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                <p className="text-xs text-gray-500">{setting.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[setting.id]}
                onClick={() => toggleNotification(setting.id)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zanzibar-500 focus-visible:ring-offset-2",
                  notifications[setting.id] ? "bg-zanzibar-600" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform",
                    notifications[setting.id] ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Change Password</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              id="current_password"
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <Input
                id="new_password"
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                id="confirm_password"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>
          <Save className="mr-1.5 h-4 w-4" /> Save Changes
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium animate-pulse">
            Changes saved successfully!
          </span>
        )}
      </div>
    </div>
  )
}

