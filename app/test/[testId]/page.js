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
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
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

  // Derived state for current section, module, and questions
  const currentSection = testData?.sections[currentSectionIndex]
  const currentModule = currentSection?.modules[currentModuleIndex]
  const currentQuestions = currentModule?.questions || []
  const currentQuestion = currentQuestions[currentQuestionIndex]

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
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleGoToQuestion = (questionNumber) => {
    setCurrentQuestionIndex(questionNumber - 1)
  }

  const handleModuleEnd = () => {
    if (currentModuleIndex < currentSection.modules.length - 1) {
      // Move to the next module in the same section
      setCurrentModuleIndex(currentModuleIndex + 1)
      setCurrentQuestionIndex(0)
    } else if (currentSectionIndex < testData.sections.length - 1) {
      // Move to the next section
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentModuleIndex(0)
      setCurrentQuestionIndex(0)
    } else {
      // End of test
      setShowSubmitConfirm(true)
    }
  }

  const handleTimeUp = () => {
    handleModuleEnd()
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{testData.title}</h1>
            <p className="text-sm text-gray-600">
              {currentSection?.name} - Module {currentModule?.moduleNumber}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Toolbar />
            <Timer 
              key={`${currentSectionIndex}-${currentModuleIndex}`}
              initialMinutes={currentModule?.timeLimit || 35} 
              onTimeUp={handleTimeUp}
              isActive={true}
            />
          </div>
        </div>
      </header>

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

      <Navigation
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={currentQuestions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onGoToQuestion={handleGoToQuestion}
        answers={answers}
        markedForReview={markedForReview}
      />

      {currentQuestionIndex === currentQuestions.length - 1 && (
        <div className="bg-white border-t border-gray-200 p-4 text-center">
          <button
            onClick={handleModuleEnd}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {currentSectionIndex === testData.sections.length - 1 && currentModuleIndex === currentSection.modules.length - 1
              ? 'Finish Test'
              : 'Next Module'}
          </button>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Submit Test?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your test? You cannot change your answers after submission.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
