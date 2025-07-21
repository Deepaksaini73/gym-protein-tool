import { Button } from "@/components/ui/button"
import { Mic, Loader2 } from "lucide-react"

interface VoiceTabProps {
  isListening: boolean
  isLoading: boolean
  onStart: () => void
  onStop: () => void
}

export function VoiceTab({ isListening, isLoading, onStart, onStop }: VoiceTabProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
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
      <div className="mt-8 w-full flex flex-col items-center gap-4">
        {!isListening && !isLoading && (
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white w-48 text-lg font-semibold"
            onClick={onStart}
          >
            Start Recording
          </Button>
        )}
        {isListening && (
          <Button
            size="lg"
            className="bg-red-700 hover:bg-red-800 text-white w-48 text-lg font-semibold"
            onClick={onStop}
          >
            Stop Recording
          </Button>
        )}
        {isLoading && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-emerald-700 font-medium">Processing your voice...</span>
          </div>
        )}
      </div>
      {/* Instruction for browser support */}
      <div className="mt-6 text-center">
        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium">
          Voice input works in Chrome browser.
        </span>
      </div>
    </div>
  )
}