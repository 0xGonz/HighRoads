import { Resend } from 'resend'

// Lazy initialization of Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured')
    return null
  }
  return new Resend(apiKey)
}

interface ApplicantEmailData {
  first_name: string
  last_name: string
  email: string
  phone: string
}

export async function sendApplicantConfirmationEmail(data: ApplicantEmailData) {
  const resend = getResendClient()
  if (!resend) {
    return { success: false, error: 'Email not configured' }
  }

  try {
    await resend.emails.send({
      from: 'High Road Technologies <noreply@highroad.com>',
      to: data.email,
      subject: 'Application Received - High Road Technologies',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a5f; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">High Road Technologies</h1>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #1e3a5f;">Hi ${data.first_name},</h2>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Thank you for applying to the High Road lease-to-own program! We've received your application and are excited to review it.
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e3a5f; margin-top: 0;">What happens next?</h3>
              <ul style="color: #333; font-size: 14px; line-height: 1.8;">
                <li>Our team will review your application within 24 hours</li>
                <li>A team member will call you to discuss next steps</li>
                <li>If pre-approved, you'll get access to browse our truck inventory</li>
              </ul>
            </div>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Have questions? Feel free to call us at <a href="tel:+15551234567" style="color: #f97316;">(555) 123-4567</a>.
            </p>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              We look forward to helping you own your own truck!
            </p>

            <p style="color: #333; font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>The High Road Team</strong>
            </p>
          </div>

          <div style="background-color: #1e3a5f; padding: 15px; text-align: center;">
            <p style="color: #ccc; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} High Road Technologies Partners LLC. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending applicant confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendAdminNotificationEmail(data: ApplicantEmailData) {
  const resend = getResendClient()
  const adminEmail = process.env.ADMIN_EMAIL

  if (!resend) {
    return { success: false, error: 'Email not configured' }
  }

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured')
    return { success: false, error: 'Admin email not configured' }
  }

  try {
    await resend.emails.send({
      from: 'High Road Technologies <noreply@highroad.com>',
      to: adminEmail,
      subject: `New Application: ${data.first_name} ${data.last_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a5f; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Application Received</h1>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #1e3a5f;">Applicant Details</h2>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0; color: #333; border-bottom: 1px solid #eee;">${data.first_name} ${data.last_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #333; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                  <td style="padding: 8px 0; color: #333;"><a href="tel:${data.phone}">${data.phone}</a></td>
                </tr>
              </table>
            </div>

            <p style="color: #333; font-size: 14px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/applicants" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Dashboard
              </a>
            </p>
          </div>

          <div style="background-color: #1e3a5f; padding: 15px; text-align: center;">
            <p style="color: #ccc; font-size: 12px; margin: 0;">
              High Road Technologies - Admin Notification
            </p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return { success: false, error }
  }
}
