import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get all test blobs
    const { blobs } = await list({ prefix: 'tests/', limit: 1000 })
    console.log('Blobs found:', blobs); // Added for debugging
    const tests = []

    // Fetch all tests
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const test = await response.json()
        if (test) {
          tests.push({
            testId: test.testId,
            title: test.title,
            totalQuestions: test.questions?.length || 0,
            createdAt: test.createdAt
          })
        }
      } catch (err) {
        console.warn('Failed to parse test blob:', blob.pathname, err) // Added error logging
      }
    }

    // Sort by creation date (newest first)
    tests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    console.log('Returning tests:', tests); // Added for debugging

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