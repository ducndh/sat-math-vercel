/**
 * List Image Requirements Script
 * Fetches test data from Vercel Blob and lists all image requirements.
 */

import { list } from '@vercel/blob';

async function listImageRequirements() {
  console.log('Fetching image requirements from Vercel Blob...');

  try {
    const { blobs } = await list({ prefix: 'tests/', limit: 100 });

    if (blobs.length === 0) {
      console.log('No tests found in Vercel Blob.');
      return;
    }

    for (const blob of blobs) {
      const testDataResponse = await fetch(blob.url);
      const testData = await testDataResponse.json();

      if (testData.imageRequirements && testData.imageRequirements.length > 0) {
        console.log(`\n=== Image Requirements for: ${testData.title} ===`);
        testData.imageRequirements.forEach(req => {
          console.log(
            `  - Question ${req.questionId} in section "${req.section}":`
          );
          console.log(`    Description: ${req.description}`);
          console.log(`    Expected Filename: ${req.filename}`);
        });
      } else {
        console.log(`\nNo image requirements found for: ${testData.title}`);
      }
    }
  } catch (error) {
    console.error('\n❌ Failed to fetch image requirements:', error);
    process.exit(1);
  }
}

listImageRequirements();

