import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Get site URL from environment variable or request origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  if (code) {
    const supabase = createRouteHandlerClient({ 
      cookies,
      options: {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to home page using site URL
  return NextResponse.redirect(`${siteUrl}/`)
}