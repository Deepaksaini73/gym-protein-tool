import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

export function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <User className="w-5 h-5 mr-2 text-emerald-600" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-800 text-lg font-semibold">
              {getInitials(user.user_metadata?.full_name || user.email || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {user.user_metadata?.full_name || 'User'}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Signed in with Google
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">User ID:</span>
            <span className="text-gray-900 font-mono text-xs">{user.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Email Verified:</span>
            <span className={`font-medium ${user.email_confirmed_at ? 'text-green-600' : 'text-red-600'}`}>
              {user.email_confirmed_at ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Sign In:</span>
            <span className="text-gray-900">
              {new Date(user.last_sign_in_at || '').toLocaleDateString()}
            </span>
          </div>
        </div>

        <Button
          onClick={signOut}
          variant="outline"
          className="w-full border-2 border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
} 