import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE_NUMBER

function getTwilioClient() {
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured')
    return null
  }
  return twilio(accountSid, authToken)
}

interface ApplicantSmsData {
  first_name: string
  phone: string
}

export async function sendApplicantConfirmationSms(data: ApplicantSmsData) {
  const client = getTwilioClient()

  if (!client || !twilioPhone) {
    console.warn('SMS notifications not configured')
    return { success: false, error: 'SMS not configured' }
  }

  try {
    await client.messages.create({
      body: `Hi ${data.first_name}! Thanks for applying to High Road Technologies. We've received your application and will contact you within 24 hours. Questions? Call (555) 123-4567`,
      from: twilioPhone,
      to: data.phone,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending applicant SMS:', error)
    return { success: false, error }
  }
}

export async function sendAdminNotificationSms(data: ApplicantSmsData & { last_name: string }) {
  const client = getTwilioClient()
  const adminPhone = process.env.ADMIN_PHONE

  if (!client || !twilioPhone || !adminPhone) {
    console.warn('Admin SMS notifications not configured')
    return { success: false, error: 'Admin SMS not configured' }
  }

  try {
    await client.messages.create({
      body: `New High Road Application: ${data.first_name} ${data.last_name} - Phone: ${data.phone}`,
      from: twilioPhone,
      to: adminPhone,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending admin SMS:', error)
    return { success: false, error }
  }
}

// Format phone number for Twilio (E.164 format)
export function formatPhoneForTwilio(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Add country code if not present
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`
  }

  return `+${cleaned}`
}
