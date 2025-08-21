'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Grid3X3, X } from 'lucide-react'

export default function Navigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onGoToQuestion,
  answers = {},
  markedForReview = [],
  canGoBack = true,
  canGoNext = true
}) {
  const [showQuestionMenu, setShowQuestionMenu] = useState(false)

  const getQuestionStatus = (questionNumber) => {
    const hasAnswer = answers[questionNumber] !== undefined && answers[questionNumber] !== ''
    const isMarked = markedForReview.includes(questionNumber)
    const isCurrent = questionNumber === currentQuestion

    if (isCurrent) return 'current'
    if (isMarked) return 'flagged'
    if (hasAnswer) return 'answered'
    return 'unanswered'
  }

  const getStatusCounts = () => {
    let answered = 0
    let flagged = 0
    let unanswered = 0

    for (let i = 1; i <= totalQuestions; i++) {
      const status = getQuestionStatus(i)
      if (status === 'answered') answered++
      else if (status === 'flagged') flagged++
      else if (status === 'unanswered') unanswered++
    }

    return { answered, flagged, unanswered }
  }

  const statusCounts = getStatusCounts()

  return (
    <>
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={!canGoBack || currentQuestion === 1}
            className="nav-button secondary"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          {/* Question Menu Button */}
          <button
            onClick={() => setShowQuestionMenu(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Grid3X3 className="w-4 h-4" />
            Question {currentQuestion} of {totalQuestions}
          </button>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={!canGoNext || currentQuestion === totalQuestions}
            className="nav-button primary"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Question Menu Modal */}
      {showQuestionMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Question Menu</h3>
              <button
                onClick={() => setShowQuestionMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Status Legend */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Status Legend</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Current ({currentQuestion})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                    <span>Answered ({statusCounts.answered})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 rounded"></div>
                    <span>Flagged ({statusCounts.flagged})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                    <span>Unanswered ({statusCounts.unanswered})</span>
                  </div>
                </div>
              </div>

              {/* Question Grid */}
              <div className="question-grid">
                {Array.from({ length: totalQuestions }, (_, i) => {
                  const questionNumber = i + 1
                  const status = getQuestionStatus(questionNumber)
                  
                  return (
                    <button
                      key={questionNumber}
                      onClick={() => {
                        onGoToQuestion(questionNumber)
                        setShowQuestionMenu(false)
                      }}
                      className={`question-grid-item ${status}`}
                    >
                      {questionNumber}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowQuestionMenu(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}