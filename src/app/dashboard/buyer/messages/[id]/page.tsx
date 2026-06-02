"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, Phone, Video } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: "them" | "me"
  text: string
  time: string
}

const conversationData: Record<string, { name: string; company: string; avatar: string; online: boolean; messages: Message[] }> = {
  "1": {
    name: "Azam Building Supplies",
    company: "Building Materials",
    avatar: "AB",
    online: true,
    messages: [
      { id: "m1", sender: "them", text: "Hello! We received your RFQ for cement supply.", time: "10:30 AM" },
      { id: "m2", sender: "me", text: "Great, can you confirm the delivery timeline?", time: "10:32 AM" },
      { id: "m3", sender: "them", text: "Sure, we can deliver the cement by next week. Let me send you the revised quote.", time: "10:35 AM" },
      { id: "m4", sender: "me", text: "Perfect, please send it over.", time: "10:36 AM" },
      { id: "m5", sender: "them", text: "Here is the revised quote: $44,500 with delivery within 14 days.", time: "10:40 AM" },
      { id: "m6", sender: "me", text: "That works for us. Can you include the VAT in that price?", time: "10:42 AM" },
      { id: "m7", sender: "them", text: "Yes, the price is inclusive of all taxes and delivery charges.", time: "10:45 AM" },
      { id: "m8", sender: "me", text: "Perfect. Let me review and get back to you shortly.", time: "10:46 AM" },
    ],
  },
  "2": {
    name: "Zanzibar Cement Ltd",
    company: "Cement Manufacturer",
    avatar: "ZC",
    online: false,
    messages: [
      { id: "m9", sender: "them", text: "Your order #ORD-2024-0018 has been shipped.", time: "9:15 AM" },
      { id: "m10", sender: "me", text: "Thanks for the update! When is the expected arrival?", time: "9:20 AM" },
      { id: "m11", sender: "them", text: "Expected delivery is Friday, Dec 22. We'll share the tracking details shortly.", time: "9:22 AM" },
      { id: "m12", sender: "me", text: "Excellent, thank you.", time: "9:25 AM" },
      { id: "m13", sender: "them", text: "Tracking number: ZCL-98472. You can track at zanzibacement.co.tz/track", time: "9:30 AM" },
    ],
  },
  "3": {
    name: "East Africa Materials Co",
    company: "Steel & Reinforcement",
    avatar: "EM",
    online: true,
    messages: [
      { id: "m14", sender: "them", text: "Thank you for sending the specifications.", time: "8:00 AM" },
      { id: "m15", sender: "them", text: "Our team is preparing the quote for steel bars. We'll have it ready by tomorrow.", time: "8:01 AM" },
      { id: "m16", sender: "me", text: "Great, we're looking forward to it. Please include Grade 60 and Grade 40 pricing.", time: "8:05 AM" },
      { id: "m17", sender: "them", text: "Noted. We'll include both grades in the quote.", time: "8:06 AM" },
    ],
  },
  "4": {
    name: "Tanga Steel Traders",
    company: "Steel Supply",
    avatar: "TS",
    online: false,
    messages: [
      { id: "m18", sender: "them", text: "We reviewed your requirements for steel reinforcement.", time: "Yesterday at 2:00 PM" },
      { id: "m19", sender: "them", text: "We can offer a bulk discount if you order over 100 tons. Let's discuss.", time: "Yesterday at 2:01 PM" },
      { id: "m20", sender: "me", text: "That sounds interesting. What discount are we looking at?", time: "Yesterday at 3:00 PM" },
      { id: "m21", sender: "them", text: "For orders above 100 tons, we can offer 8% discount on the total.", time: "Yesterday at 3:30 PM" },
      { id: "m22", sender: "me", text: "That's a good offer. Let me check with the team and get back to you.", time: "Yesterday at 4:00 PM" },
    ],
  },
  "5": {
    name: "Dar Es Salaam Hardware",
    company: "Hardware & Tools",
    avatar: "DH",
    online: true,
    messages: [
      { id: "m23", sender: "them", text: "The plumbing fixtures you ordered are now in stock. Come pick them up anytime.", time: "2 days ago" },
      { id: "m24", sender: "me", text: "Perfect, I'll send someone to collect them tomorrow.", time: "2 days ago" },
    ],
  },
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversation = conversationData[params.id as string]
  const [reply, setReply] = useState("")
  const [messages, setMessages] = useState<Message[]>(conversation?.messages || [])

  if (!conversation) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-center text-gray-500">Conversation not found</p>
      </div>
    )
  }

  function handleSend() {
    if (!reply.trim()) return
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: reply,
      time: "Just now",
    }
    setMessages((prev) => [...prev, newMsg])
    setReply("")
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar size="sm" fallback={conversation.avatar} />
          <div>
            <p className="text-sm font-medium text-gray-900">{conversation.name}</p>
            <p className="text-xs text-gray-400">{conversation.company}{conversation.online ? " · Online" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5",
                msg.sender === "me" ? "bg-zanzibar-600 text-white" : "bg-gray-100 text-gray-900"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={cn("mt-1 text-right text-[10px]", msg.sender === "me" ? "text-zanzibar-200" : "text-gray-400")}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!reply.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
