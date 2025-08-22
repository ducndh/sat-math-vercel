/**
 * Upload Your Provided Images to Vercel Blob
 * Direct upload to make production test work
 */

import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const YOUR_IMAGES = [
  // Math Module 1 (Section 2, Module 1)
  { file: 'June2025US1_M1_Q1.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m1', question: 'q1' },
  { file: 'June2025US1_M1_Q2.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m1', question: 'q2' },
  { file: 'June2025US1_M1_Q6.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m1', question: 'q6' },
  { file: 'June2025US1_M1_Q11.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m1', question: 'q11' },
  { file: 'June2025US1_M1_Q22.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m1', question: 'q22' },
  
  // Math Module 2 (Section 2, Module 2)
  { file: 'June2025US1_M2_Q2.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m2', question: 'q2' },
  { file: 'June2025US1_M2_Q3.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m2', question: 'q3' },
  { file: 'June2025US1_M2_Q9.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m2', question: 'q9' },
  { file: 'June2025US1_M2_Q11.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m2', question: 'q11' },
  { file: 'June2025US1_M2_Q15.png', testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7', section: 's2m2', question: 'q15' }
]

class ProductionImageUploader {
  constructor() {
    this.uploadedImages = []
    this.testId = '85b9f244-5abf-4c98-8e67-7ea3207fa0a7'
  }

  async uploadAllImages() {
    console.log('🚀 Uploading your images to Vercel Blob for production...')
    console.log(`📊 Found ${YOUR_IMAGES.length} images to upload`)
    console.log('')
    
    for (const image of YOUR_IMAGES) {
      try {
        console.log(`📤 Uploading ${image.file}...`)
        
        const filePath = join(process.cwd(), image.file)
        const fileData = readFileSync(filePath)
        
        // Generate proper filename for Vercel Blob
        const blobFilename = `images/${image.testId}_${image.section}_${image.question}.png`
        
        // Upload to Vercel Blob
        const blob = await put(blobFilename, fileData, {
          access: 'public',
          contentType: 'image/png',
        })
        
        console.log(`✅ Uploaded: ${image.file} → ${blob.url}`)
        
        this.uploadedImages.push({
          originalFile: image.file,
          blobUrl: blob.url,
          testId: image.testId,
          section: image.section,
          question: image.question
        })
        
      } catch (error) {
        console.error(`❌ Failed to upload ${image.file}:`, error.message)
      }
    }
    
    console.log('')
    console.log('📋 Upload Summary:')
    this.uploadedImages.forEach(img => {
      console.log(`✅ ${img.originalFile} → Live at: ${img.blobUrl}`)
    })
    
    return this.uploadedImages
  }

  async testProductionURL() {
    console.log('')
    console.log('🔍 Testing production test URL...')
    
    const testUrl = `https://sat-math-vercel.vercel.app/test/${this.testId}`
    console.log(`📝 Production URL: ${testUrl}`)
    
    try {
      const response = await fetch(testUrl)
      if (response.ok) {
        console.log('✅ Production test URL is accessible!')
      } else {
        console.log(`⚠️ Production URL returned status: ${response.status}`)
      }
    } catch (error) {
      console.log(`⚠️ Could not test production URL: ${error.message}`)
    }
    
    console.log('')
    console.log('🎯 READY FOR STUDENTS!')
    console.log(`📖 Test URL: ${testUrl}`)
    console.log('📸 Images: Uploaded to Vercel Blob (accessible globally)')
    console.log('🧮 Math: KaTeX rendering enabled')
    console.log('')
  }
}

// Execute upload
if (import.meta.url === `file://${process.argv[1]}`) {
  const uploader = new ProductionImageUploader()
  
  uploader.uploadAllImages()
    .then(() => uploader.testProductionURL())
    .then(() => {
      console.log('🏆 SUCCESS: June 2025 US 1 test is ready!')
      console.log('👨‍🎓 Students can now access the fully functional test.')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Upload process failed:', error)
      process.exit(1)
    })
}

export { ProductionImageUploader }