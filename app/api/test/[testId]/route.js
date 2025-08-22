import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { testId } = params

    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      )
    }

    // For the June 2025 US 1 test specifically
    if (testId === '85b9f244-5abf-4c98-8e67-7ea3207fa0a7') {
      return NextResponse.json({
        testId: '85b9f244-5abf-4c98-8e67-7ea3207fa0a7',
        title: 'June 2025 US 1',
        totalQuestions: 95,
        timeLimit: 134,
        sections: [
          { name: 'Reading and Writing', moduleCount: 2 },
          { name: 'Math', moduleCount: 2 }
        ],
        questions: [
          // Section 2, Module 1: Math - Q1
          {
            id: 's2m1_q1',
            section: 'Math',
            module: 1,
            questionNumber: 1,
            type: 'multiple_choice',
            text: 'The function $f$ is defined by $f(x) = 2x^3 - 5x^2 + 3x - 1$. What is the value of $f(2)$?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m1_q1-Pmdut8HJSjAPwVt4wa6NnBuJcDmEqg.png',
            options: ['A) 1', 'B) 3', 'C) 5', 'D) 7']
          },
          // Section 2, Module 1: Math - Q2  
          {
            id: 's2m1_q2',
            section: 'Math',
            module: 1,
            questionNumber: 2,
            type: 'multiple_choice',
            text: 'In the $xy$-plane, the graph of the equation $y = ax^2 + bx + c$ passes through the points $(0, 3)$, $(1, 6)$, and $(2, 11)$. What is the value of $a + b + c$?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m1_q2-stItBFSXkFN4VU5Ir2rubupB5iuCxW.png',
            options: ['A) 6', 'B) 8', 'C) 10', 'D) 12']
          },
          // Section 2, Module 1: Math - Q6
          {
            id: 's2m1_q6',
            section: 'Math',
            module: 1,
            questionNumber: 6,
            type: 'multiple_choice',
            text: 'The figure shows triangle $ABC$ with side lengths as marked. What is the perimeter of triangle $ABC$?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m1_q6-71y24ZJJDt2G995Rowwz6iYqEjCdr0.png',
            options: ['A) 24', 'B) 26', 'C) 28', 'D) 30']
          },
          // Section 2, Module 1: Math - Q11
          {
            id: 's2m1_q11',
            section: 'Math',
            module: 1,
            questionNumber: 11,
            type: 'multiple_choice',
            text: 'The graph shows the relationship between $x$ and $y$. Which equation best represents this relationship?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m1_q11-YHXmxtmejTjHGtf7FPF6MuGxlqKMv2.png',
            options: ['A) $y = 2x + 1$', 'B) $y = x^2 + 2$', 'C) $y = 3x - 1$', 'D) $y = x^2 - 3$']
          },
          // Section 2, Module 1: Math - Q22
          {
            id: 's2m1_q22',
            section: 'Math',
            module: 1,
            questionNumber: 22,
            type: 'multiple_choice',
            text: 'The diagram shows a circle with center $O$. What is the area of the shaded region?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m1_q22-PENmVOLaJTBwmoGNl2PYWgCwYTZwFc.png',
            options: ['A) $4\\pi$', 'B) $8\\pi$', 'C) $12\\pi$', 'D) $16\\pi$']
          },
          // Section 2, Module 2: Math - Q2
          {
            id: 's2m2_q2',
            section: 'Math',
            module: 2,
            questionNumber: 2,
            type: 'multiple_choice',
            text: 'The system of equations is shown. What is the solution to this system?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m2_q2-W0nDXeXXrHvFnebL6FyJHKqbOcq1SZ.png',
            options: ['A) $(2, 3)$', 'B) $(3, 4)$', 'C) $(4, 5)$', 'D) $(5, 6)$']
          },
          // Section 2, Module 2: Math - Q3
          {
            id: 's2m2_q3',
            section: 'Math',
            module: 2,
            questionNumber: 3,
            type: 'multiple_choice',
            text: 'The table shows values of the linear function $f$. What is the value of $f(10)$?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m2_q3-Pt0hgKgyV3rQW0V2SlxCLNLNonJzkZ.png',
            options: ['A) 23', 'B) 25', 'C) 27', 'D) 29']
          },
          // Section 2, Module 2: Math - Q9
          {
            id: 's2m2_q9',
            section: 'Math',
            module: 2,
            questionNumber: 9,
            type: 'multiple_choice',
            text: 'The figure shows a right triangle. What is the value of $\\sin(A)$?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m2_q9-rOkeKPBbS0HHRo9j62D9RbLqYgCRG2.png',
            options: ['A) $\\frac{3}{5}$', 'B) $\\frac{4}{5}$', 'C) $\\frac{3}{4}$', 'D) $\\frac{5}{3}$']
          },
          // Section 2, Module 2: Math - Q11
          {
            id: 's2m2_q11',
            section: 'Math',
            module: 2,
            questionNumber: 11,
            type: 'multiple_choice',
            text: 'The scatter plot shows data points and a line of best fit. Based on the line of best fit, what is the predicted $y$-value when $x = 8$?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m2_q11-sXlA8vIkqUpSuUhoDe3RksNPZd102S.png',
            options: ['A) 16', 'B) 18', 'C) 20', 'D) 22']
          },
          // Section 2, Module 2: Math - Q15
          {
            id: 's2m2_q15',
            section: 'Math',
            module: 2,
            questionNumber: 15,
            type: 'student_produced',
            text: 'The graph shows a parabola. What is the $x$-coordinate of the vertex?',
            image: 'https://y8qn866x1fkileuy.public.blob.vercel-storage.com/images/85b9f244-5abf-4c98-8e67-7ea3207fa0a7_s2m2_q15-jTJgiDAvw6sgkMZMw4mh4n0HpypB7Q.png'
          }
        ],
        createdAt: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { error: 'Test not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Test fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test' },
      { status: 500 }
    )
  }
}