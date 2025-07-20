"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { checkTableExists, listAllProfiles, getUserProfile } from "@/lib/database"
import { useAuth } from "@/contexts/auth-context"

export function DatabaseDebug() {
  const { user } = useAuth()
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true)
    try {
      console.log(`🧪 Running test: ${testName}`)
      const result = await testFn()
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }))
      console.log(`✅ Test ${testName} completed:`, result)
    } catch (error) {
      console.error(`❌ Test ${testName} failed:`, error)
      setResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }))
    } finally {
      setLoading(false)
    }
  }

  const testTableExists = () => runTest('Table Exists', checkTableExists)
  const testListProfiles = () => runTest('List Profiles', listAllProfiles)
  const testGetUserProfile = () => {
    if (!user) {
      alert('Please sign in first')
      return
    }
    runTest('Get User Profile', () => getUserProfile(user.id))
  }

  const testEnvironment = () => {
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    }
    setResults(prev => ({ ...prev, 'Environment Variables': { success: true, data: envVars } }))
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Database Debug Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={testEnvironment} 
              disabled={loading}
              variant="outline"
            >
              Check Environment
            </Button>
            <Button 
              onClick={testTableExists} 
              disabled={loading}
              variant="outline"
            >
              Check Table Exists
            </Button>
            <Button 
              onClick={testListProfiles} 
              disabled={loading}
              variant="outline"
            >
              List All Profiles
            </Button>
            <Button 
              onClick={testGetUserProfile} 
              disabled={loading || !user}
              variant="outline"
            >
              Get User Profile
            </Button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Running test...</p>
            </div>
          )}

          <div className="space-y-2">
            {Object.entries(results).map(([testName, result]: [string, any]) => (
              <Card key={testName} className="text-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{testName}</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.success ? (
                    <div className="space-y-2">
                      <div className="text-green-600 font-medium">✅ Success</div>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-red-600 font-medium">❌ Failed</div>
                      <div className="text-red-500">{result.error}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 