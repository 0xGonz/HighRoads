-- High Road Capital Admin Portal Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE applicant_status AS ENUM ('new', 'in_progress', 'carrier_app', 'pending', 'complete', 'disqualified');
CREATE TYPE admin_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE document_type AS ENUM ('cdl_front', 'cdl_back', 'medical_card', 'mvr');
CREATE TYPE referral_status AS ENUM ('pending', 'approved', 'paid');

-- Applicants table
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  sms_opt_in BOOLEAN DEFAULT false,
  lead_source TEXT,
  referral_code TEXT,

  -- Pre-qualification
  has_cdl BOOLEAN,
  has_medical_card BOOLEAN,
  experience_months INTEGER,
  location_state TEXT,
  us_work_eligible BOOLEAN,

  -- Qualification status
  is_prequalified BOOLEAN DEFAULT false,
  disqualification_reason TEXT,

  -- Pipeline status
  status applicant_status DEFAULT 'new',

  -- Preferences
  ownership_goal TEXT,
  truck_preference TEXT,
  freight_preference TEXT,
  has_existing_carrier BOOLEAN,
  carrier_name TEXT,

  -- Admin fields
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),

  -- Form tracking
  form_step INTEGER DEFAULT 1,
  is_complete BOOLEAN DEFAULT false
);

-- Admin users table (links to Supabase Auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role admin_role DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE SET NULL,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  relationship TEXT,
  status referral_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_applicants_status ON applicants(status);
CREATE INDEX idx_applicants_created_at ON applicants(created_at DESC);
CREATE INDEX idx_applicants_is_prequalified ON applicants(is_prequalified);
CREATE INDEX idx_documents_applicant_id ON documents(applicant_id);
CREATE INDEX idx_activity_log_applicant_id ON activity_log(applicant_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Admin users can read/write applicants
CREATE POLICY "Admin users can view all applicants"
  ON applicants FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

CREATE POLICY "Admin users can insert applicants"
  ON applicants FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow public submissions

CREATE POLICY "Admin users can update applicants"
  ON applicants FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

-- Anonymous users can insert applicants (for public application form)
CREATE POLICY "Anonymous users can submit applications"
  ON applicants FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin users can manage documents
CREATE POLICY "Admin users can view all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

CREATE POLICY "Admin users can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Anonymous can upload documents (for public form)
CREATE POLICY "Anonymous users can upload documents"
  ON documents FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin users policies
CREATE POLICY "Admin users can view themselves"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Activity log policies
CREATE POLICY "Admin users can view activity log"
  ON activity_log FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

CREATE POLICY "Admin users can insert activity log"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (admin_user_id = auth.uid());

-- Referrals policies
CREATE POLICY "Admin users can view referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

CREATE POLICY "Anyone can create referrals"
  ON referrals FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Anonymous users can upload documents"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'documents');

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CRM WORKFLOW TABLES
-- ============================================

-- Add new columns to applicants table for CRM workflow
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS last_response_at TIMESTAMPTZ;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS automation_paused BOOLEAN DEFAULT false;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS preferred_contact_channel TEXT DEFAULT 'email';

-- Create additional types for CRM
CREATE TYPE communication_channel AS ENUM ('email', 'sms');
CREATE TYPE communication_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE communication_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'bounced');
CREATE TYPE event_type AS ENUM ('call', 'meeting', 'follow_up', 'document_review', 'other');
CREATE TYPE event_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE notification_type AS ENUM ('new_application', 'document_upload', 'applicant_response', 'calendar_reminder', 'automation_alert', 'status_change', 'new_booking');
CREATE TYPE trigger_type AS ENUM ('status_change', 'days_in_status', 'missing_documents', 'no_response');

-- Message templates table
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  channel communication_channel NOT NULL,
  category TEXT NOT NULL, -- 'welcome', 'follow_up', 'document_request', 'status_update', 'custom'
  subject TEXT, -- For emails only
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- List of variable names like '{{first_name}}'
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communications history table
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES admin_users(id),
  channel communication_channel NOT NULL,
  direction communication_direction NOT NULL,
  subject TEXT, -- For emails
  body TEXT NOT NULL,
  status communication_status DEFAULT 'pending',
  template_id UUID REFERENCES message_templates(id),
  is_automated BOOLEAN DEFAULT false,
  external_id TEXT, -- Message ID from Resend/Twilio
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation rules table
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type trigger_type NOT NULL,
  trigger_status applicant_status, -- For status-based triggers
  trigger_days INTEGER, -- For time-based triggers (days in status, days since contact)
  action_template_id UUID REFERENCES message_templates(id),
  action_channel communication_channel NOT NULL,
  stop_on_response BOOLEAN DEFAULT true,
  stop_on_status_change BOOLEAN DEFAULT true,
  max_sends INTEGER DEFAULT 1,
  delay_minutes INTEGER DEFAULT 0, -- Delay before sending
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0, -- Higher priority rules execute first
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation executions tracking
CREATE TABLE automation_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  next_scheduled_at TIMESTAMPTZ,
  is_stopped BOOLEAN DEFAULT false,
  stop_reason TEXT, -- 'response', 'status_change', 'max_reached', 'manual'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(automation_id, applicant_id)
);

-- Calendar events table
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES applicants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status event_status DEFAULT 'scheduled',
  reminder_sent BOOLEAN DEFAULT false,
  meeting_link TEXT,
  phone_number TEXT,
  notes TEXT,
  booking_token TEXT UNIQUE, -- For public booking links
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin availability table
CREATE TABLE admin_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(admin_user_id, day_of_week)
);

-- Admin blocked times (vacation, meetings, etc.)
CREATE TABLE admin_blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin notifications table
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  link TEXT, -- Internal link to navigate to
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push notification subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(admin_user_id, endpoint)
);

-- Admin notification preferences
CREATE TABLE admin_notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID UNIQUE NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  -- Email notifications
  email_new_application BOOLEAN DEFAULT true,
  email_document_uploaded BOOLEAN DEFAULT true,
  email_daily_digest BOOLEAN DEFAULT true,
  email_status_change BOOLEAN DEFAULT false,
  -- Push notifications
  push_new_application BOOLEAN DEFAULT true,
  push_document_uploaded BOOLEAN DEFAULT true,
  push_applicant_response BOOLEAN DEFAULT true,
  push_calendar_reminder BOOLEAN DEFAULT true,
  -- In-app settings
  sound_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for new tables
CREATE INDEX idx_communications_applicant_id ON communications(applicant_id);
CREATE INDEX idx_communications_created_at ON communications(created_at DESC);
CREATE INDEX idx_communications_status ON communications(status);
CREATE INDEX idx_automation_executions_applicant ON automation_executions(applicant_id);
CREATE INDEX idx_automation_executions_next ON automation_executions(next_scheduled_at) WHERE is_stopped = false;
CREATE INDEX idx_calendar_events_admin ON calendar_events(admin_user_id);
CREATE INDEX idx_calendar_events_starts ON calendar_events(starts_at);
CREATE INDEX idx_calendar_events_applicant ON calendar_events(applicant_id);
CREATE INDEX idx_admin_notifications_user ON admin_notifications(admin_user_id);
CREATE INDEX idx_admin_notifications_unread ON admin_notifications(admin_user_id) WHERE is_read = false;

-- Triggers for updated_at
CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_notification_settings_updated_at
  BEFORE UPDATE ON admin_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_templates
CREATE POLICY "Admin users can view all templates"
  ON message_templates FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin users can manage templates"
  ON message_templates FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for communications
CREATE POLICY "Admin users can view all communications"
  ON communications FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin users can insert communications"
  ON communications FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- RLS Policies for automation_rules
CREATE POLICY "Admin users can view automation rules"
  ON automation_rules FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin users can manage automation rules"
  ON automation_rules FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for automation_executions
CREATE POLICY "Admin users can view automation executions"
  ON automation_executions FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin users can manage automation executions"
  ON automation_executions FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for calendar_events
CREATE POLICY "Admin users can view their events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid() OR is_admin());

CREATE POLICY "Admin users can manage their events"
  ON calendar_events FOR ALL
  TO authenticated
  USING (admin_user_id = auth.uid());

-- Allow anonymous access to calendar events via booking token
CREATE POLICY "Anyone can view events by booking token"
  ON calendar_events FOR SELECT
  TO anon
  USING (booking_token IS NOT NULL);

-- RLS Policies for admin_availability
CREATE POLICY "Admin users can view availability"
  ON admin_availability FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid() OR is_admin());

CREATE POLICY "Admin users can manage their availability"
  ON admin_availability FOR ALL
  TO authenticated
  USING (admin_user_id = auth.uid());

-- Allow anonymous to view availability for booking
CREATE POLICY "Anyone can view availability for booking"
  ON admin_availability FOR SELECT
  TO anon
  USING (is_active = true);

-- RLS Policies for admin_blocked_times
CREATE POLICY "Admin users can view blocked times"
  ON admin_blocked_times FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid() OR is_admin());

CREATE POLICY "Admin users can manage their blocked times"
  ON admin_blocked_times FOR ALL
  TO authenticated
  USING (admin_user_id = auth.uid());

-- RLS Policies for admin_notifications
CREATE POLICY "Admin users can view their notifications"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid());

CREATE POLICY "Admin users can update their notifications"
  ON admin_notifications FOR UPDATE
  TO authenticated
  USING (admin_user_id = auth.uid());

-- System can insert notifications
CREATE POLICY "System can insert notifications"
  ON admin_notifications FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- RLS Policies for push_subscriptions
CREATE POLICY "Admin users can manage their subscriptions"
  ON push_subscriptions FOR ALL
  TO authenticated
  USING (admin_user_id = auth.uid());

-- RLS Policies for admin_notification_settings
CREATE POLICY "Admin users can view their settings"
  ON admin_notification_settings FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid());

CREATE POLICY "Admin users can manage their settings"
  ON admin_notification_settings FOR ALL
  TO authenticated
  USING (admin_user_id = auth.uid());

-- Insert default message templates
INSERT INTO message_templates (name, channel, category, subject, body, variables) VALUES
('Welcome Email', 'email', 'welcome', 'Welcome to High Road Capital!',
'Hi {{first_name}},

Thank you for applying to our lease-to-own program! We''re excited to help you start your journey to truck ownership.

Your application has been received and our team will review it shortly. Here''s what happens next:

1. We''ll review your qualifications
2. Schedule a quick call to discuss the program
3. Get you matched with the right truck and carrier

If you have any questions, feel free to reply to this email.

Best regards,
The High Road Capital Team',
ARRAY['first_name']),

('Document Request', 'email', 'document_request', 'Documents Needed - High Road Capital',
'Hi {{first_name}},

To move forward with your application, we need a few documents from you:

• CDL (front and back)
• Medical Card
• MVR (Motor Vehicle Record)

Please upload these documents at your earliest convenience.

Best regards,
{{admin_name}}
High Road Capital',
ARRAY['first_name', 'admin_name']),

('Follow-up Check-in', 'email', 'follow_up', 'Checking In - High Road Capital',
'Hi {{first_name}},

I wanted to check in and see how things are going with your application. Is there anything I can help with?

If you have any questions about our lease-to-own program or next steps, I''m here to help.

Best regards,
{{admin_name}}
High Road Capital',
ARRAY['first_name', 'admin_name']),

('Status Update - In Progress', 'email', 'status_update', 'Application Update - High Road Capital',
'Hi {{first_name}},

Great news! Your application is now being processed. We''re reviewing your information and will be in touch soon.

Next steps:
• Complete any remaining documents
• Schedule a call with our team

We''ll keep you updated on your progress.

Best regards,
High Road Capital',
ARRAY['first_name']),

('SMS Welcome', 'sms', 'welcome', NULL,
'Hi {{first_name}}! Thanks for applying to High Road Capital. We received your application and will be in touch soon. Reply STOP to opt out.',
ARRAY['first_name']),

('SMS Follow-up', 'sms', 'follow_up', NULL,
'Hi {{first_name}}, just checking in on your application. Any questions? Call us or reply to this text. - High Road Capital',
ARRAY['first_name']),

('SMS Document Reminder', 'sms', 'document_request', NULL,
'Hi {{first_name}}, we still need your documents to process your application. Please upload them ASAP. Questions? Just reply! - High Road Capital',
ARRAY['first_name'])
ON CONFLICT DO NOTHING;

-- Insert default automation rules
INSERT INTO automation_rules (name, description, trigger_type, trigger_status, trigger_days, action_channel, stop_on_response, max_sends, delay_minutes) VALUES
('New Application Welcome', 'Send welcome email immediately when application is submitted', 'status_change', 'new', NULL, 'email', false, 1, 0),
('Day 3 Check-in', 'Send follow-up email 3 days after application if no response', 'days_in_status', 'new', 3, 'email', true, 1, 0),
('Day 7 SMS Reminder', 'Send SMS reminder 7 days after application if still no response', 'days_in_status', 'new', 7, 'sms', true, 1, 0),
('In Progress Follow-up', 'Send follow-up 3 days after moving to In Progress', 'days_in_status', 'in_progress', 3, 'email', true, 1, 0),
('Document Reminder', 'Remind about missing documents after 5 days', 'missing_documents', NULL, 5, 'email', true, 3, 0)
ON CONFLICT DO NOTHING;
