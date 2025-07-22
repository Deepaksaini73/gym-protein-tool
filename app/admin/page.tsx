"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Feedback {
  id: string
  user_name: string
  user_email: string
  issue_type: string
  description: string
  feature_request: string | null
  usability_rating: number
  health_impact_rating: number
  created_at: string
  status: 'pending' | 'resolved'
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  const handleLogin = () => {
    if (!username) {
      toast.error("Username is required")
      return
    }
    if (!password) {
      toast.error("Password is required")
      return
    }
    
    if (username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && 
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      toast.success("Welcome, Admin!")
    } else if (username !== process.env.NEXT_PUBLIC_ADMIN_USERNAME) {
      toast.error("Username not found")
    } else {
      toast.error("Invalid password")
    }
  }

  const fetchFeedbacks = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
    } catch (error) {
      console.error("Error fetching feedback:", error)
      toast.error("Failed to load feedback")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFeedbackStatus = async (id: string, status: 'pending' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setFeedbacks(feedbacks.map(f => 
        f.id === id ? { ...f, status } : f
      ))
      
      toast.success(`Feedback marked as ${status}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filter === "all") return true
    if (filter === "pending" || filter === "resolved") return f.status === filter
    return f.issue_type === filter
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>User Feedback</CardTitle>
            <Button
              onClick={fetchFeedbacks}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-blue-500"
            >
              {isLoading ? "Loading..." : "Load Feedback"}
            </Button>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feedback</SelectItem>
              <SelectItem value="bug">Bugs</SelectItem>
              <SelectItem value="feature">Feature Requests</SelectItem>
              <SelectItem value="improvement">Improvements</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading feedback...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Feature Request</TableHead>
                    <TableHead className="text-center">Ratings</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{feedback.user_name}</p>
                          <p className="text-sm text-gray-500">{feedback.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${feedback.issue_type === 'bug' ? 'bg-red-100 text-red-700' :
                          feedback.issue_type === 'feature' ? 'bg-purple-100 text-purple-700' :
                          feedback.issue_type === 'improvement' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'}`}>
                          {feedback.issue_type}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{feedback.description}</p>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{feedback.feature_request || '-'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span title="Usability" className="text-sm">
                            👍 {feedback.usability_rating}
                          </span>
                          <span title="Health Impact" className="text-sm">
                            ❤️ {feedback.health_impact_rating}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFeedback(feedback)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant={feedback.status === 'resolved' ? 'default' : 'outline'}
                            className={feedback.status === 'resolved' ? 'bg-green-500' : ''}
                            onClick={() => updateFeedbackStatus(feedback.id, 
                              feedback.status === 'resolved' ? 'pending' : 'resolved')}
                          >
                            {feedback.status === 'resolved' ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                          <span className={`text-sm ${
                            feedback.status === 'resolved' 
                              ? 'text-green-600' 
                              : 'text-gray-500'
                          }`}>
                            {feedback.status === 'resolved' ? 'Resolved' : 'Pending'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFeedback && (
        <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Feedback Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* User Info Section */}
                <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{selectedFeedback.user_name}</h3>
                    <p className="text-sm text-gray-500">{selectedFeedback.user_email}</p>
                    <p className="text-xs text-gray-400">
                      Submitted on {new Date(selectedFeedback.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                      ${selectedFeedback.issue_type === 'bug' ? 'bg-red-100 text-red-700' :
                      selectedFeedback.issue_type === 'feature' ? 'bg-purple-100 text-purple-700' :
                      selectedFeedback.issue_type === 'improvement' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'}`}>
                      {selectedFeedback.issue_type}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                      ${selectedFeedback.status === 'resolved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'}`}>
                      {selectedFeedback.status}
                    </span>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-3 bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {selectedFeedback.description}
                    </p>
                  </div>
                </div>

                {/* Feature Request Section */}
                {selectedFeedback.feature_request && (
                  <div className="space-y-3 bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900">Feature Request</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {selectedFeedback.feature_request}
                      </p>
                    </div>
                  </div>
                )}

                {/* Ratings Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">Usability Rating</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">👍</span>
                      <span className="text-lg font-semibold text-gray-700">
                        {selectedFeedback.usability_rating}/10
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">Health Impact Rating</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">❤️</span>
                      <span className="text-lg font-semibold text-gray-700">
                        {selectedFeedback.health_impact_rating}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Action Button */}
            <div className="flex justify-end pt-4 border-t mt-6">
              <Button
                onClick={() => updateFeedbackStatus(
                  selectedFeedback.id,
                  selectedFeedback.status === 'resolved' ? 'pending' : 'resolved'
                )}
                className={`${selectedFeedback.status === 'resolved'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-500 hover:bg-green-600'
                } text-white px-6`}
              >
                Mark as {selectedFeedback.status === 'resolved' ? 'Pending' : 'Resolved'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}