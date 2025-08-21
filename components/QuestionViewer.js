'use client'

import { useState } from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import { Flag, X } from 'lucide-react'
import Image from 'next/image'

export default function QuestionViewer({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  isMarkedForReview, 
  onToggleMarkForReview,
  eliminatedOptions = [],
  onToggleEliminate
}) {
  const renderMathText = (text) => {
    if (!text) return ''
    
    // Split text by LaTeX expressions (both inline $...$ and display $$...$$)
    const parts = []
    let current = 0
    
    // First handle display math $$...$$
    const displayMathRegex = /\$\$([^$]+)\$\$/g
    let match
    
    while ((match = displayMathRegex.exec(text)) !== null) {
      // Add text before the math
      if (match.index > current) {
        const beforeText = text.slice(current, match.index)
        parts.push(renderInlineMath(beforeText))
      }
      
      // Add the display math
      parts.push(
        <BlockMath key={`display-${match.index}`} math={match[1].trim()} />
      )
      
      current = match.index + match[0].length
    }
    
    // Add remaining text
    if (current < text.length) {
      parts.push(renderInlineMath(text.slice(current)))
    }
    
    return parts.length > 0 ? parts : renderInlineMath(text)
  }
  
  const renderInlineMath = (text) => {
    if (!text) return ''
    
    const parts = []
    const inlineMathRegex = /\$([^$]+)\$/g
    let current = 0
    let match
    
    while ((match = inlineMathRegex.exec(text)) !== null) {
      // Add text before the math
      if (match.index > current) {
        parts.push(text.slice(current, match.index))
      }
      
      // Add the inline math
      parts.push(
        <InlineMath key={`inline-${match.index}`} math={match[1].trim()} />
      )
      
      current = match.index + match[0].length
    }
    
    // Add remaining text
    if (current < text.length) {
      parts.push(text.slice(current))
    }
    
    return parts.length > 1 ? parts : text
  }

  return (
    <div className="flex-1 p-6 bg-white">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Question {question.id}
        </h2>
        <button
          onClick={onToggleMarkForReview}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            isMarkedForReview 
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Flag className="w-4 h-4" />
          {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
        </button>
      </div>

      {/* Question Text */}
      <div className="question-text mb-6 text-gray-800 leading-relaxed">
        {renderMathText(question.text)}
      </div>

      {/* Question Image */}
      {question.imageUrl && (
        <div className="mb-6 text-center">
          <Image 
            src={question.imageUrl} 
            alt={`Question ${question.id} diagram`}
            width={600}
            height={400}
            className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
          />
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
          const isSelected = selectedAnswer === optionLetter
          const isEliminated = eliminatedOptions.includes(optionLetter)
          
          return (
            <div key={optionLetter} className="relative">
              <button
                onClick={() => onAnswerSelect(optionLetter)}
                className={`option-button ${isSelected ? 'selected' : ''} ${isEliminated ? 'eliminated' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-600'
                  }`}>
                    {optionLetter}
                  </div>
                  <span className={`option-text flex-1 ${isEliminated ? 'line-through opacity-50' : ''}`}>
                    {renderMathText(option)}
                  </span>
                </div>
              </button>
              
              {/* Eliminate Button */}
              <button
                onClick={() => onToggleEliminate(optionLetter)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  isEliminated
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title={isEliminated ? 'Restore option' : 'Eliminate option'}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Student-produced Response (for short answer questions) */}
      {question.type === 'short-answer' && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student-produced response
          </label>
          <input
            type="text"
            value={selectedAnswer || ''}
            onChange={(e) => onAnswerSelect(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono"
            placeholder="Answer"
            maxLength={6}
          />
          <div className="mt-2 text-xs text-gray-500">
            <p>• Enter positive answers only</p>
            <p>• Fractions can be entered as decimals</p>
            <p>• Don't include symbols like %, $, or commas</p>
          </div>
        </div>
      )}
    </div>
  )
}