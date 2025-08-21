import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, questions } = body

    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Title and questions array are required' },
        { status: 400 }
      )
    }

    // Validate questions structure
    for (const question of questions) {
      if (!question.id || !question.text || !question.options || !question.answer) {
        return NextResponse.json(
          { error: 'Each question must have id, text, options, and answer' },
          { status: 400 }
        )
      }
    }

    const testId = uuidv4()
    const testData = {
      testId,
      title,
      questions,
      createdAt: new Date().toISOString(),
    }

    // Store test in Vercel KV
    await kv.set(`test:${testId}`, testData)

    const baseUrl = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const shareableUrl = `${protocol}://${baseUrl}/test/${testId}`

    return NextResponse.json({
      testId,
      shareableUrl,
      message: 'Test created successfully'
    })
  } catch (error) {
    console.error('Test creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    )
  }
}