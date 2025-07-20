import { Button } from "@/components/ui/button"
import { Settings, Save } from "lucide-react"

interface ProfileHeaderProps {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
}

export function ProfileHeader({ isEditing, onEdit, onSave }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your information</p>
      </div>
      {isEditing ? (
        <Button onClick={onSave} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      ) : (
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}
    </div>
  )
} 