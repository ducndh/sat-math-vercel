import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { testId } = params

    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      )
    }

    // Get all result blobs and filter by testId
    const { blobs } = await list({ prefix: 'results/', limit: 1000 })
    const results = []

    // Fetch all results and filter by testId
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const result = await response.json()
        if (result && result.testId === testId) {
          results.push(result)
        }
      } catch (err) {
        console.warn('Failed to parse result blob:', blob.pathname)
      }
    }

    // Sort by submission date (newest first)
    results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

    // Calculate summary statistics
    const totalSubmissions = results.length
    const averageScore = totalSubmissions > 0 
      ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / totalSubmissions)
      : 0

    const highestScore = totalSubmissions > 0 
      ? Math.max(...results.map(r => r.score))
      : 0

    const lowestScore = totalSubmissions > 0 
      ? Math.min(...results.map(r => r.score))
      : 0

    return NextResponse.json({
      testId,
      totalSubmissions,
      averageScore,
      highestScore,
      lowestScore,
      results: results.map(result => ({
        resultId: result.resultId,
        studentId: result.studentId,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        submittedAt: result.submittedAt
      }))
    })
  } catch (error) {
    console.error('Results fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}