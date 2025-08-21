'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Home } from 'lucide-react'

export default function ResultsPage({ params }) {
  const router = useRouter()
  const { resultId } = params
  
  const [resultData, setResultData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(`/api/result/${resultId}`)
        if (!response.ok) {
          throw new Error('Result not found')
        }
        const data = await response.json()
        setResultData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (resultId) {
      fetchResult()
    }
  }, [resultId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200'
    if (score >= 70) return 'bg-blue-50 border-blue-200'
    if (score >= 50) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
          <p className="text-gray-600">Your SAT Math practice test performance</p>
        </div>

        {/* Score Summary */}
        <div className={`max-w-2xl mx-auto rounded-2xl border-2 p-8 mb-8 ${getScoreBgColor(resultData.score)}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(resultData.score)}`}>
              {resultData.score}%
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-2">
              {resultData.correctAnswers} out of {resultData.totalQuestions} correct
            </div>
            <div className="text-gray-600">
              Submitted on {new Date(resultData.submittedAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question-by-Question Breakdown</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700">
              <div>Question</div>
              <div>Your Answer</div>
              <div>Correct Answer</div>
              <div>Result</div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {resultData.detailedResults?.map((result, index) => (
                <div key={result.questionId} className="grid grid-cols-4 gap-4 p-4 items-center">
                  <div className="font-medium">
                    Question {result.questionId}
                  </div>
                  <div className={`font-mono ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {result.studentAnswer || 'No answer'}
                  </div>
                  <div className="font-mono text-green-600">
                    {result.correctAnswer}
                  </div>
                  <div className="flex items-center">
                    {result.isCorrect ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Correct
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="w-5 h-5 mr-2" />
                        Incorrect
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Share your result ID with your teacher: <code className="bg-gray-200 px-2 py-1 rounded">{resultId}</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}