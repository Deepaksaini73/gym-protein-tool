import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Loader2, Upload } from "lucide-react"

interface PhotoTabProps {
  selectedImage: File | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onAnalyzePhoto: () => void
  loading: boolean
}

export function PhotoTab({ selectedImage, onImageUpload, onAnalyzePhoto, loading }: PhotoTabProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Camera className="w-5 h-5 mr-2 text-blue-600" />
          Photo Recognition
        </CardTitle>
        <CardDescription>Take or upload a photo of your food for AI analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
            </label>
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="space-y-3">
              <div className="flex justify-center">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Food preview"
                  className="max-w-[200px] max-h-[200px] rounded-lg object-cover border border-gray-200 shadow"
                />
              </div>
              <Button
                onClick={onAnalyzePhoto}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Photo...
                  </div>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Analyze Food
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg border border-blue-100">
            💡 <strong>Tip:</strong> Make sure the food is clearly visible and well-lit for better AI recognition
          </div>
        </div>
      </CardContent>
    </Card>
  )
}