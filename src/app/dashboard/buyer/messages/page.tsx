"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Send, ArrowLeft, Phone, Video } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: "them" | "me"
  text: string
  time: string
}

interface Conversation {
  id: string
  name: string
  company: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  messages: Message[]
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Azam Building Supplies",
    company: "Building Materials",
    avatar: "AB",
    lastMessage: "Sure, we can deliver the cement by next week. Let me send you the revised quote.",
    time: "2 min ago",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", sender: "them", text: "Hello! We received your RFQ for cement supply.", time: "10:30 AM" },
      { id: "m2", sender: "me", text: "Great, can you confirm the delivery timeline?", time: "10:32 AM" },
      { id: "m3", sender: "them", text: "Sure, we can deliver the cement by next week. Let me send you the revised quote.", time: "10:35 AM" },
      { id: "m4", sender: "me", text: "Perfect, please send it over.", time: "10:36 AM" },
    ],
  },
  {
    id: "2",
    name: "Zanzibar Cement Ltd",
    company: "Cement Manufacturer",
    avatar: "ZC",
    lastMessage: "Your order #ORD-2024-0018 has been shipped. Tracking number: ZCL-98472.",
    time: "1 hour ago",
    unread: 0,
    online: false,
    messages: [
      { id: "m5", sender: "them", text: "Your order #ORD-2024-0018 has been shipped. Tracking number: ZCL-98472.", time: "9:15 AM" },
      { id: "m6", sender: "me", text: "Thanks for the update! When is the expected arrival?", time: "9:20 AM" },
    ],
  },
  {
    id: "3",
    name: "East Africa Materials Co",
    company: "Steel & Reinforcement",
    avatar: "EM",
    lastMessage: "Our team is preparing the quote for steel bars. We'll have it ready by tomorrow.",
    time: "3 hours ago",
    unread: 1,
    online: true,
    messages: [
      { id: "m7", sender: "them", text: "Thank you for sending the specifications.", time: "8:00 AM" },
      { id: "m8", sender: "them", text: "Our team is preparing the quote for steel bars. We'll have it ready by tomorrow.", time: "8:01 AM" },
    ],
  },
  {
    id: "4",
    name: "Tanga Steel Traders",
    company: "Steel Supply",
    avatar: "TS",
    lastMessage: "We can offer a bulk discount if you order over 100 tons. Let's discuss.",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: "m9", sender: "them", text: "We reviewed your requirements for steel reinforcement.", time: "Yesterday at 2:00 PM" },
      { id: "m10", sender: "them", text: "We can offer a bulk discount if you order over 100 tons. Let's discuss.", time: "Yesterday at 2:01 PM" },
      { id: "m11", sender: "me", text: "That sounds interesting. What discount are we looking at?", time: "Yesterday at 3:00 PM" },
    ],
  },
  {
    id: "5",
    name: "Dar Es Salaam Hardware",
    company: "Hardware & Tools",
    avatar: "DH",
    lastMessage: "The plumbing fixtures you ordered are now in stock. Come pick them up anytime.",
    time: "2 days ago",
    unread: 0,
    online: true,
    messages: [
      { id: "m12", sender: "them", text: "The plumbing fixtures you ordered are now in stock. Come pick them up anytime.", time: "2 days ago" },
    ],
  },
]

export default function MessagesPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Conversation>(conversations[0])
  const [reply, setReply] = useState("")

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleSend() {
    if (!reply.trim()) return
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: reply,
      time: "Just now",
    }
    setSelected((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: reply,
    }))
    setReply("")
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500">Communicate with your suppliers</p>
      </div>

      <Card className="flex h-[calc(100vh-12rem)] overflow-hidden">
        <div className="flex w-full">
          <div className="flex w-[35%] shrink-0 flex-col border-r border-gray-200">
            <div className="border-b border-gray-200 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search conversations..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelected(conversation)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-gray-50",
                    selected.id === conversation.id && "bg-zanzibar-50"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar size="sm" fallback={conversation.avatar} />
                    {conversation.online && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{conversation.name}</p>
                      <p className="shrink-0 text-xs text-gray-400">{conversation.time}</p>
                    </div>
                    <p className="truncate text-xs text-gray-500">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="h-5 min-w-5 px-1.5 text-[10px]">{conversation.unread}</Badge>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                  No conversations found
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <div className="flex items-center gap-3">
                <Avatar size="sm" fallback={selected.avatar} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selected.name}</p>
                  <p className="text-xs text-gray-400">{selected.company}{selected.online ? " · Online" : ""}</p>
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
              {selected.messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5",
                      msg.sender === "me"
                        ? "bg-zanzibar-600 text-white"
                        : "bg-gray-100 text-gray-900"
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
        </div>
      </Card>
    </div>
  )
}
