import { Button } from "@/components/ui/button"
import { Camera, Loader2 } from "lucide-react"

interface PhotoTabProps {
  selectedImage: File | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onAddPhoto: () => void
  loading: boolean
}

export function PhotoTab({ selectedImage, onImageUpload, onAddPhoto, loading }: PhotoTabProps) {
  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="w-full p-3 rounded-lg border border-gray-300"
      />
      {selectedImage && (
        <div className="flex flex-col items-center space-y-2">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Food preview"
            className="max-w-[200px] max-h-[200px] rounded-lg object-cover border border-gray-200 shadow"
          />
          <Button
            onClick={onAddPhoto}
            disabled={loading}
            className="mt-2 w-32 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto text-white" /> : "Add"}
          </Button>
        </div>
      )}
    </div>
  )
}