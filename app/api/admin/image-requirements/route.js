import { NextResponse } from 'next/server';

export async function GET() {
  const requirements = {
    "June 2025 US 1": [
        { section: "Section 1, Module 1: Reading and Writing", questionId: "11", filename: "june_2025_us_1_s1m1_q11.png", description: "Requires image." },
        { section: "Section 1, Module 1: Reading and Writing", questionId: "13", filename: "june_2025_us_1_s1m1_q13.png", description: "Requires image." },
        { section: "Section 1, Module 2: Reading and Writing", questionId: "10", filename: "june_2025_us_1_s1m2_q10.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "1", filename: "june_2025_us_1_s2m1_q1.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "2", filename: "june_2025_us_1_s2m1_q2.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "6", filename: "june_2025_us_1_s2m1_q6.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "9", filename: "june_2025_us_1_s2m1_q9.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "11", filename: "june_2025_us_1_s2m1_q11.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "22", filename: "june_2025_us_1_s2m1_q22.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "2", filename: "june_2025_us_1_s2m2_q2.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "3", filename: "june_2025_us_1_s2m2_q3.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "9", filename: "june_2025_us_1_s2m2_q9.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "11", filename: "june_2025_us_1_s2m2_q11.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "15", filename: "june_2025_us_1_s2m2_q15.png", description: "Requires image." }
      ],
      "June 2025 US 2": [
        { section: "Section 1, Module 1: Reading and Writing", questionId: "11", filename: "june_2025_us_2_s1m1_q11.png", description: "Requires image." },
        { section: "Section 1, Module 1: Reading and Writing", questionId: "13", filename: "june_2025_us_2_s1m1_q13.png", description: "Requires image." },
        { section: "Section 1, Module 2: Reading and Writing", questionId: "10", filename: "june_2025_us_2_s1m2_q10.png", description: "Requires image." },
        { section: "Section 1, Module 2: Reading and Writing", questionId: "13", filename: "june_2025_us_2_s1m2_q13.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "1", filename: "june_2025_us_2_s2m1_q1.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "2", filename: "june_2025_us_2_s2m1_q2.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "9", filename: "june_2025_us_2_s2m2_q9.png", description: "Requires image." }
      ],
      "March 2025 US 1": [
        { section: "Section 1, Module 1: Reading and Writing", questionId: "14", filename: "march_2025_us_1_s1m1_q14.png", description: "Requires image." },
        { section: "Section 1, Module 2: Reading and Writing", questionId: "9", filename: "march_2025_us_1_s1m2_q9.png", description: "Requires image." },
        { section: "Section 1, Module 2: Reading and Writing", questionId: "11", filename: "march_2025_us_1_s1m2_q11.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "2", filename: "march_2025_us_1_s2m1_q2.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "5", filename: "march_2025_us_1_s2m1_q5.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "21", filename: "march_2025_us_1_s2m1_q21.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "12", filename: "march_2025_us_1_s2m2_q12.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "14", filename: "march_2025_us_1_s2m2_q14.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "10", filename: "march_2025_us_1_s2m2_q10.png", description: "Requires image." }
      ],
      "May 2025 INT 1": [
        { section: "Section 1, Module 1: Reading and Writing", questionId: "11", filename: "may_2025_int_1_s1m1_q11.png", description: "Requires image." },
        { section: "Section 1, Module 1: Reading and Writing", questionId: "12", filename: "may_2025_int_1_s1m1_q12.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "9", filename: "may_2025_int_1_s2m1_q9.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "15", filename: "may_2025_int_1_s2m1_q15.png", description: "Requires image." },
        { section: "Section 2, Module 1: Math", questionId: "18", filename: "may_2025_int_1_s2m1_q18.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "2", filename: "may_2025_int_1_s2m2_q2.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "3", filename: "may_2025_int_1_s2m2_q3.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "4", filename: "may_2025_int_1_s2m2_q4.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "7", filename: "may_2025_int_1_s2m2_q7.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "10", filename: "may_2025_int_1_s2m2_q10.png", description: "Requires image." },
        { section: "Section 2, Module 2: Math", questionId: "12", filename: "may_2025_int_1_s2m2_q12.png", description: "Requires image." }
      ]
  };

  const summary = {
    totalTests: 4,
    totalQuestions: 380,
    totalImagesRequired: 42,
    overallPercentage: 11
  };

  return new Response(JSON.stringify({ success: true, requirements, summary }), {
    headers: { 'Content-Type': 'application/json' },
  });
}