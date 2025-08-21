'use client'

import Link from 'next/link'
import { Calculator, FileText, Users, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Rapid SAT Practice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience authentic SAT practice with our Bluebook-style interface. 
            Take practice tests, review your performance, and improve your scores.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Student Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-6">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">For Students</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Take practice tests with the same interface you'll see on test day. 
              Includes interactive calculator, reference sheet, and marking tools.
            </p>
            <div className="space-y-3">
              <Link 
                href="/demo"
                className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Take Demo Test
              </Link>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Have a test link?</p>
                <input 
                  type="text" 
                  placeholder="Enter test ID or URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">For Educators</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Create custom practice tests, upload questions with images, 
              and track student performance with detailed analytics.
            </p>
            <div className="space-y-3">
              <Link 
                href="/admin"
                className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Admin Panel
              </Link>
              <Link 
                href="/admin/create"
                className="block w-full bg-gray-100 text-gray-700 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Create New Test
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Authentic SAT Experience
          </h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Desmos Calculator</h4>
              <p className="text-sm text-gray-600">Same graphing calculator used on the actual SAT</p>
            </div>
            <div className="text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Reference Sheet</h4>
              <p className="text-sm text-gray-600">Access to official SAT Math reference formulas</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">∑</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Math Rendering</h4>
              <p className="text-sm text-gray-600">Perfect mathematical notation with KaTeX</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">⏱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real Timing</h4>
              <p className="text-sm text-gray-600">Authentic test timing and navigation</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500">
          <p>Built with the Vercel ecosystem for maximum performance and reliability</p>
        </div>
      </div>
    </div>
  )
}