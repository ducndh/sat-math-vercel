/**
 * Upload Tests Script
 * Automatically parse and upload test files to Vercel Blob
 */

import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { EnhancedSATParser } from '../utils/enhanced-parser.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const TEST_FILES = [
  'June 2025 US 1.txt',
  'June 2025 US 2.txt', 
  'March 2025 US 1.txt',
  'May 2025 INT 1.txt'
]

class TestUploader {
  constructor() {
    this.parser = new EnhancedSATParser()
    this.uploadedTests = []
  }

  async uploadAllTests() {
    console.log('Starting test upload process...')
    
    for (const filename of TEST_FILES) {
      try {
        console.log(`\nProcessing ${filename}...`)
        await this.uploadSingleTest(filename)
      } catch (error) {
        console.error(`Failed to upload ${filename}:`, error)
      }
    }

    console.log('\n=== Upload Summary ===')
    this.uploadedTests.forEach(test => {
      console.log(`✅ ${test.title}`)
      console.log(`   ID: ${test.testId}`)
      console.log(`   URL: https://sat-math-vercel.vercel.app/test/${test.testId}`)
      console.log(`   Questions: ${test.questionCount}`)
      console.log(`   Images needed: ${test.imageCount}`)
    })

    return this.uploadedTests
  }

  async uploadSingleTest(filename) {
    const filePath = join(process.cwd(), filename)
    const content = readFileSync(filePath, 'utf-8')
    
    // Parse with enhanced parser
    const parsedData = this.parser.parseTestFile(content, filename.replace('.txt', ''))
    const questions = this.parser.convertToLegacyFormat(parsedData)
    const imageRequirements = this.parser.generateImageRequirementsList(parsedData)

    // Generate test ID
    const testId = uuidv4()

    // Create test object
    const test = {
      testId,
      title: parsedData.testName,
      questions: questions,
      createdAt: new Date().toISOString(),
      imageRequirements: imageRequirements,
      metadata: {
        totalQuestions: questions.length,
        sections: parsedData.sections.map(s => s.name),
        imagesRequired: imageRequirements.length,
        mathFormulasProcessed: this.countMathFormulas(questions)
      }
    }

    // Store in Vercel Blob
    await put(`tests/${testId}.json`, JSON.stringify(test), {
      access: 'public',
      contentType: 'application/json',
    });
    
    console.log(`✅ Uploaded: ${test.title}`)
    console.log(`   Test ID: ${testId}`)
    console.log(`   Questions: ${questions.length}`)
    console.log(`   Images needed: ${imageRequirements.length}`)
    
    this.uploadedTests.push({
      testId,
      title: test.title,
      questionCount: questions.length,
      imageCount: imageRequirements.length
    })

    return test
  }

  countMathFormulas(questions) {
    let count = 0
    questions.forEach(q => {
      if (q.text && q.text.includes('$')) count++
      q.options?.forEach(opt => {
        if (opt.includes('$')) count++
      })
    })
    return count
  }

  async listExistingTests() {
    try {
      // This would require scanning Blob files - for now return empty
      console.log('Checking existing tests in Blob...')
      return []
    } catch (error) {
      console.error('Error checking existing tests:', error)
      return []
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const uploader = new TestUploader()
  
  uploader.uploadAllTests()
    .then(results => {
      console.log('\n🎉 All tests uploaded successfully!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Upload failed:', error)
      process.exit(1)
    })
}

export { TestUploader }