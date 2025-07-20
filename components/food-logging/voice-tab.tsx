import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"

interface VoiceTabProps {
  isListening: boolean
  onVoiceInput: () => void
}

export function VoiceTab({ isListening, onVoiceInput }: VoiceTabProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Mic className="w-5 h-5 mr-2 text-red-600" />
          Voice Logging
        </CardTitle>
        <CardDescription>Speak your meal to log it quickly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-6">
          <div
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? "bg-gradient-to-br from-red-100 to-red-200 border-4 border-red-300 animate-pulse"
                : "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
            }`}
          >
            <Mic
              className={`w-16 h-16 transition-all duration-300 ${
                isListening ? "text-red-700 scale-110" : "text-red-600"
              }`}
            />
          </div>

          <Button
            size="lg"
            className={`transition-all duration-300 ${
              isListening ? "bg-red-700 hover:bg-red-800" : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={onVoiceInput}
            disabled={isListening}
          >
            {isListening ? "Listening..." : "Start Recording"}
          </Button>

          <p className="text-sm text-gray-600">
            Say something like: "I had grilled chicken with rice and broccoli"
          </p>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            🎤 Voice recognition will be integrated with speech-to-text API for hands-free logging
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 