import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface PhotoTabProps {
  selectedImage: File | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function PhotoTab({ selectedImage, onImageUpload }: PhotoTabProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Camera className="w-5 h-5 mr-2 text-blue-600" />
          Photo Recognition
        </CardTitle>
        <CardDescription>Upload a photo of your meal for AI analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Upload a photo of your meal</p>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outline"
              className="cursor-pointer border-2 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
            >
              Choose Photo
            </Button>
          </label>
        </div>

        {selectedImage && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Selected: {selectedImage.name}</p>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                🤖 AI Analysis: This feature will use computer vision to identify foods and estimate nutrition
                values
              </p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Analyze Photo</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 