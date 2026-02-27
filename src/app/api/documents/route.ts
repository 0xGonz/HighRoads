import { NextRequest, NextResponse } from 'next/server'
import { addDocument, getApplicantDocuments, uploadFile, isDBConfigured } from '@/lib/db'
import type { DocumentType } from '@/types/database'

// Document types and their validation
const VALID_DOCUMENT_TYPES: DocumentType[] = ['cdl_front', 'cdl_back', 'medical_card', 'mvr']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
]

export async function POST(request: NextRequest) {
  try {
    if (!isDBConfigured()) {
      return NextResponse.json(
        { error: 'SERVICE_NOT_CONFIGURED', message: 'Document upload is temporarily unavailable' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentType = formData.get('documentType') as DocumentType | null
    const applicantId = formData.get('applicantId') as string | null

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

    if (!applicantId) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Applicant ID required' },
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
    const filename = `${applicantId}/${documentType}_${timestamp}_${randomId}.${extension}`

    // Upload to Supabase Storage
    const fileUrl = await uploadFile('documents', filename, file)

    // Save document record to database
    const document = await addDocument({
      applicant_id: applicantId,
      type: documentType,
      file_url: fileUrl,
      file_name: file.name,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: document.id,
        filename: file.name,
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

// Get document status for an applicant
export async function GET(request: NextRequest) {
  try {
    if (!isDBConfigured()) {
      return NextResponse.json(
        { error: 'SERVICE_NOT_CONFIGURED', message: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')

    if (!applicantId) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Applicant ID required' },
        { status: 400 }
      )
    }

    const documents = await getApplicantDocuments(applicantId)

    // Map documents to status format
    const documentStatus = VALID_DOCUMENT_TYPES.map((type) => {
      const doc = documents.find(d => d.type === type)
      return {
        type,
        uploaded: !!doc,
        url: doc?.file_url || null,
        fileName: doc?.file_name || null,
        uploadedAt: doc?.uploaded_at || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        applicantId,
        documents: documentStatus,
      },
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to get documents' },
      { status: 500 }
    )
  }
}
