import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface PhotoTabProps {
  selectedImage: File | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function PhotoTab({ selectedImage, onImageUpload }: PhotoTabProps) {
  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="w-full p-3 rounded-lg border border-gray-300"
      />
      {selectedImage && (
        <div className="flex justify-center">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Food preview"
            className="max-w-[200px] max-h-[200px] rounded-lg object-cover border border-gray-200 shadow"
          />
        </div>
      )}
    </div>
  )
}