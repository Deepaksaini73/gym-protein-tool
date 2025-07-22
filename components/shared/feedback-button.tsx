import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"

export function FeedbackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-4 shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
    >
      <MessageSquarePlus className="w-5 h-5 mr-2" />
      Feedback
    </Button>
  )
}