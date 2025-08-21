'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FileText, Users, BarChart3, Calendar, ExternalLink } from 'lucide-react'

export default function AdminDashboard() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await fetch('/api/admin/tests')
        if (response.ok) {
          const data = await response.json()
          setTests(data.tests)
        }
      } catch (error) {
        console.error('Failed to fetch tests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage SAT practice tests and view student results</p>
            </div>
            <Link 
              href="/admin/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Test
            </Link>
          </div>
          
          <nav className="flex gap-4">
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/create"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              Create Test
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              Student View
            </Link>
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{tests.filter(test => {
                  const created = new Date(test.createdAt)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                }).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tests</h2>
          </div>
          
          {tests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tests created yet</h3>
              <p className="text-gray-500 mb-4">Create your first SAT practice test to get started.</p>
              <Link 
                href="/admin/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Test
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tests.map((test) => (
                    <tr key={test.testId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{test.title}</div>
                        <div className="text-sm text-gray-500">ID: {test.testId}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {test.totalQuestions} questions
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(test.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Link 
                          href={`/test/${test.testId}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          target="_blank"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Preview
                        </Link>
                        <Link 
                          href={`/admin/results/${test.testId}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <BarChart3 className="w-3 h-3" />
                          Results
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Start Guide</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Upload a text file with structured questions</li>
              <li>• Include images for diagram-based questions</li>
              <li>• Share the generated link with students</li>
              <li>• Monitor results in real-time</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Test Format</h3>
            <div className="text-green-700 text-sm">
              <p className="mb-2">Use this format in your text file:</p>
              <code className="block bg-green-100 p-2 rounded text-xs">
                [Q1]<br/>
                Question text here<br/>
                IMG: image.png<br/>
                A) Option 1<br/>
                B) Option 2<br/>
                C) Option 3<br/>
                D) Option 4<br/>
                ANS: B
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}