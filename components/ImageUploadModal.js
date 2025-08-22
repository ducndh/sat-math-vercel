'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, Clipboard, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { upload } from '@vercel/blob/client'

export default function ImageUploadModal({ 
  isOpen, 
  onClose, 
  requirement, 
  testName,
  onUploadSuccess 
}) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [hasClipboardImage, setHasClipboardImage] = useState(false)
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)

  // Check for clipboard image on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      checkClipboard()
      // Focus the modal for keyboard events
      modalRef.current?.focus()
    }
  }, [isOpen])

  // Check if clipboard contains an image
  const checkClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read()
        const hasImage = clipboardItems.some(item => 
          item.types.some(type => type.startsWith('image/'))
        )
        setHasClipboardImage(hasImage)
      }
    } catch (err) {
      // Clipboard API might not be available or permission denied
      setHasClipboardImage(false)
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        handlePasteFromClipboard()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handlePasteFromClipboard = async () => {
    try {
      setError('')
      
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error('Clipboard API not supported in this browser')
      }

      const clipboardItems = await navigator.clipboard.read()
      
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type)
            const file = new File([blob], requirement.filename, { type })
            await uploadFile(file)
            return
          }
        }
      }
      
      throw new Error('No image found in clipboard')
    } catch (err) {
      setError(`Failed to paste from clipboard: ${err.message}`)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      uploadFile(imageFiles[0])
    } else {
      setError('Please drop an image file')
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  const uploadFile = async (file) => {
    try {
      setUploading(true)
      setError('')
      setSuccess('')

      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // Upload to Vercel Blob
      const blob = await upload(requirement.filename, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/create-upload-token',
      })

      setSuccess(`Successfully uploaded ${requirement.filename}`)
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess({
          filename: requirement.filename,
          url: blob.url,
          uploadedAt: new Date().toISOString()
        })
      }

      // Auto-close after success
      setTimeout(() => {
        onClose()
        setPreviewUrl('')
        setSuccess('')
      }, 1500)

    } catch (err) {
      console.error('Upload error:', err)
      setError(`Failed to upload: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Image - Question {requirement?.questionId}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {requirement?.section} • {testName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Required Image:</h3>
            <p className="text-gray-700">{requirement?.description}</p>
            <p className="text-xs text-gray-500 mt-1">Filename: {requirement?.filename}</p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Preview:</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img 
                  src={previewUrl} 
                  alt="Upload preview"
                  className="max-w-full h-auto max-h-64 mx-auto"
                />
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Upload Image for Question {requirement?.questionId}
                </p>
                <p className="text-gray-600">
                  Drop an image here, click to browse, or paste from clipboard
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* File Browse Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Browse Files'}
                </button>

                {/* Paste Button */}
                <button
                  onClick={handlePasteFromClipboard}
                  disabled={uploading || !hasClipboardImage}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={hasClipboardImage ? 'Paste image from clipboard (Ctrl+V)' : 'No image in clipboard'}
                >
                  <Clipboard className="w-4 h-4" />
                  Paste from Clipboard
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Keyboard shortcut: <kbd className="bg-gray-100 px-1 rounded">Ctrl+V</kbd> to paste
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}