import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'
import { ImageRequirementAnalyzer } from '../../../../scripts/analyze-image-requirements.js'

const TEST_FILES = [
  'June 2025 US 1.txt',
  'June 2025 US 2.txt', 
  'March 2025 US 1.txt',
  'May 2025 INT 1.txt'
]

export async function GET() {
  try {
    const analyzer = new ImageRequirementAnalyzer()
    
    // Analyze all test files
    const result = await analyzer.analyzeAllTests()
    
    // Group requirements by test for the UI
    const groupedRequirements = {}
    
    result.requirements.forEach(req => {
      if (!groupedRequirements[req.testName]) {
        groupedRequirements[req.testName] = []
      }
      groupedRequirements[req.testName].push({
        section: req.section,
        questionId: req.questionId,
        filename: req.filename,
        description: req.description
      })
    })
    
    return NextResponse.json({
      success: true,
      requirements: groupedRequirements,
      summary: result.summary
    })
    
  } catch (error) {
    console.error('Error analyzing image requirements:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}