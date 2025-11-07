import { createClient } from '@supabase/supabase-js'

/**
 * Makes a simple database call to keep Supabase project active
 */
export async function keepAlive() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Simple query to the keep-alive table
    const { data, error } = await supabase
      .from('keep-alive')
      .select('id, name')
      .limit(1)
      .single()

    if (error) {
      console.error('Keep-alive query error:', error)
      return { success: false, error: error.message }
    }

    console.log('Keep-alive successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Keep-alive error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Optional: Insert a record with timestamp to track keep-alive calls
 */
export async function keepAliveWithInsert() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('keep-alive')
      .insert({
        name: `keep-alive-${new Date().toISOString()}`,
      })
      .select()
      .single()

    if (error) {
      console.error('Keep-alive insert error:', error)
      return { success: false, error: error.message }
    }

    console.log('Keep-alive insert successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Keep-alive insert error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Optional: Fetch other project endpoints to keep them alive
 */
export async function fetchOtherProjects(projectUrls: string[]) {
  const results = await Promise.allSettled(
    projectUrls.map(async (url) => {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
      return { url, status: response.status, ok: response.ok }
    })
  )

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    return { url: projectUrls[index], error: result.reason }
  })
}
