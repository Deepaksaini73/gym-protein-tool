import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Chrome } from "lucide-react"

interface GoogleSignInButtonProps {
  className?: string
  children?: React.ReactNode
}

export function GoogleSignInButton({ className, children }: GoogleSignInButtonProps) {
  const { signInWithGoogle } = useAuth()

  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      className={`w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white ${className}`}
    >
      <Chrome className="w-5 h-5 mr-2" />
      {children || "Continue with Google"}
    </Button>
  )
} 