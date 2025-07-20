"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Lightbulb, Apple } from "lucide-react"
import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useAuth } from "@/contexts/auth-context"
import ReactMarkdown from 'react-markdown'

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
}

// Add your Supabase URL and anon key here (or use env vars in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AIAssistantPage() {
  const { user, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "Hi! I'm your AI Nutrition Coach. I'm here to help with personalized nutrition advice, meal planning, and achieving your fitness goals. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Fetch user profile from Supabase on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true)
      if (!user) {
        setUserProfile(null)
        setProfileLoading(false)
        return
      }
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
      if (error) {
        setUserProfile(null)
      } else {
        setUserProfile(data)
      }
      setProfileLoading(false)
    }
    if (!authLoading) {
      fetchProfile()
    }
  }, [user, authLoading])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    if (profileLoading) return
    if (!userProfile) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "ai",
          content: "Please complete your profile to get personalized nutrition advice.",
          timestamp: new Date(),
        },
      ])
      setInputMessage("")
      return
    }
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Call Gemini API via our secure route
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: inputMessage,
          userProfile,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "ai",
          content: data.answer || "Sorry, I couldn't process your question. Please try again.",
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "ai",
          content: "Sorry, there was an error connecting to the AI service.",
          timestamp: new Date(),
        },
      ])
    }
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col items-center py-2 px-1">
      {/* Sticky Header */}
      <div className="w-full max-w-md sticky top-0 z-10 bg-white/80 rounded-b-xl shadow-md mb-2 flex flex-col items-center py-2">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-bold text-gray-900">AI Nutrition Coach</span>
        </div>
        <span className="text-xs text-purple-700 font-medium mt-1">Powered by Gemini AI</span>
      </div>

      {/* Chat Card */}
      <div className="w-full max-w-md flex-1 flex flex-col justify-end">
        <div className="flex flex-col flex-1 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200 overflow-hidden h-[80vh] min-h-[350px]">
          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-sm shadow ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "ai" && <Bot className="w-4 h-4 mt-0.5 text-purple-600" />}
                      {message.type === "user" && <User className="w-4 h-4 mt-0.5" />}
                      <div className="flex-1">
                        {message.type === "ai" ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${message.type === "user" ? "text-emerald-100" : "text-gray-500"}`}>{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3 max-w-[85%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Input Box */}
          <div className="border-t p-3 bg-white/90">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask about nutrition, meals, or goals..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-2 focus:border-emerald-300 rounded-lg"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="w-full max-w-md mt-2">
        <div className="rounded-xl bg-white/80 border border-gray-200 p-3 text-center text-xs text-gray-600 shadow">
          This AI provides general nutrition information. Always consult healthcare professionals for medical advice.
        </div>
      </div>
    </div>
  )
}
