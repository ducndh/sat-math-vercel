import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get all test keys
    const keys = await kv.keys('test:*')
    const tests = []

    // Fetch all tests
    for (const key of keys) {
      const test = await kv.get(key)
      if (test) {
        tests.push({
          testId: test.testId,
          title: test.title,
          totalQuestions: test.questions?.length || 0,
          createdAt: test.createdAt
        })
      }
    }

    // Sort by creation date (newest first)
    tests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json({
      tests,
      total: tests.length
    })
  } catch (error) {
    console.error('Tests fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}