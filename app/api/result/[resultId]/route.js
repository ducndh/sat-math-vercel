import { kv } from '@vercel/kv'
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

    const resultData = await kv.get(`result:${resultId}`)

    if (!resultData) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resultData)
  } catch (error) {
    console.error('Result fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch result' },
      { status: 500 }
    )
  }
}