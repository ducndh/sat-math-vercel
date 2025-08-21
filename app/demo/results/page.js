'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Home, PlayCircle } from 'lucide-react'

export default function DemoResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const score = parseInt(searchParams.get('score')) || 0
  const correct = parseInt(searchParams.get('correct')) || 0
  const total = parseInt(searchParams.get('total')) || 10

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

  const getPerformanceMessage = (score) => {
    if (score >= 90) return 'Excellent work! You have a strong grasp of SAT Math concepts.'
    if (score >= 70) return 'Good job! With some practice, you can achieve even higher scores.'
    if (score >= 50) return 'Not bad! Focus on reviewing the concepts you missed.'
    return 'Keep practicing! Regular study will help improve your performance.'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Test Results</h1>
          <p className="text-gray-600">Your SAT Math practice test performance</p>
        </div>

        {/* Score Summary */}
        <div className={`max-w-2xl mx-auto rounded-2xl border-2 p-8 mb-8 ${getScoreBgColor(score)}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
              {score}%
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-2">
              {correct} out of {total} correct
            </div>
            <div className="text-gray-600 mb-4">
              {getPerformanceMessage(score)}
            </div>
            <div className="text-sm text-gray-500">
              This was a demo test - results are not saved
            </div>
          </div>
        </div>

        {/* Demo Features Highlight */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            You experienced these SAT Bluebook features:
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">∑</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mathematical Rendering</h3>
                <p className="text-sm text-gray-600">Perfect LaTeX mathematical notation just like the real SAT</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <PlayCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Tools</h3>
                <p className="text-sm text-gray-600">Desmos calculator and reference sheet access</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mark & Eliminate</h3>
                <p className="text-sm text-gray-600">Flag questions for review and eliminate wrong answers</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold">⏱</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Authentic Timing</h3>
                <p className="text-sm text-gray-600">Real test timing with show/hide timer options</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">📊</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Question Navigation</h3>
                <p className="text-sm text-gray-600">Grid view of all questions with status indicators</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">📝</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mixed Question Types</h3>
                <p className="text-sm text-gray-600">Both multiple choice and student-produced responses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Ready for the Real Thing?</h3>
            <p className="text-blue-800 mb-4">
              Create custom practice tests with your own questions, upload images, and track detailed student performance.
            </p>
            <Link 
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Custom Tests
            </Link>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mr-4"
            >
              <PlayCircle className="w-5 h-5" />
              Try Demo Again
            </Link>
            
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>This demo showcases the complete Bluebook SAT experience.</p>
            <p>All features work exactly like the official digital SAT.</p>
          </div>
        </div>
      </div>
    </div>
  )
}