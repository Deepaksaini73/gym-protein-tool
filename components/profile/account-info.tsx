import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AccountInfoProps {
  joinDate: string
}

export function AccountInfo({ joinDate }: AccountInfoProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-700">Member since:</span>
            <span className="text-sm text-gray-900">{new Date(joinDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-700">Plan:</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              Free
            </Badge>
          </div>
          <Button
            variant="outline"
            className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
          >
            Upgrade to Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 