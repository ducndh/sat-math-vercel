'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, FileText, Image, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { upload } from '@vercel/blob/client'
import { EnhancedSATParser } from '../../../utils/enhanced-parser'

export default function CreateTestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Upload, 2: Processing, 3: Success
  const [testTitle, setTestTitle] = useState('')
  const [textFile, setTextFile] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [createdTest, setCreatedTest] = useState(null)
  const [imageRequirements, setImageRequirements] = useState([])

  const parseTestFile = (content) => {
    try {
      const parser = new EnhancedSATParser()
      const parsedData = parser.parseTestFile(content, testTitle)
      const questions = parser.convertToLegacyFormat(parsedData)
      
      // Store image requirements for display
      setImageRequirements(parser.generateImageRequirementsList(parsedData))
      
      return questions
    } catch (error) {
      console.error('Enhanced parser error:', error)
      // Fallback to original parser for backward compatibility
      return parseTestFileOriginal(content)
    }
  }

  const parseTestFileOriginal = (content) => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line)
    const questions = []
    let currentQuestion = null
    
    for (const line of lines) {
      if (line.startsWith('[Q') && line.endsWith(']')) {
        // Save previous question
        if (currentQuestion) {
          questions.push(currentQuestion)
        }
        
        // Start new question
        const questionId = parseInt(line.match(/\[Q(\d+)\]/)?.[1])
        currentQuestion = {
          id: questionId,
          text: '',
          imageUrl: '',
          options: [],
          answer: ''
        }
      } else if (line.startsWith('IMG:')) {
        if (currentQuestion) {
          currentQuestion.imageName = line.replace('IMG:', '').trim()
        }
      } else if (line.startsWith('ANS:')) {
        if (currentQuestion) {
          currentQuestion.answer = line.replace('ANS:', '').trim()
        }
      } else if (line.match(/^[A-D]\)/)) {
        if (currentQuestion) {
          currentQuestion.options.push(line.substring(2).trim())
        }
      } else if (currentQuestion && !line.startsWith('[') && currentQuestion.options.length === 0) {
        // This is question text
        currentQuestion.text += (currentQuestion.text ? ' ' : '') + line
      }
    }
    
    // Don't forget the last question
    if (currentQuestion) {
      questions.push(currentQuestion)
    }
    
    return questions
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsUploading(true)
    setStep(2)
    
    try {
      // Step 1: Read and parse the text file
      if (!textFile) {
        throw new Error('Please select a text file')
      }
      
      const textContent = await textFile.text()
      const questions = parseTestFile(textContent)
      
      if (questions.length === 0) {
        throw new Error('No valid questions found in the text file')
      }
      
      setUploadProgress(20)
      
      // Step 2: Upload images
      const imageMap = {}
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          
          try {
            const blob = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/admin/create-upload-token',
            })
            
            imageMap[file.name] = blob.url
            setUploadProgress(20 + (60 * (i + 1)) / imageFiles.length)
          } catch (uploadError) {
            console.error(`Failed to upload ${file.name}:`, uploadError)
            // Continue with other files, but note the error
          }
        }
      }
      
      setUploadProgress(80)
      
      // Step 3: Map images to questions and create test
      const processedQuestions = questions.map(question => {
        if (question.imageName && imageMap[question.imageName]) {
          question.imageUrl = imageMap[question.imageName]
        }
        delete question.imageName // Remove temporary field
        return question
      })
      
      // Step 4: Create the test
      const response = await fetch('/api/admin/create-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: testTitle,
          questions: processedQuestions
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create test')
      }
      
      const result = await response.json()
      setUploadProgress(100)
      setCreatedTest(result)
      setStep(3)
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message)
      setStep(1)
    } finally {
      setIsUploading(false)
    }
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Test...</h2>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm">{uploadProgress}% complete</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full mx-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Created Successfully!</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Share this link with students:</p>
              <div className="bg-white border border-gray-300 rounded p-3 mb-3">
                <code className="text-sm break-all">{createdTest.shareableUrl}</code>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(createdTest.shareableUrl)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy to clipboard
              </button>
            </div>

            <div className="space-y-3">
              <Link 
                href={`/admin/results/${createdTest.testId}`}
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Results Dashboard
              </Link>
              <Link 
                href={createdTest.shareableUrl}
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                target="_blank"
              >
                Preview Test
              </Link>
              <Link 
                href="/admin"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Test</h1>
          <p className="text-gray-600">Upload a structured text file and images to create a SAT practice test</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">File Format Instructions</h3>
            <div className="text-blue-800 text-sm space-y-2">
              <p><strong>Text File Format:</strong></p>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
{`[Q1]
If 3x - 7 = 5, what is the value of x?
IMG: question1.png
A) 3
B) 4  
C) 5
D) 6
ANS: B

[Q2]
What is the area of a circle with radius 5?
A) 25π
B) 10π  
C) 5π
D) 15π
ANS: A`}
              </pre>
              <p><strong>Image Files:</strong> Upload all referenced images (PNG, JPG, GIF supported)</p>
            </div>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Test Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Title *
                </label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., SAT Math Practice Test 1"
                  required
                />
              </div>

              {/* Text File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Questions Text File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => setTextFile(e.target.files[0])}
                    className="hidden"
                    id="textFile"
                    required
                  />
                  <label htmlFor="textFile" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700">Click to upload</span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">TXT files only</p>
                  {textFile && (
                    <p className="text-sm text-green-600 mt-2">✓ {textFile.name}</p>
                  )}
                </div>
              </div>

              {/* Image Files Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Images (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="hidden"
                    id="imageFiles"
                  />
                  <label htmlFor="imageFiles" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700">Click to upload images</span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF files</p>
                  {imageFiles.length > 0 && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ {imageFiles.length} image(s) selected
                      <div className="text-xs text-gray-600 mt-1">
                        {imageFiles.map(file => file.name).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading || !testTitle || !textFile}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-5 h-5" />
                {isUploading ? 'Creating Test...' : 'Create Test'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}