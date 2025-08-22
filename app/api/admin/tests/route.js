
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // Get all test blobs
    const { blobs } = await list({ prefix: 'tests/', limit: 1000 });
    console.log('Blobs found:', blobs); // For debugging
    const tests = [];

    // Fetch all tests
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const test = await response.json();
        if (test) {
          tests.push({
            testId: test.testId,
            title: test.title,
            totalQuestions: test.questions?.length || 0,
            createdAt: test.createdAt
          });
        }
      } catch (err) {
        console.warn('Failed to parse test blob:', blob.pathname, err); // Error logging
      }
    }

    // Sort by creation date (newest first)
    tests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Returning tests:', tests); // For debugging

    return new Response(JSON.stringify({ tests, total: tests.length }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Tests fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tests' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
