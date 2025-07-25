import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Loader2, Volume2, MicOff, CheckCircle } from "lucide-react"

interface VoiceTabProps {
  isListening: boolean
  isLoading: boolean
  transcript?: string
  onStart: () => void
  onStop: () => void
}

export function VoiceTab({
  isListening,
  isLoading,
  transcript = "",
  onStart,
  onStop,
}: VoiceTabProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Volume2 className="w-5 h-5 mr-2 text-red-600" />
          Voice Input
        </CardTitle>
        <CardDescription>
          {isListening
            ? "🎤 Listening... speak clearly!"
            : isLoading
            ? "🔄 Processing your voice..."
            : transcript
            ? "✅ Voice captured! Opening quantity dialog..."
            : "Speak what you ate and let AI handle the rest"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          {/* Microphone Visual */}
          <div
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? "bg-gradient-to-br from-red-100 to-red-200 border-4 border-red-300 animate-pulse shadow-lg"
                : isLoading
                ? "bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300"
                : transcript
                ? "bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300"
                : "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            ) : transcript ? (
              <CheckCircle className="w-16 h-16 text-green-600" />
            ) : (
              <Mic
                className={`w-16 h-16 transition-all duration-300 ${
                  isListening ? "text-red-700 scale-110" : "text-red-600"
                }`}
              />
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="w-full p-4 bg-green-50 rounded-lg border-2 border-green-200 min-h-[60px] animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700 font-medium">You said:</p>
              </div>
              <p className="text-lg font-semibold text-green-900">"{transcript}"</p>
              <p className="text-sm text-green-600 mt-2">
                Opening quantity dialog in a moment...
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="w-full flex flex-col items-center gap-4">
            {!isListening && !isLoading && !transcript && (
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white w-48 text-lg font-semibold py-4 rounded-xl shadow-lg"
                onClick={onStart}
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isListening && (
              <Button
                size="lg"
                className="bg-red-700 hover:bg-red-800 text-white w-48 text-lg font-semibold py-4 rounded-xl shadow-lg animate-pulse"
                onClick={onStop}
              >
                <MicOff className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}

            {isLoading && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-blue-700 font-medium text-lg">
                    Processing your voice...
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Converting speech to text...
                </p>
              </div>
            )}

            {transcript && !isLoading && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-700 font-medium text-lg">
                    Voice captured successfully!
                  </span>
                </div>
                <p className="text-sm text-green-600">
                  Opening quantity dialog...
                </p>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {isListening && (
            <div className="w-full bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">
                  🎤 Recording... Speak clearly!
                </span>
              </div>
            </div>
          )}

          {/* Usage Examples */}
          {!isListening && !isLoading && !transcript && (
            <div className="w-full bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="font-medium text-red-800 mb-3">Example commands:</h4>
              <ul className="text-sm text-red-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"I ate two slices of pizza"</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"One cup of rice with chicken"</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"A banana and some yogurt"</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"200 grams grilled chicken breast"</span>
                </li>
              </ul>
            </div>
          )}

          {/* Browser Support Note */}
          {!transcript && (
            <div className="text-center">
              <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium">
                📱 Voice input works best in Chrome, Safari, or Edge browser
              </span>
            </div>
          )}

          {/* Microphone Permission Tip */}
          {!transcript && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                💡 Make sure to allow microphone access when prompted
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceTab