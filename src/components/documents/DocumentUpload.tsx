'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2, Shield } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const verificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone_last4: z.string().length(4, 'Please enter exactly 4 digits').regex(/^\d{4}$/, 'Must be 4 digits'),
})

type VerificationFormData = z.infer<typeof verificationSchema>

interface DocumentType {
  id: string
  name: string
  description: string
  required: boolean
  accepted: string[]
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'cdl_front',
    name: 'CDL - Front',
    description: 'Clear photo of the front of your CDL',
    required: true,
    accepted: ['.jpg', '.jpeg', '.png', '.pdf'],
  },
  {
    id: 'cdl_back',
    name: 'CDL - Back',
    description: 'Clear photo of the back of your CDL',
    required: true,
    accepted: ['.jpg', '.jpeg', '.png', '.pdf'],
  },
  {
    id: 'medical_card',
    name: 'DOT Medical Card',
    description: 'Current DOT medical examiner\'s certificate',
    required: true,
    accepted: ['.jpg', '.jpeg', '.png', '.pdf'],
  },
  {
    id: 'mvr',
    name: 'Motor Vehicle Record (MVR)',
    description: 'Recent MVR from your state DMV (within 30 days)',
    required: false,
    accepted: ['.pdf'],
  },
]

interface UploadedFile {
  documentType: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function DocumentUpload() {
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  })

  const onVerify = async (data: VerificationFormData) => {
    setIsVerifying(true)
    setVerifyError(null)

    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setVerifyError(result.message || 'Verification failed')
        return
      }

      setIsVerified(true)
      setContactId(result.data?.contactId || null)
      setFirstName(result.data?.firstName || '')
    } catch {
      setVerifyError('Connection error. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleFileSelect = useCallback((documentType: string, file: File) => {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: {
          documentType,
          file,
          status: 'error',
          error: 'File too large. Maximum size is 10MB.',
        },
      }))
      return
    }

    setUploadedFiles((prev) => ({
      ...prev,
      [documentType]: {
        documentType,
        file,
        status: 'pending',
      },
    }))
  }, [])

  const removeFile = useCallback((documentType: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[documentType]
      return newFiles
    })
  }, [])

  const handleSubmitDocuments = async () => {
    setIsSubmitting(true)

    try {
      // Upload each file
      for (const [docType, uploadedFile] of Object.entries(uploadedFiles)) {
        if (uploadedFile.status === 'success') continue

        setUploadedFiles((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: 'uploading' },
        }))

        const formData = new FormData()
        formData.append('file', uploadedFile.file)
        formData.append('documentType', docType)
        if (contactId) formData.append('contactId', contactId)

        try {
          const response = await fetch('/api/documents', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Upload failed')
          }

          setUploadedFiles((prev) => ({
            ...prev,
            [docType]: { ...prev[docType], status: 'success' },
          }))
        } catch (err) {
          setUploadedFiles((prev) => ({
            ...prev,
            [docType]: {
              ...prev[docType],
              status: 'error',
              error: err instanceof Error ? err.message : 'Upload failed',
            },
          }))
        }
      }

      // Check if all required documents are uploaded successfully
      const allRequiredUploaded = DOCUMENT_TYPES
        .filter((d) => d.required)
        .every((d) => uploadedFiles[d.id]?.status === 'success')

      if (allRequiredUploaded) {
        setSubmitSuccess(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const requiredComplete = DOCUMENT_TYPES
    .filter((d) => d.required)
    .every((d) => uploadedFiles[d.id] && uploadedFiles[d.id].status !== 'error')

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents Uploaded!</h2>
        <p className="text-gray-600 mb-6">
          We&apos;ve received your documents and will review them shortly. You&apos;ll receive an email confirmation.
        </p>
        <Button onClick={() => window.location.href = '/status'}>
          Check Application Status
        </Button>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-7 w-7 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
          <p className="text-gray-600">
            Enter your email and phone to access the document upload.
          </p>
        </div>

        <form onSubmit={handleSubmit(onVerify)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Last 4 Digits of Phone"
            type="text"
            maxLength={4}
            placeholder="1234"
            helperText="The phone number you used when applying"
            error={errors.phone_last4?.message}
            {...register('phone_last4')}
          />

          {verifyError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{verifyError}</p>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-green-800">
            Welcome back{firstName ? `, ${firstName}` : ''}! Upload your documents below.
          </p>
        </div>
      </div>

      {/* Document upload cards */}
      <div className="space-y-4">
        {DOCUMENT_TYPES.map((docType) => {
          const uploaded = uploadedFiles[docType.id]

          return (
            <div
              key={docType.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-200 hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {docType.name}
                    {docType.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  <p className="text-sm text-gray-500">{docType.description}</p>
                </div>
                {uploaded?.status === 'success' && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>

              {uploaded ? (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center min-w-0">
                    <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{uploaded.file.name}</span>
                  </div>
                  <div className="flex items-center ml-2">
                    {uploaded.status === 'uploading' && (
                      <Loader2 className="h-5 w-5 text-accent animate-spin" />
                    )}
                    {uploaded.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {uploaded.status === 'error' && (
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                        <span className="text-xs text-red-600">{uploaded.error}</span>
                      </div>
                    )}
                    {uploaded.status !== 'uploading' && (
                      <button
                        type="button"
                        onClick={() => removeFile(docType.id)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-6 cursor-pointer group">
                  <Upload className="h-8 w-8 text-gray-400 group-hover:text-accent transition-colors mb-2" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {docType.accepted.join(', ')} (max 10MB)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept={docType.accepted.join(',')}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(docType.id, file)
                    }}
                  />
                </label>
              )}
            </div>
          )
        })}
      </div>

      {/* Submit button */}
      <Button
        className="w-full"
        onClick={handleSubmitDocuments}
        disabled={!requiredComplete || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Uploading Documents...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 mr-2" />
            Submit Documents
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your documents are encrypted and stored securely. We never share your information.
      </p>
    </div>
  )
}
