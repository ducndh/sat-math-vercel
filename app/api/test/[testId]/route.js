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

    // Fetch test data from Vercel Blob
    try {
      const { blobs } = await list({ prefix: `tests/${testId}.json`, limit: 1 })
      
      if (blobs.length === 0) {
        return NextResponse.json(
          { error: 'Test not found' },
          { status: 404 }
        )
      }

      const response = await fetch(blobs[0].url)
      const testData = await response.json()
      
      if (!testData) {
        return NextResponse.json(
          { error: 'Test not found' },
          { status: 404 }
        )
      }

      // Return test data without sensitive information
      const { questions, ...publicTestData } = testData
      
      // Remove correct answers from questions for student view
      const questionsForStudent = questions.map(question => {
        const { answer, ...questionWithoutAnswer } = question
        return questionWithoutAnswer
      })

      return NextResponse.json({
        ...publicTestData,
        questions: questionsForStudent,
        totalQuestions: questions.length
      })
    } catch (blobError) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Test fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test' },
      { status: 500 }
    )
  }
}