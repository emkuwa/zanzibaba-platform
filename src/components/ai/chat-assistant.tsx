"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Bot, ChevronDown } from "lucide-react"
import type { ChatMessage } from "@/lib/ai/chat-assistant"

const SUGGESTIONS = [
  "Find steel suppliers",
  "Find hotel furniture suppliers",
  "Find active projects",
  "Request fulfillment support",
  "How do I feature my business?",
  "What is the Founding Supplier program?",
]

export function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your Zanzibaba AI Assistant. I can help you find suppliers, projects, opportunities, and more. What are you looking for?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return

    const userMsg: ChatMessage = { role: "user", content }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn't process that." }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-200 ${
          isMinimized ? "h-14 w-80" : "h-[520px] w-[380px]"
        }`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-zanzibar-600 to-zanzibar-800 text-white rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold text-sm">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded-lg transition">
                <ChevronDown className={`h-4 w-4 transition ${isMinimized ? "rotate-180" : ""}`} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zanzibar-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />

                {messages.length === 1 && (
                  <div className="pt-2">
                    <p className="text-[11px] text-gray-400 mb-2 font-medium uppercase tracking-wide">Quick Questions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="text-xs bg-gray-50 hover:bg-zanzibar-50 text-gray-600 hover:text-zanzibar-700 border border-gray-200 hover:border-zanzibar-300 rounded-full px-3 py-1.5 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 p-3 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                    placeholder="Ask about suppliers, projects..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-400 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="bg-zanzibar-600 hover:bg-zanzibar-700 disabled:bg-gray-300 text-white rounded-xl p-2.5 transition-colors"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false) }}
        className="bg-zanzibar-600 hover:bg-zanzibar-700 text-white rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  )
}
