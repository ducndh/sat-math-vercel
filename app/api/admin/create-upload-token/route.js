import { handleUpload } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { pathname } = body

    if (!pathname) {
      return NextResponse.json(
        { error: 'Pathname is required' },
        { status: 400 }
      )
    }

    const jsonResponse = await handleUpload({
      request,
      onBeforeGenerateToken: async (pathname) => {
        // You can add additional validation here
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({
            uploadedBy: 'admin',
            uploadedAt: new Date().toISOString(),
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed:', blob.url)
        // You can perform additional actions here after upload
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Upload token creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create upload token' },
      { status: 500 }
    )
  }
}