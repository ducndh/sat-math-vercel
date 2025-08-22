import { list } from '@vercel/blob';

function structureTest(testData) {
  const sections = {};

  for (const q of testData.questions) {
    if (!sections[q.section]) {
      sections[q.section] = {};
    }
    if (!sections[q.section][q.module]) {
      sections[q.section][q.module] = [];
    }
    sections[q.section][q.module].push(q);
  }

  const structuredSections = Object.keys(sections).map(sectionName => {
    const modules = Object.keys(sections[sectionName]).map(moduleNumber => ({
      moduleNumber: parseInt(moduleNumber),
      timeLimit: 35, // Assuming 35 minutes per module
      questions: sections[sectionName][moduleNumber].sort((a, b) => a.questionNumber - b.questionNumber),
    }));
    return { name: sectionName, modules };
  });

  return {
    ...testData,
    sections: structuredSections,
    questions: undefined, // Remove the flat questions array
  };
}

export async function GET(request, { params }) {
  try {
    const { testId } = params;

    if (!testId) {
      return new Response(JSON.stringify({ error: 'Test ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { blobs } = await list({ prefix: `tests/${testId}` });

    if (blobs.length === 0) {
      return new Response(JSON.stringify({ error: 'Test not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const testBlob = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
    const response = await fetch(testBlob.url);
    const flatTestData = await response.json();

    const structuredTestData = structureTest(flatTestData);

    return new Response(JSON.stringify(structuredTestData), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Test fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch test' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}