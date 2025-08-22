
import { list } from '@vercel/blob';

export async function GET(request, { params }) {
  try {
    const { testId } = params;

    if (!testId) {
      return new Response(JSON.stringify({ error: 'Test ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the blob for the specific testId
    const { blobs } = await list({ prefix: `tests/${testId}` });

    if (blobs.length === 0) {
      return new Response(JSON.stringify({ error: 'Test not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In case of duplicates, use the most recent one
    const testBlob = blobs.sort((a, b) => b.uploadedAt - a.uploadedAt)[0];

    const response = await fetch(testBlob.url);
    const testData = await response.json();

    return new Response(JSON.stringify(testData), {
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
