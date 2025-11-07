import { NextResponse } from 'next/server'
import { keepAlive, fetchOtherProjects } from './helper'
import { KEEP_ALIVE_CONFIG } from '@/config/keep-alive-config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Keep this project alive
    const result = await keepAlive()

    // Keep other projects alive (if configured)
    let otherProjectsResults = []
    if (KEEP_ALIVE_CONFIG.otherProjects.length > 0) {
      otherProjectsResults = await fetchOtherProjects(
        KEEP_ALIVE_CONFIG.otherProjects
      )
    }

    return NextResponse.json(
      {
        success: result.success,
        timestamp: new Date().toISOString(),
        mainProject: result,
        otherProjects: otherProjectsResults,
      },
      {
        status: result.success ? 200 : 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Keep-alive route error:', error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
