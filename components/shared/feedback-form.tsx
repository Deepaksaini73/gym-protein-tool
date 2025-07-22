import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { submitFeedback } from "@/lib/database"
import { toast } from "sonner"

interface FeedbackFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
  userName: string
  userId: string
}

export function FeedbackForm({ open, onOpenChange, userEmail, userName, userId }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    issue_type: '',
    description: '',
    feature_request: '',
    usability_rating: 5,
    health_impact_rating: 5,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitFeedback({
        user_id: userId,
        user_email: userEmail,
        user_name: userName,
        ...formData,
        issue_type: formData.issue_type as 'bug' | 'feature' | 'improvement' | 'other'
      })

      toast.success('Thank you for your feedback!')
      onOpenChange(false)
      setFormData({
        issue_type: '',
        description: '',
        feature_request: '',
        usability_rating: 5,
        health_impact_rating: 5,
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type of Feedback</Label>
            <Select
              value={formData.issue_type}
              onValueChange={(value) => setFormData({ ...formData, issue_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Report a Bug</SelectItem>
                <SelectItem value="feature">Request a Feature</SelectItem>
                <SelectItem value="improvement">Suggest Improvement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What's on your mind?</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your feedback, issue, or suggestion..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Any specific features you'd like to see?</Label>
            <Textarea
              value={formData.feature_request}
              onChange={(e) => setFormData({ ...formData, feature_request: e.target.value })}
              placeholder="Describe any features you'd like us to add..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>App Usability (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.usability_rating}
                onChange={(e) => setFormData({ ...formData, usability_rating: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Health Impact (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.health_impact_rating}
                onChange={(e) => setFormData({ ...formData, health_impact_rating: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}