'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Download,
  Eye,
  FileImage,
  List,
  Grid,
  Loader2
} from 'lucide-react'
import { upload } from '@vercel/blob/client'
import ImageUploadModal from '../../../components/ImageUploadModal'

export default function ImageManagerPage() {
  const [selectedTest, setSelectedTest] = useState('')
  const [uploadedImages, setUploadedImages] = useState({})
  const [uploadProgress, setUploadProgress] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [successMessage, setSuccessMessage] = useState('')
  const [imageRequirements, setImageRequirements] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const testNames = Object.keys(imageRequirements)

  // Load image requirements from API
  useEffect(() => {
    async function loadImageRequirements() {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/image-requirements')
        const data = await response.json()
        
        if (data.success) {
          setImageRequirements(data.requirements)
        } else {
          setError('Failed to load image requirements: ' + data.error)
        }
      } catch (err) {
        setError('Failed to load image requirements: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadImageRequirements()
  }, [])

  const handleFileUpload = async (file, requirement) => {
    try {
      setIsUploading(true)
      setUploadProgress(prev => ({ ...prev, [requirement.filename]: 0 }))

      const blob = await upload(requirement.filename, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/create-upload-token',
      })

      setUploadedImages(prev => ({
        ...prev,
        [`${selectedTest}_${requirement.filename}`]: {
          url: blob.url,
          filename: requirement.filename,
          uploadedAt: new Date().toISOString()
        }
      }))

      setUploadProgress(prev => ({ ...prev, [requirement.filename]: 100 }))
      setSuccessMessage(`Successfully uploaded ${requirement.filename}`)
      
      setTimeout(() => setSuccessMessage(''), 3000)

    } catch (err) {
      console.error('Upload error:', err)
      setError(`Failed to upload ${requirement.filename}: ${err.message}`)
    } finally {
      setIsUploading(false)
      setUploadProgress(prev => ({ ...prev, [requirement.filename]: 0 }))
    }
  }

  const handleMultipleFileUpload = async (files) => {
    if (!selectedTest) {
      setError('Please select a test first')
      return
    }

    const requirements = imageRequirements[selectedTest]
    if (!requirements) {
      setError('No requirements found for selected test')
      return
    }

    const fileArray = Array.from(files)

    try {
      setIsUploading(true)
      let successCount = 0

      for (const file of fileArray) {
        // Try to auto-match file to requirement
        const matchedRequirement = requirements.find(req => {
          const baseName = file.name.toLowerCase().replace(/\.(png|jpg|jpeg|gif)$/, '')
          const reqBaseName = req.filename.toLowerCase().replace(/\.(png|jpg|jpeg|gif)$/, '')
          return baseName === reqBaseName || 
                 baseName.includes(`q${req.questionId}`) ||
                 file.name.toLowerCase().includes(`q${req.questionId}`)
        })

        if (matchedRequirement) {
          await handleFileUpload(file, matchedRequirement)
          successCount++
        } else {
          console.warn(`Could not auto-match file: ${file.name}`)
        }
      }

      if (successCount > 0) {
        setSuccessMessage(`Successfully uploaded ${successCount} image(s)`)
      }

    } catch (err) {
      setError('Error during bulk upload: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Modal handlers
  const openUploadModal = (requirement) => {
    setSelectedRequirement(requirement)
    setShowModal(true)
  }

  const closeUploadModal = () => {
    setShowModal(false)
    setSelectedRequirement(null)
  }

  const handleModalUploadSuccess = (uploadData) => {
    setUploadedImages(prev => ({
      ...prev,
      [`${selectedTest}_${uploadData.filename}`]: uploadData
    }))
    setSuccessMessage(`Successfully uploaded ${uploadData.filename}`)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const downloadRequirementsList = () => {
    if (!selectedTest) return

    const requirements = imageRequirements[selectedTest]
    if (!requirements) return

    const csvContent = [
      'Test,Section,Question,Filename,Description',
      ...requirements.map(req => 
        `"${selectedTest}","${req.section}",${req.questionId},"${req.filename}","${req.description}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTest.replace(/\s+/g, '_')}_image_requirements.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getUploadStatus = (requirement) => {
    const key = `${selectedTest}_${requirement.filename}`
    return uploadedImages[key] ? 'uploaded' : 'pending'
  }

  const getUploadedImageUrl = (requirement) => {
    const key = `${selectedTest}_${requirement.filename}`
    return uploadedImages[key]?.url
  }

  if (!selectedTest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link 
              href="/admin"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Manager</h1>
            <p className="text-gray-600">Upload and manage images for SAT practice tests</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Test</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading image requirements...</span>
                </div>
              ) : testNames.length === 0 ? (
                <div className="text-center py-12">
                  <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tests with image requirements found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testNames.map(testName => {
                    const requirements = imageRequirements[testName]
                    const totalImages = requirements?.length || 0
                    const uploadedCount = Object.keys(uploadedImages).filter(key => 
                      key.startsWith(testName)
                    ).length

                    return (
                      <div
                        key={testName}
                        onClick={() => setSelectedTest(testName)}
                        className="border border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{testName}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{totalImages} images required</p>
                          <p className="text-green-600">{uploadedCount} uploaded</p>
                          {uploadedCount < totalImages && (
                            <p className="text-amber-600">{totalImages - uploadedCount} remaining</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const requirements = imageRequirements[selectedTest] || []
  const totalImages = requirements.length
  const uploadedCount = Object.keys(uploadedImages).filter(key => 
    key.startsWith(selectedTest)
  ).length

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Image Manager - {selectedTest}
              </h1>
              <p className="text-gray-600">
                Upload images for {totalImages} questions ({uploadedCount} uploaded, {totalImages - uploadedCount} remaining)
              </p>
            </div>
            <button
              onClick={() => setSelectedTest('')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Change Test
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Bulk Upload */}
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileUpload(e.target.files)}
                className="hidden"
                id="bulkUpload"
                disabled={isUploading}
              />
              <label 
                htmlFor="bulkUpload" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Bulk Upload Images'}
              </label>
            </div>

            {/* Download Requirements */}
            <button
              onClick={downloadRequirementsList}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Download Requirements List
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-700'} rounded-l-lg`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700'} rounded-r-lg`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Requirements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {requirements.map((requirement) => {
                const status = getUploadStatus(requirement)
                const imageUrl = getUploadedImageUrl(requirement)
                const progressValue = uploadProgress[requirement.filename] || 0

                return (
                  <div key={requirement.filename} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        Q{requirement.questionId}
                      </span>
                      {status === 'uploaded' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <FileImage className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">{requirement.section}</p>
                      <p className="text-sm text-gray-800">{requirement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{requirement.filename}</p>
                    </div>

                    {status === 'uploaded' && imageUrl ? (
                      <div className="mb-3">
                        <img 
                          src={imageUrl} 
                          alt={requirement.description}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <a 
                          href={imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1"
                        >
                          <Eye className="w-3 h-3" />
                          View Full Size
                        </a>
                      </div>
                    ) : (
                      <div 
                        onClick={() => openUploadModal(requirement)}
                        className="h-24 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center mb-3 cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors group"
                      >
                        <div className="text-center">
                          <FileImage className="w-8 h-8 text-gray-400 mx-auto mb-1 group-hover:text-blue-500" />
                          <p className="text-xs text-gray-500 group-hover:text-blue-600">Click to upload</p>
                        </div>
                      </div>
                    )}

                    {progressValue > 0 && progressValue < 100 && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressValue}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => openUploadModal(requirement)}
                        disabled={isUploading}
                        className={`flex-1 text-center px-3 py-2 text-sm rounded cursor-pointer transition-colors ${
                          status === 'uploaded' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        } disabled:opacity-50`}
                      >
                        {status === 'uploaded' ? 'Replace Image' : 'Upload Image'}
                      </button>
                      
                      {/* Legacy file input for fallback */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) handleFileUpload(file, requirement)
                        }}
                        className="hidden"
                        id={`upload-${requirement.filename}`}
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor={`upload-${requirement.filename}`}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                        title="Browse files"
                      >
                        📁
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requirements.map((requirement) => {
                const status = getUploadStatus(requirement)
                const imageUrl = getUploadedImageUrl(requirement)

                return (
                  <div key={requirement.filename} className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {status === 'uploaded' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <FileImage className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900">
                          Question {requirement.questionId}
                        </span>
                        <span className="text-sm text-gray-600">{requirement.section}</span>
                      </div>
                      <p className="text-sm text-gray-800">{requirement.description}</p>
                      <p className="text-xs text-gray-500">{requirement.filename}</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      {status === 'uploaded' && imageUrl && (
                        <a 
                          href={imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => openUploadModal(requirement)}
                        disabled={isUploading}
                        className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors ${
                          status === 'uploaded' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        } disabled:opacity-50`}
                      >
                        {status === 'uploaded' ? 'Replace' : 'Upload'}
                      </button>

                      {/* Legacy file input for fallback */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) handleFileUpload(file, requirement)
                        }}
                        className="hidden"
                        id={`list-upload-${requirement.filename}`}
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor={`list-upload-${requirement.filename}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                        title="Browse files"
                      >
                        📁
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        <ImageUploadModal
          isOpen={showModal}
          onClose={closeUploadModal}
          requirement={selectedRequirement}
          testName={selectedTest}
          onUploadSuccess={handleModalUploadSuccess}
        />
      </div>
    </div>
  )
}