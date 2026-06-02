"use client"

import { Building2, Sparkles, User, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "ai" | "user" | "system"
  content: string | React.ReactNode
  type?: "text" | "profile-draft" | "rfq-draft" | "product-import" | "loading"
}

interface ChatMessageProps {
  message: Message
}

function AIMessage({ content }: { content: string | React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zanzibar-500 to-zanzibar-700 shadow-sm">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="rounded-2xl rounded-tl-sm bg-zanzibar-50 px-4 py-3 text-sm text-gray-800 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  )
}

function UserMessage({ content }: { content: string | React.ReactNode }) {
  return (
    <div className="flex gap-3 flex-row-reverse">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 shadow-sm">
        <User className="h-4 w-4 text-gray-600" />
      </div>
      <div className="flex-1 flex justify-end">
        <div className="rounded-2xl rounded-tr-sm bg-zanzibar-600 px-4 py-3 text-sm text-white leading-relaxed max-w-[85%]">
          {content}
        </div>
      </div>
    </div>
  )
}

function SystemMessage({ content }: { content: string | React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-600">
        <CheckCircle className="h-3.5 w-3.5 text-zanzibar-600" />
        {content}
      </div>
    </div>
  )
}

function LoadingMessage() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zanzibar-500 to-zanzibar-700 shadow-sm">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-zanzibar-50 px-4 py-3">
        <Loader2 className="h-4 w-4 animate-spin text-zanzibar-600" />
        <span className="text-sm text-gray-500">Thinking...</span>
      </div>
    </div>
  )
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.type === "loading") return <LoadingMessage />
  if (message.role === "ai") return <AIMessage content={message.content} />
  if (message.role === "system") return <SystemMessage content={message.content} />
  return <UserMessage content={message.content} />
}

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  )
}

export function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i < currentStep
              ? "bg-zanzibar-600"
              : i === currentStep
                ? "bg-zanzibar-400"
                : "bg-gray-200"
          )}
        />
      ))}
    </div>
  )
}
