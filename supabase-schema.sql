-- High Road Technologies - Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create applicants table
CREATE TABLE IF NOT EXISTS applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contact info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Pre-qualification
  has_cdl BOOLEAN DEFAULT FALSE,
  has_medical_card BOOLEAN DEFAULT FALSE,
  experience_months INTEGER DEFAULT 0,
  location_state TEXT,
  us_work_eligible BOOLEAN DEFAULT FALSE,

  -- Qualification status
  is_prequalified BOOLEAN DEFAULT FALSE,
  disqualification_reason TEXT,

  -- Pipeline status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'carrier_app', 'pending', 'complete')),

  -- Full application preferences
  weekly_payment_budget TEXT,
  truck_preference TEXT,
  freight_preference TEXT,
  has_existing_carrier BOOLEAN DEFAULT FALSE,
  carrier_name TEXT,

  -- Admin fields
  notes TEXT,
  assigned_to TEXT
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_created_at ON applicants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);

-- Create unique constraint on email (optional - remove if you want to allow duplicate emails)
-- ALTER TABLE applicants ADD CONSTRAINT applicants_email_unique UNIQUE (email);

-- Enable Row Level Security
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access" ON applicants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy for anon users to insert (for public form submission)
CREATE POLICY "Anon users can insert" ON applicants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_applicants_updated_at ON applicants;
CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional - comment out in production)
-- INSERT INTO applicants (first_name, last_name, email, phone, has_cdl, has_medical_card, experience_months, location_state, us_work_eligible, is_prequalified, status, weekly_payment_budget, truck_preference, freight_preference)
-- VALUES
--   ('John', 'Doe', 'john.doe@example.com', '5551234567', true, true, 24, 'TX', true, true, 'new', '500-600', 'sleeper', 'dry-van'),
--   ('Jane', 'Smith', 'jane.smith@example.com', '5559876543', true, true, 36, 'CA', true, true, 'in_progress', '600-700', 'sleeper', 'reefer');
