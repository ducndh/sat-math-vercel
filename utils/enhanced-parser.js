/**
 * Enhanced SAT Test File Parser
 * Handles inconsistent formatting and provides robust parsing with LaTeX conversion
 */

export class EnhancedSATParser {
  constructor() {
    this.mathFormulaPatterns = [
      // Fractions
      { pattern: /(\d+)\/(\d+)/g, replacement: '$\\frac{$1}{$2}$' },
      // Square roots
      { pattern: /sqrt\(([^)]+)\)/g, replacement: '$\\sqrt{$1}$' },
      // Already formatted LaTeX - preserve
      { pattern: /\$([^$]+)\$/g, replacement: '$$$1$$' }, // Keep existing LaTeX
      // Variables with exponents not in LaTeX
      { pattern: /([a-zA-Z])(\^)(\d+)/g, replacement: '$$$1^{$3}$$' },
      // Mathematical expressions in parentheses
      { pattern: /\(([a-zA-Z0-9\+\-\*\/\^]+)\)/g, replacement: '($1)' },
    ];
  }

  /**
   * Parse a test file with enhanced error handling
   */
  parseTestFile(content, testName = '') {
    try {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line);
      const result = {
        testName: testName || this.extractTestName(lines),
        sections: this.parseSections(lines),
        totalQuestions: 0,
        imageRequirements: []
      };

      // Count total questions and collect image requirements
      result.sections.forEach(section => {
        result.totalQuestions += section.questions.length;
        section.questions.forEach(question => {
          if (question.requiresImage) {
            result.imageRequirements.push({
              testName: result.testName,
              section: section.name,
              questionNumber: question.id,
              imageType: question.imageType || 'question',
              description: question.imageDescription || 'Unknown'
            });
          }
        });
      });

      return result;
    } catch (error) {
      console.error('Parsing error:', error);
      throw new Error(`Failed to parse test file: ${error.message}`);
    }
  }

  /**
   * Extract test name from file content
   */
  extractTestName(lines) {
    const testNameLine = lines.find(line => line.startsWith('TEST_NAME:::'));
    return testNameLine ? testNameLine.replace('TEST_NAME:::', '').trim() : 'Unknown Test';
  }

  /**
   * Parse sections from lines
   */
  parseSections(lines) {
    const sections = [];
    let currentSection = null;
    let currentQuestion = null;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('QUESTION_SECTION:::')) {
        // Save previous section if exists
        if (currentSection) {
          if (currentQuestion) {
            currentSection.questions.push(this.finalizeQuestion(currentQuestion));
          }
          sections.push(currentSection);
        }

        // Start new section
        currentSection = {
          name: line.replace('QUESTION_SECTION:::', '').trim(),
          questions: []
        };
        currentQuestion = null;

      } else if (line === 'QUESTION_START') {
        // Save previous question if exists
        if (currentQuestion && currentSection) {
          currentSection.questions.push(this.finalizeQuestion(currentQuestion));
        }

        // Start new question
        currentQuestion = this.initializeQuestion();

      } else if (line.startsWith('QUESTION_NUMBER:::')) {
        if (currentQuestion) {
          currentQuestion.id = parseInt(line.replace('QUESTION_NUMBER:::', '').trim());
        }

      } else if (line.startsWith('PASSAGE:::')) {
        if (currentQuestion) {
          currentQuestion.passage = line.replace('PASSAGE:::', '').trim();
        }

      } else if (line.startsWith('QUESTION_TEXT:::')) {
        if (currentQuestion) {
          currentQuestion.text = this.formatMathFormulas(line.replace('QUESTION_TEXT:::', '').trim());
        }

      } else if (line === 'OPTIONS_START') {
        if (currentQuestion) {
          currentQuestion.parsingOptions = true;
        }

      } else if (line.startsWith('OPTION:::')) {
        if (currentQuestion && currentQuestion.parsingOptions) {
          const optionText = line.replace('OPTION:::', '').trim();
          const formattedOption = this.formatMathFormulas(optionText);
          currentQuestion.options.push(formattedOption);
        }

      } else if (line.startsWith('CORRECT_ANSWER:::')) {
        if (currentQuestion) {
          currentQuestion.answer = line.replace('CORRECT_ANSWER:::', '').trim();
        }

      } else if (line.startsWith('NOTE:::')) {
        if (currentQuestion) {
          this.parseNote(currentQuestion, line);
        }

      } else if (line === 'QUESTION_END') {
        // Question end marker - question will be saved when next starts or section ends

      } else if (currentQuestion && !currentQuestion.parsingOptions && currentQuestion.text) {
        // Additional question text
        currentQuestion.text += ' ' + this.formatMathFormulas(line);
      }

      i++;
    }

    // Save final question and section
    if (currentQuestion && currentSection) {
      currentSection.questions.push(this.finalizeQuestion(currentQuestion));
    }
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Initialize a new question object
   */
  initializeQuestion() {
    return {
      id: null,
      text: '',
      passage: '',
      options: [],
      answer: '',
      requiresImage: false,
      imageType: 'question',
      imageDescription: '',
      parsingOptions: false,
      answerType: 'multiple-choice' // or 'student-produced'
    };
  }

  /**
   * Parse NOTE field to extract image requirements
   */
  parseNote(question, noteLine) {
    const noteContent = noteLine.replace('NOTE:::', '').trim();
    
    if (noteContent.toLowerCase().includes('requires image')) {
      question.requiresImage = true;
      
      // Determine image type based on note content
      if (noteContent.toLowerCase().includes('student-produced')) {
        question.answerType = 'student-produced';
        question.imageDescription = 'Student-produced response with image';
      } else if (noteContent.toLowerCase().includes('graph')) {
        question.imageDescription = 'Graph or chart';
      } else if (noteContent.toLowerCase().includes('table')) {
        question.imageDescription = 'Data table';
      } else if (noteContent.toLowerCase().includes('diagram')) {
        question.imageDescription = 'Geometric diagram';
      } else {
        question.imageDescription = 'General image required';
      }
    }
  }

  /**
   * Finalize question processing
   */
  finalizeQuestion(question) {
    // Ensure we have required fields
    if (!question.id) {
      console.warn('Question missing ID');
    }

    // Clean up parsing flags
    delete question.parsingOptions;

    // Generate image filename if image is required
    if (question.requiresImage) {
      question.imageFilename = this.generateImageFilename(question);
    }

    return question;
  }

  /**
   * Generate standardized image filename
   */
  generateImageFilename(question) {
    const testName = 'test'; // Will be set by caller
    const sectionNum = 1; // Will be determined by caller
    const moduleNum = 1; // Will be determined by caller
    return `${testName}_s${sectionNum}m${moduleNum}_q${question.id}.png`;
  }

  /**
   * Format mathematical formulas using LaTeX
   */
  formatMathFormulas(text) {
    if (!text) return text;

    let formattedText = text;

    // Apply each math formula pattern
    this.mathFormulaPatterns.forEach(({ pattern, replacement }) => {
      formattedText = formattedText.replace(pattern, replacement);
    });

    // Clean up any double-$ issues
    formattedText = formattedText.replace(/\$\$+/g, '$');

    return formattedText;
  }

  /**
   * Convert parsed data to the format expected by the current system
   */
  convertToLegacyFormat(parsedData) {
    const allQuestions = [];
    
    parsedData.sections.forEach(section => {
      section.questions.forEach(question => {
        allQuestions.push({
          id: question.id,
          text: question.passage ? `${question.passage}\n\n${question.text}` : question.text,
          imageUrl: question.requiresImage ? '' : undefined, // Will be filled during upload
          imageName: question.requiresImage ? question.imageFilename : undefined,
          options: question.options,
          answer: question.answer,
          section: section.name,
          answerType: question.answerType,
          requiresImage: question.requiresImage
        });
      });
    });

    return allQuestions;
  }

  /**
   * Generate comprehensive image requirements list
   */
  generateImageRequirementsList(parsedData) {
    const requirements = [];
    
    parsedData.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.requiresImage) {
          requirements.push({
            testName: parsedData.testName,
            section: section.name,
            questionId: question.id,
            filename: question.imageFilename,
            description: question.imageDescription,
            type: question.imageType
          });
        }
      });
    });

    return requirements;
  }
}

// Export utility functions for use in components
export const formatMathText = (text) => {
  const parser = new EnhancedSATParser();
  return parser.formatMathFormulas(text);
};

export const parseTestFileContent = (content, testName) => {
  const parser = new EnhancedSATParser();
  return parser.parseTestFile(content, testName);
};