'use client'

import { useState } from 'react'
import { upload } from '@vercel/blob/client'

const JUNE_2025_US_1_IMAGES = [
  // Math Section 2, Module 1 (6 images)
  { filename: 'june_2025_us_1_s2m1_q1.png', description: 'Math Section 2 Module 1 - Question 1', section: 'Math S2M1', question: 'Q1' },
  { filename: 'june_2025_us_1_s2m1_q2.png', description: 'Math Section 2 Module 1 - Question 2', section: 'Math S2M1', question: 'Q2' },
  { filename: 'june_2025_us_1_s2m1_q6.png', description: 'Math Section 2 Module 1 - Question 6', section: 'Math S2M1', question: 'Q6' },
  { filename: 'june_2025_us_1_s2m1_q9.png', description: 'Math Section 2 Module 1 - Question 9', section: 'Math S2M1', question: 'Q9' },
  { filename: 'june_2025_us_1_s2m1_q11.png', description: 'Math Section 2 Module 1 - Question 11', section: 'Math S2M1', question: 'Q11' },
  { filename: 'june_2025_us_1_s2m1_q22.png', description: 'Math Section 2 Module 1 - Question 22', section: 'Math S2M1', question: 'Q22' },
  
  // Math Section 2, Module 2 (5 images)
  { filename: 'june_2025_us_1_s2m2_q2.png', description: 'Math Section 2 Module 2 - Question 2', section: 'Math S2M2', question: 'Q2' },
  { filename: 'june_2025_us_1_s2m2_q3.png', description: 'Math Section 2 Module 2 - Question 3', section: 'Math S2M2', question: 'Q3' },
  { filename: 'june_2025_us_1_s2m2_q9.png', description: 'Math Section 2 Module 2 - Question 9', section: 'Math S2M2', question: 'Q9' },
  { filename: 'june_2025_us_1_s2m2_q11.png', description: 'Math Section 2 Module 2 - Question 11', section: 'Math S2M2', question: 'Q11' },
  { filename: 'june_2025_us_1_s2m2_q15.png', description: 'Math Section 2 Module 2 - Question 15', section: 'Math S2M2', question: 'Q15' },
  
  // Reading Section 1, Module 1 (2 images)
  { filename: 'june_2025_us_1_s1m1_q11.png', description: 'Reading Section 1 Module 1 - Question 11', section: 'Reading S1M1', question: 'Q11' },
  { filename: 'june_2025_us_1_s1m1_q13.png', description: 'Reading Section 1 Module 1 - Question 13', section: 'Reading S1M1', question: 'Q13' },
  
  // Reading Section 1, Module 2 (1 image)
  { filename: 'june_2025_us_1_s1m2_q10.png', description: 'Reading Section 1 Module 2 - Question 10', section: 'Reading S1M2', question: 'Q10' }
]

export default function UploadImagesPage() {
  const [uploads, setUploads] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const currentImage = JUNE_2025_US_1_IMAGES[currentIndex]
  const uploadedCount = Object.keys(uploads).length
  const isComplete = uploadedCount === JUNE_2025_US_1_IMAGES.length

  const handlePaste = async (e) => {
    e.preventDefault()
    
    try {
      const items = e.clipboardData.items
      let imageFile = null
      
      for (let item of items) {
        if (item.type.startsWith('image/')) {
          imageFile = item.getAsFile()
          break
        }
      }
      
      if (!imageFile) {
        alert('No image found in clipboard. Please copy an image and try again.')
        return
      }
      
      setIsUploading(true)
      
      // Upload to Vercel Blob
      const blob = await upload(currentImage.filename, imageFile, {
        access: 'public',
        handleUploadUrl: '/api/admin/create-upload-token',
      })
      
      // Update state
      setUploads(prev => ({
        ...prev,
        [currentIndex]: {
          ...currentImage,
          url: blob.url,
          uploaded: new Date().toISOString()
        }
      }))
      
      // Move to next image if not at the end
      if (currentIndex < JUNE_2025_US_1_IMAGES.length - 1) {
        setCurrentIndex(prev => prev + 1)
      }
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < JUNE_2025_US_1_IMAGES.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const goToImage = (index) => {
    setCurrentIndex(index)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              All Images Uploaded Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              All 14 images for June 2025 US 1 test have been uploaded to Vercel Blob.
              Your students can now access the complete test.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Student Test URL</h2>
              <p className="text-blue-600 text-sm mb-2">Share this link with your students:</p>
              <code className="text-blue-800 bg-white px-3 py-2 rounded border block">
                https://sat-math-vercel.vercel.app/test/85b9f244-5abf-4c98-8e67-7ea3207fa0a7
              </code>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(uploads).map((upload, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700">{upload.section}</div>
                  <div className="text-xs text-gray-500 mb-2">{upload.question}</div>
                  <img 
                    src={upload.url} 
                    alt={upload.description}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <div className="text-xs text-green-600 mt-2">✅ Uploaded</div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload More Images
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Images for June 2025 US 1 Test
            </h1>
            <p className="text-gray-600">
              Upload {JUNE_2025_US_1_IMAGES.length} images to make the test accessible to students
            </p>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{uploadedCount} / {JUNE_2025_US_1_IMAGES.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(uploadedCount / JUNE_2025_US_1_IMAGES.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Current Image Upload */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
            <div className="mb-6">
              <div className="text-4xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {currentImage.section} - {currentImage.question}
              </h2>
              <p className="text-gray-600 mb-4">{currentImage.description}</p>
              <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {currentImage.filename}
              </code>
            </div>

            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Uploading image...</p>
              </div>
            ) : uploads[currentIndex] ? (
              <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-green-600 font-semibold mb-4">Image uploaded successfully!</p>
                <img 
                  src={uploads[currentIndex].url} 
                  alt={uploads[currentIndex].description}
                  className="max-w-sm mx-auto rounded border shadow-sm"
                />
              </div>
            ) : (
              <div 
                className="cursor-pointer hover:bg-blue-50 transition-colors rounded-lg p-6"
                tabIndex={0}
                onPaste={handlePaste}
                onKeyDown={(e) => e.key === 'Enter' && e.target.focus()}
              >
                <div className="text-6xl mb-4">📸</div>
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  Copy your image and press Ctrl+V here
                </p>
                <p className="text-gray-600 text-sm">
                  Or click here and paste your image
                </p>
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  Ready to Paste (Ctrl+V)
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="flex space-x-2">
              {JUNE_2025_US_1_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    uploads[index] 
                      ? 'bg-green-500 text-white' 
                      : index === currentIndex 
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToNext}
              disabled={currentIndex === JUNE_2025_US_1_IMAGES.length - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ol className="text-blue-700 text-sm space-y-1">
              <li>1. Copy an image to your clipboard (from any source)</li>
              <li>2. Click in the upload area above</li>
              <li>3. Press Ctrl+V to paste the image</li>
              <li>4. The image will upload automatically to Vercel Blob</li>
              <li>5. Move to the next image and repeat</li>
            </ol>
          </div>

          {/* Final URL Preview */}
          {uploadedCount > 0 && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Student Test URL:</h3>
              <code className="text-green-700 text-sm">
                https://sat-math-vercel.vercel.app/test/85b9f244-5abf-4c98-8e67-7ea3207fa0a7
              </code>
              <p className="text-green-600 text-xs mt-1">
                Students can access this test as soon as you upload the images!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}