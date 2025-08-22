/**
 * Analyze Image Requirements Script
 * Comprehensive analysis tool to identify all questions requiring images across test files
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { EnhancedSATParser } from '../utils/enhanced-parser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const TEST_FILES = [
  'June 2025 US 1.txt',
  'June 2025 US 2.txt', 
  'March 2025 US 1.txt',
  'May 2025 INT 1.txt'
]

class ImageRequirementAnalyzer {
  constructor() {
    this.parser = new EnhancedSATParser()
    this.allRequirements = []
    this.summaryData = {
      totalTests: 0,
      totalQuestions: 0,
      questionsRequiringImages: 0,
      testBreakdown: []
    }
  }

  /**
   * Analyze all test files for image requirements
   */
  async analyzeAllTests() {
    console.log('🔍 Analyzing image requirements for all test files...\n')
    
    for (const filename of TEST_FILES) {
      try {
        console.log(`📋 Processing ${filename}...`)
        await this.analyzeTestFile(filename)
        console.log(`✅ Completed ${filename}\n`)
      } catch (error) {
        console.error(`❌ Failed to analyze ${filename}:`, error.message)
      }
    }

    this.generateSummaryReport()
    this.exportResults()
    
    return {
      requirements: this.allRequirements,
      summary: this.summaryData
    }
  }

  /**
   * Analyze a single test file
   */
  async analyzeTestFile(filename) {
    const filePath = join(dirname(__dirname), filename)
    const content = readFileSync(filePath, 'utf-8')
    
    // Parse with enhanced parser
    const parsedData = this.parser.parseTestFile(content, filename.replace('.txt', ''))
    const imageRequirements = this.parser.generateImageRequirementsList(parsedData)
    
    // Track requirements
    this.allRequirements.push(...imageRequirements)
    
    // Update summary
    this.summaryData.totalTests++
    this.summaryData.totalQuestions += parsedData.totalQuestions
    this.summaryData.questionsRequiringImages += imageRequirements.length
    
    this.summaryData.testBreakdown.push({
      filename,
      testName: parsedData.testName,
      totalQuestions: parsedData.totalQuestions,
      questionsWithImages: imageRequirements.length,
      percentage: Math.round((imageRequirements.length / parsedData.totalQuestions) * 100),
      sections: this.getSectionBreakdown(parsedData)
    })

    // Display immediate results for this test
    console.log(`   📊 Questions: ${parsedData.totalQuestions}`)
    console.log(`   🖼️  Requiring images: ${imageRequirements.length}`)
    console.log(`   📈 Percentage: ${Math.round((imageRequirements.length / parsedData.totalQuestions) * 100)}%`)
    
    if (imageRequirements.length > 0) {
      console.log(`   📝 Image requirements:`)
      imageRequirements.forEach(req => {
        console.log(`      - Q${req.questionId}: ${req.description} (${req.section})`)
      })
    }
  }

  /**
   * Get section breakdown for a parsed test
   */
  getSectionBreakdown(parsedData) {
    return parsedData.sections.map(section => {
      const questionsWithImages = section.questions.filter(q => q.requiresImage).length
      return {
        name: section.name,
        totalQuestions: section.questions.length,
        questionsWithImages,
        percentage: Math.round((questionsWithImages / section.questions.length) * 100)
      }
    })
  }

  /**
   * Generate comprehensive summary report
   */
  generateSummaryReport() {
    console.log('\n' + '='.repeat(80))
    console.log('📈 IMAGE REQUIREMENTS ANALYSIS SUMMARY')
    console.log('='.repeat(80))
    
    console.log(`\n📊 Overall Statistics:`)
    console.log(`   • Total Tests: ${this.summaryData.totalTests}`)
    console.log(`   • Total Questions: ${this.summaryData.totalQuestions}`)
    console.log(`   • Questions Requiring Images: ${this.summaryData.questionsRequiringImages}`)
    console.log(`   • Overall Percentage: ${Math.round((this.summaryData.questionsRequiringImages / this.summaryData.totalQuestions) * 100)}%`)
    
    console.log(`\n📋 Test-by-Test Breakdown:`)
    this.summaryData.testBreakdown.forEach(test => {
      console.log(`\n   🧪 ${test.testName}:`)
      console.log(`      📁 File: ${test.filename}`)
      console.log(`      📊 Total Questions: ${test.totalQuestions}`)
      console.log(`      🖼️  Questions with Images: ${test.questionsWithImages}`)
      console.log(`      📈 Percentage: ${test.percentage}%`)
      
      console.log(`      📚 Section Breakdown:`)
      test.sections.forEach(section => {
        if (section.questionsWithImages > 0) {
          console.log(`         • ${section.name}: ${section.questionsWithImages}/${section.totalQuestions} (${section.percentage}%)`)
        }
      })
    })

    console.log(`\n🖼️  Detailed Image Requirements:`)
    this.groupRequirementsByTest().forEach(testGroup => {
      if (testGroup.requirements.length > 0) {
        console.log(`\n   📋 ${testGroup.testName}:`)
        testGroup.requirements.forEach(req => {
          console.log(`      ⚫ Question ${req.questionId} (${req.section}):`)
          console.log(`         Type: ${req.description}`)
          console.log(`         Suggested filename: ${req.filename}`)
        })
      }
    })

    console.log('\n' + '='.repeat(80))
  }

  /**
   * Group requirements by test for organized display
   */
  groupRequirementsByTest() {
    const testGroups = new Map()
    
    this.allRequirements.forEach(req => {
      if (!testGroups.has(req.testName)) {
        testGroups.set(req.testName, {
          testName: req.testName,
          requirements: []
        })
      }
      testGroups.get(req.testName).requirements.push(req)
    })
    
    return Array.from(testGroups.values())
  }

  /**
   * Export results to JSON files for easy access
   */
  exportResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    
    // Export detailed requirements
    const requirementsFile = `image-requirements-${timestamp}.json`
    writeFileSync(
      join(process.cwd(), 'scripts', requirementsFile),
      JSON.stringify({
        generatedAt: new Date().toISOString(),
        summary: this.summaryData,
        requirements: this.allRequirements,
        groupedByTest: this.groupRequirementsByTest()
      }, null, 2)
    )
    
    // Export a simple checklist for manual image creation
    const checklistFile = `image-checklist-${timestamp}.md`
    const checklistContent = this.generateImageChecklist()
    writeFileSync(join(process.cwd(), 'scripts', checklistFile), checklistContent)
    
    console.log(`\n💾 Results exported:`)
    console.log(`   📄 Detailed data: scripts/${requirementsFile}`)
    console.log(`   📝 Image checklist: scripts/${checklistFile}`)
  }

  /**
   * Generate markdown checklist for image creation
   */
  generateImageChecklist() {
    const lines = [
      '# SAT Test Image Requirements Checklist',
      '',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      '## Summary',
      `- Total tests: ${this.summaryData.totalTests}`,
      `- Total questions needing images: ${this.summaryData.questionsRequiringImages}`,
      '',
      '## Image Requirements by Test',
      ''
    ]

    this.groupRequirementsByTest().forEach(testGroup => {
      if (testGroup.requirements.length > 0) {
        lines.push(`### ${testGroup.testName}`)
        lines.push('')
        
        testGroup.requirements.forEach(req => {
          lines.push(`- [ ] **Question ${req.questionId}** (${req.section})`)
          lines.push(`  - Type: ${req.description}`)
          lines.push(`  - Filename: \`${req.filename}\``)
          lines.push('')
        })
      }
    })

    lines.push('## Instructions for Creating Images')
    lines.push('1. Create images for each question marked above')
    lines.push('2. Use the suggested filenames for consistency')
    lines.push('3. Ensure images are clear and readable at web resolution')
    lines.push('4. Save as PNG or JPG format')
    lines.push('5. Upload to the website using the admin panel')

    return lines.join('\n')
  }

  /**
   * Quick check - just list tests that need images
   */
  async quickImageCheck() {
    console.log('🚀 Quick Image Requirements Check\n')
    
    for (const filename of TEST_FILES) {
      try {
        const filePath = join(dirname(__dirname), filename)
        const content = readFileSync(filePath, 'utf-8')
        const parsedData = this.parser.parseTestFile(content, filename.replace('.txt', ''))
        const imageRequirements = parsedData.sections
          .flatMap(section => section.questions)
          .filter(q => q.requiresImage)
        
        console.log(`📋 ${filename}:`)
        if (imageRequirements.length > 0) {
          console.log(`   🖼️  ${imageRequirements.length} questions need images`)
          imageRequirements.forEach(q => {
            console.log(`   ⚫ Q${q.id}: ${q.imageDescription}`)
          })
        } else {
          console.log(`   ✅ No images required`)
        }
        console.log('')
        
      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message)
      }
    }
  }
}

// CLI execution - always run if called directly
const analyzer = new ImageRequirementAnalyzer()

// Check for quick mode flag
const isQuickMode = process.argv.includes('--quick')

if (isQuickMode) {
  analyzer.quickImageCheck()
    .then(() => {
      console.log('✨ Quick check completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Quick check failed:', error)
      process.exit(1)
    })
} else {
  analyzer.analyzeAllTests()
    .then(() => {
      console.log('🎉 Image requirements analysis completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Analysis failed:', error)
      process.exit(1)
    })
}

export { ImageRequirementAnalyzer }