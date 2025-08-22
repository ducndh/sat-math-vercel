import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { resultId } = params

    if (!resultId) {
      return NextResponse.json(
        { error: 'Result ID is required' },
        { status: 400 }
      )
    }

    // Fetch result from Vercel Blob
    const { blobs } = await list({ prefix: `results/${resultId}.json`, limit: 1 })
    
    if (blobs.length === 0) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      )
    }

    const response = await fetch(blobs[0].url)
    const resultData = await response.json()

    return NextResponse.json(resultData)
  } catch (error) {
    console.error('Result fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch result' },
      { status: 500 }
    )
  }
}