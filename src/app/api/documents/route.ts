import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { addTags, updateContact, isGHLConfigured } from '@/lib/ghl'

// Document types and their validation
const VALID_DOCUMENT_TYPES = ['cdl_front', 'cdl_back', 'medical_card', 'mvr']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentType = formData.get('documentType') as string | null
    const contactId = formData.get('contactId') as string | null

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'No file provided' },
        { status: 400 }
      )
    }

    if (!documentType || !VALID_DOCUMENT_TYPES.includes(documentType)) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Invalid document type' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Invalid file type. Please upload JPG, PNG, or PDF.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'pdf'
    const filename = `${documentType}_${timestamp}_${randomId}.${extension}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'documents')
    await mkdir(uploadsDir, { recursive: true })

    // Save file locally (can be replaced with S3/R2 upload)
    const filePath = join(uploadsDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate file URL (for local development)
    // In production, this would be an S3/R2 URL
    const fileUrl = `/uploads/documents/${filename}`

    // Update GHL contact if we have a contact ID
    if (contactId && isGHLConfigured()) {
      try {
        // Add document tag
        await addTags(contactId, [`document_${documentType}_uploaded`])

        // Update custom field with document URL
        await updateContact(contactId, {
          customFields: {
            [`document_${documentType}_url`]: fileUrl,
            [`document_${documentType}_uploaded_at`]: new Date().toISOString(),
          },
        })

        // Check if all required documents are uploaded
        // This would need to query GHL to check all document fields
      } catch (ghlError) {
        console.error('Error updating GHL contact:', ghlError)
        // Don't fail the upload if GHL update fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        filename,
        url: fileUrl,
        documentType,
        size: file.size,
      },
    })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

// Get document status for a contact
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const contactId = searchParams.get('contactId')

  if (!contactId) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: 'Contact ID required' },
      { status: 400 }
    )
  }

  // In a real implementation, query GHL or database for document status
  // For now, return a placeholder response
  return NextResponse.json({
    success: true,
    data: {
      contactId,
      documents: VALID_DOCUMENT_TYPES.map((type) => ({
        type,
        uploaded: false,
        url: null,
      })),
    },
  })
}
