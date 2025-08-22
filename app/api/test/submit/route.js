import { list, put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const body = await request.json()
    const { testId, studentId, answers } = body

    if (!testId || !studentId || !answers) {
      return NextResponse.json(
        { error: 'testId, studentId, and answers are required' },
        { status: 400 }
      )
    }

    // Fetch the test to get correct answers
    const { blobs } = await list({ prefix: `tests/${testId}.json`, limit: 1 })
    
    if (blobs.length === 0) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    const response = await fetch(blobs[0].url)
    const testData = await response.json()

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = testData.questions.length
    const detailedResults = []

    testData.questions.forEach(question => {
      const studentAnswer = answers[question.id.toString()]
      const isCorrect = studentAnswer === question.answer
      
      if (isCorrect) {
        correctAnswers++
      }

      detailedResults.push({
        questionId: question.id,
        studentAnswer: studentAnswer || 'No answer',
        correctAnswer: question.answer,
        isCorrect
      })
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const resultId = uuidv4()

    const resultData = {
      resultId,
      testId,
      studentId,
      answers,
      score,
      correctAnswers,
      totalQuestions,
      detailedResults,
      submittedAt: new Date().toISOString()
    }

    // Store result in Vercel Blob
    await put(`results/${resultId}.json`, JSON.stringify(resultData), {
      access: 'public',
      contentType: 'application/json',
    })

    return NextResponse.json({
      resultId,
      score,
      correctAnswers,
      totalQuestions,
      percentage: score,
      message: 'Test submitted successfully'
    })
  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit test' },
      { status: 500 }
    )
  }
}