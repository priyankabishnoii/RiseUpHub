import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Default redirect to dashboard after login
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    // ADDED: 'await' is now required for cookies() in newer Next.js versions
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful login, redirect to the dashboard with the cookie set!
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there is an error, send them back to login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}