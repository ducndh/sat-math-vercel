'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QuestionViewer from '../../../components/QuestionViewer'
import Timer from '../../../components/Timer'
import Toolbar from '../../../components/Toolbar'
import Navigation from '../../../components/Navigation'
import { v4 as uuidv4 } from 'uuid'

export default function TestPage({ params }) {
  const router = useRouter()
  const { testId } = params
  
  const [testData, setTestData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState([])
  const [eliminatedOptions, setEliminatedOptions] = useState({})
  const [studentId] = useState(() => uuidv4())
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchTest() {
      try {
        const response = await fetch(`/api/test/${testId}`)
        if (!response.ok) {
          throw new Error('Test not found')
        }
        const data = await response.json()
        setTestData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (testId) {
      fetchTest()
    }
  }, [testId])

  const currentQuestion = testData?.questions[currentQuestionIndex]
  const currentQuestionNumber = currentQuestionIndex + 1

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  const handleToggleMarkForReview = () => {
    const questionId = currentQuestion.id
    setMarkedForReview(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const handleToggleEliminate = (option) => {
    const questionId = currentQuestion.id
    setEliminatedOptions(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.includes(option)
        ? prev[questionId].filter(opt => opt !== option)
        : [...(prev[questionId] || []), option]
    }))
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleGoToQuestion = (questionNumber) => {
    setCurrentQuestionIndex(questionNumber - 1)
  }

  const handleTimeUp = () => {
    handleSubmitTest()
  }

  const handleSubmitTest = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId,
          studentId,
          answers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit test')
      }

      const result = await response.json()
      
      // Redirect to results page
      router.push(`/results/${result.resultId}`)
    } catch (err) {
      console.error('Submission error:', err)
      alert('Failed to submit test. Please try again.')
    } finally {
      setIsSubmitting(false)
      setShowSubmitConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
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
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{testData.title}</h1>
            <p className="text-sm text-gray-600">Section 2, Module 2: Math</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Toolbar />
            <Timer 
              initialMinutes={70}
              onTimeUp={handleTimeUp}
              isActive={true}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        <QuestionViewer
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion?.id]}
          onAnswerSelect={handleAnswerSelect}
          isMarkedForReview={markedForReview.includes(currentQuestion?.id)}
          onToggleMarkForReview={handleToggleMarkForReview}
          eliminatedOptions={eliminatedOptions[currentQuestion?.id] || []}
          onToggleEliminate={handleToggleEliminate}
        />
      </main>

      {/* Navigation */}
      <Navigation
        currentQuestion={currentQuestionNumber}
        totalQuestions={testData.totalQuestions}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onGoToQuestion={handleGoToQuestion}
        answers={answers}
        markedForReview={markedForReview}
      />

      {/* Submit Button (visible on last question) */}
      {currentQuestionIndex === testData.questions.length - 1 && (
        <div className="bg-white border-t border-gray-200 p-4 text-center">
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Submit Test
          </button>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Submit Test?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your test? You cannot change your answers after submission.
              </p>
              
              <div className="mb-4 text-sm text-gray-600">
                <p>Questions answered: {Object.keys(answers).length} of {testData.totalQuestions}</p>
                <p>Questions marked for review: {markedForReview.length}</p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}