'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QuestionViewer from '../../components/QuestionViewer'
import Timer from '../../components/Timer'
import Toolbar from '../../components/Toolbar'
import Navigation from '../../components/Navigation'
import { v4 as uuidv4 } from 'uuid'

export default function DemoTestPage() {
  const router = useRouter()
  
  // Demo test data from the provided SAT test
  const demoTestData = {
    testId: 'demo',
    title: 'SAT Math Practice Demo',
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        text: 'The graph shows the linear relationship between x and y. Which table gives three values of x and their corresponding values of y for this relationship?',
        options: [
          'x: -1, y: 1; x: 0, y: 0; x: 1, y: 5',
          'x: -1, y: 1; x: 0, y: 3; x: 1, y: 5',
          'x: -1, y: 1; x: 0, y: 5; x: 1, y: 5',
          'x: -1, y: 1; x: 0, y: 0; x: 1, y: 1'
        ],
        answer: 'B'
      },
      {
        id: 2,
        text: 'If $6x + 36 = 54$, what is the value of $x + 6$?',
        options: ['6', '9', '36', '42'],
        answer: 'B'
      },
      {
        id: 3,
        text: 'For a certain classification, the positive mass $m$, in grams, of an object must be less than 510 grams. Which inequality represents this situation?',
        options: ['$m > 510$', '$m < 0$', '$-510 < m < 0$', '$0 < m < 510$'],
        answer: 'D'
      },
      {
        id: 4,
        text: 'The perimeter of an obtuse triangle is 27 meters. The lengths of two sides of this triangle are 5 meters and 9 meters. What is the length, in meters, of the third side of this triangle?',
        options: ['13', '14', '18', '22'],
        answer: 'A'
      },
      {
        id: 5,
        text: 'Which expression is equivalent to $(5x^3 - 3x + 8) - (9x^6 + 5x - 3)$?',
        options: [
          '$-4x^9 - 8x - 11$',
          '$-9x^6 + 5x^3 - 8x + 11$',
          '$-9x^6 + 5x^3 + 2x + 5$',
          '$-4x^9 - 2x + 5$'
        ],
        answer: 'B'
      },
      {
        id: 6,
        text: 'The function $f(x) = 180(x - 2)$ gives the sum of the interior angles, in degrees, for a polygon with $x$ sides. What is the sum of the interior angles, in degrees, for a polygon with 35 sides?',
        type: 'short-answer',
        answer: '5940'
      },
      {
        id: 7,
        text: '$f(x) = 3(x - 1)(x - 8)(x - 11)$. If the given function $f$ is graphed in the xy-plane, where $y = f(x)$, what is the x-coordinate of an x-intercept of the graph?',
        type: 'short-answer',
        answer: '1' // Any of 1, 8, or 11 would be correct
      },
      {
        id: 8,
        text: '$x + 4y = 19$ and $2x + y = 4$. The solution to the given system of equations is $(x, y)$. What is the value of $3x + 5y$?',
        options: ['12', '15', '23', '38'],
        answer: 'C'
      },
      {
        id: 9,
        text: 'In triangle DEF, the measure of angle D is 47° and the measure of angle E is 97°. In triangle RST, the measure of angle R is 47° and the measure of angle S is 97°. Which of the following additional pieces of information is needed to determine whether triangle DEF is similar to triangle RST?',
        options: [
          'The measure of angle F',
          'The measure of angle T',
          'The measure of angle F and the measure of angle T',
          'No additional information is needed.'
        ],
        answer: 'D'
      },
      {
        id: 10,
        text: 'A circle has center Q, and points A and B lie on the circle. The measure of arc AB is 60°, and the length of this arc is 4 inches. What is the circumference, in inches, of the circle?',
        options: ['4', '8', '16', '24'],
        answer: 'D'
      }
    ]
  }
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState([])
  const [eliminatedOptions, setEliminatedOptions] = useState({})
  const [studentId] = useState(() => uuidv4())
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = demoTestData.questions[currentQuestionIndex]
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
    if (currentQuestionIndex < demoTestData.questions.length - 1) {
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
    
    // For demo, just calculate score locally and redirect
    let correctAnswers = 0
    const totalQuestions = demoTestData.questions.length

    demoTestData.questions.forEach(question => {
      const studentAnswer = answers[question.id.toString()]
      if (studentAnswer === question.answer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)
    
    // Redirect to a demo results page with score in URL
    router.push(`/demo/results?score=${score}&correct=${correctAnswers}&total=${totalQuestions}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{demoTestData.title}</h1>
            <p className="text-sm text-gray-600">Section 2, Module 2: Math (Demo)</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Toolbar />
            <Timer 
              initialMinutes={25} // Shorter demo time
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
        totalQuestions={demoTestData.totalQuestions}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onGoToQuestion={handleGoToQuestion}
        answers={answers}
        markedForReview={markedForReview}
      />

      {/* Submit Button (visible on last question) */}
      {currentQuestionIndex === demoTestData.questions.length - 1 && (
        <div className="bg-white border-t border-gray-200 p-4 text-center">
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Submit Demo Test
          </button>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Submit Demo Test?</h3>
              <p className="text-gray-600 mb-6">
                This is a demo test. Your results won't be saved, but you'll see how the scoring works.
              </p>
              
              <div className="mb-4 text-sm text-gray-600">
                <p>Questions answered: {Object.keys(answers).length} of {demoTestData.totalQuestions}</p>
                <p>Questions marked for review: {markedForReview.length}</p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}