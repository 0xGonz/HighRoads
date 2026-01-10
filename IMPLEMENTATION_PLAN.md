# High Road Partners MVP Enhancement Plan

## Overview
This plan adds 7 key features to enhance user engagement, trust, and conversion for the High Road Partners lease-to-own trucking platform.

---

## Feature 1: Application Status Tracking

### What It Does
Allows applicants to check their application status using email + phone verification (last 4 digits).

### Files to Create/Modify
- `src/app/status/page.tsx` - Status lookup page
- `src/app/api/status/route.ts` - API endpoint to fetch status from GHL
- `src/lib/ghl.ts` - Add `getContactStatus()` function
- `src/components/landing/Hero.tsx` - Add "Check Status" link

### Implementation Details
1. Create lookup form (email + last 4 digits of phone)
2. Query GHL contact by email, verify phone match
3. Display status based on GHL tags/pipeline stage:
   - "Application Received" (new_application tag)
   - "Under Review" (in_review tag)
   - "Documents Needed" (documents_needed tag)
   - "Approved" (approved tag)
   - "In Progress with Carrier" (carrier_matched tag)
4. Show next steps based on current status

### GHL Custom Fields Needed
- `application_status` (dropdown): new, reviewing, documents_needed, approved, carrier_matching, active

---

## Feature 2: Document Upload

### What It Does
Allows applicants to upload CDL, medical card, and MVR documents during or after application.

### Files to Create/Modify
- `src/app/documents/page.tsx` - Document upload page (post-application)
- `src/app/documents/[token]/page.tsx` - Secure upload via email link
- `src/app/api/documents/route.ts` - Handle file uploads
- `src/app/api/documents/presign/route.ts` - Generate presigned S3/GHL URLs
- `src/components/forms/DocumentUpload.tsx` - Reusable upload component
- `src/components/forms/steps/StepDocuments.tsx` - Optional step in application form
- `src/lib/storage.ts` - File storage utilities (S3 or GHL)

### Implementation Details
1. Support file types: PDF, JPG, PNG (max 10MB each)
2. Required documents:
   - CDL (front and back)
   - DOT Medical Card
   - MVR (Motor Vehicle Record) - optional at application
3. Generate secure upload token sent via email after application
4. Store files in S3 or attach to GHL contact
5. Update GHL contact with document status tags

### Dependencies
- AWS S3 or Cloudflare R2 for file storage (or use GHL's file attachment API)
- Add env vars: `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

---

## Feature 3: Trust Elements

### What It Does
Adds social proof and credibility indicators throughout the site.

### Files to Create/Modify
- `src/components/landing/TrustBadges.tsx` - Certification badges section
- `src/components/landing/CarrierLogos.tsx` - Partner carrier logos
- `src/components/landing/Testimonials.tsx` - Update with photo support
- `src/app/page.tsx` - Add new sections
- `public/images/carriers/` - Carrier logo images
- `public/images/testimonials/` - Testimonial photos
- `public/images/badges/` - Trust badge images

### Implementation Details
1. **Carrier Logos Section**
   - Grid of partner carrier logos
   - "Our Carrier Partners" heading
   - Placeholder logos initially, replace with real ones

2. **Trust Badges**
   - BBB Accredited Business (or "A+ Rating" style badge)
   - "FMCSA Registered"
   - "500+ Drivers Helped"
   - "4.8/5 Driver Satisfaction"

3. **Testimonial Photos**
   - Update Testimonials component to support photos
   - Add placeholder avatar if no photo
   - Show name, location, and time as owner-operator

---

## Feature 4: Ownership Calculator Widget

### What It Does
Interactive calculator showing path to ownership with payment timeline and equity buildup.

### Files to Create/Modify
- `src/app/calculator/page.tsx` - Dedicated calculator page
- `src/components/calculator/OwnershipCalculator.tsx` - Main calculator component
- `src/components/calculator/PaymentSlider.tsx` - Weekly payment input
- `src/components/calculator/EquityChart.tsx` - Visual equity growth
- `src/components/calculator/ResultsSummary.tsx` - Ownership timeline
- `src/components/landing/CalculatorPreview.tsx` - Mini version for landing page

### Implementation Details
1. **Inputs:**
   - Weekly payment amount (slider: $500-$900)
   - Truck value estimate ($80,000-$150,000)
   - Down payment (default $0, allow adjustment)

2. **Outputs:**
   - Months to ownership
   - Total paid over term
   - Equity buildup visualization (chart)
   - Monthly equity growth rate
   - Comparison vs traditional leasing

3. **CTA:** "Start Your Application" button at bottom

### Formulas
- Base term: Truck Value / (Weekly Payment * 4.33)
- Equity per month: Weekly Payment * 4.33 * 0.85 (15% goes to maintenance reserve)
- Ownership date: Today + calculated months

---

## Feature 5: Blog/Resources Section

### What It Does
SEO-optimized content hub for trucking industry education.

### Files to Create/Modify
- `src/app/resources/page.tsx` - Resources hub page
- `src/app/resources/[slug]/page.tsx` - Individual article page
- `src/components/blog/ArticleCard.tsx` - Article preview card
- `src/components/blog/ArticleList.tsx` - Article grid
- `src/components/blog/TableOfContents.tsx` - In-article navigation
- `src/lib/blog.ts` - MDX/content utilities
- `content/resources/` - MDX article files

### Implementation Details
1. **Initial Articles (5-7):**
   - "Lease-to-Own vs Traditional Leasing: What's the Difference?"
   - "How to Become an Owner-Operator in 2024"
   - "Understanding Your MVR and Why It Matters"
   - "What to Look for in a Lease-to-Own Program"
   - "Building Credit as a Truck Driver"
   - "Tax Benefits of Truck Ownership"

2. **SEO Features:**
   - Meta descriptions per article
   - Schema markup for articles
   - Sitemap generation
   - Open Graph images

3. **Components:**
   - Article cards with featured image, title, excerpt
   - Category filtering
   - Related articles section
   - CTA banner within articles

### Dependencies
- `next-mdx-remote` or `contentlayer` for MDX processing
- Add to package.json

---

## Feature 6: Referral Program Page

### What It Does
Driver referral program to incentivize word-of-mouth growth.

### Files to Create/Modify
- `src/app/referrals/page.tsx` - Referral program page
- `src/app/api/referrals/route.ts` - Handle referral submissions
- `src/components/referrals/ReferralForm.tsx` - Referral submission form
- `src/components/referrals/ReferralStats.tsx` - Show referrer's stats (if logged in)
- `src/lib/ghl.ts` - Add referral tracking functions

### Implementation Details
1. **How It Works:**
   - Existing drivers share unique referral link or code
   - New applicant enters referrer's info during application
   - Both parties tracked in GHL

2. **Referral Form Fields:**
   - Referrer name
   - Referrer email or phone
   - Referred driver's name
   - Referred driver's phone
   - Relationship (co-worker, friend, family, other)

3. **GHL Integration:**
   - Tag referrals with `referred_by_{contact_id}`
   - Custom field for referrer contact ID
   - Track referral count per contact

4. **Incentive Display:**
   - "$500 bonus when your referral completes 90 days"
   - "Unlimited referrals - no cap on earnings"

---

## Feature 7: SMS Opt-in Enhancement

### What It Does
Explicit SMS opt-in during application with clear consent language.

### Files to Create/Modify
- `src/components/forms/steps/StepContact.tsx` - Add SMS opt-in checkbox
- `src/lib/validations.ts` - Add sms_opt_in field
- `src/types/applicant.ts` - Update type
- `src/lib/ghl.ts` - Pass SMS consent to GHL

### Implementation Details
1. **Checkbox in Step 1 (Contact Info):**
   ```
   [ ] I agree to receive text message updates about my application
       Message & data rates may apply. Reply STOP to unsubscribe.
   ```

2. **Store in GHL:**
   - Custom field: `sms_opt_in` (boolean)
   - Tag: `sms_opted_in` or `sms_opted_out`

3. **Legal Compliance:**
   - Clear TCPA-compliant language
   - Link to SMS terms
   - Default unchecked (opt-in, not opt-out)

---

## Feature 8: Application Form Enhancement - Referral Field

### What It Does
Add optional "How did you hear about us?" and referral code field to application.

### Files to Create/Modify
- `src/components/forms/steps/StepContact.tsx` - Add referral/source fields
- `src/lib/validations.ts` - Add new fields
- `src/types/applicant.ts` - Update type

### Implementation Details
1. **Fields to Add (Step 1):**
   - "How did you hear about us?" (dropdown)
     - Google Search
     - Facebook
     - Friend/Family Referral
     - Current Driver Referral
     - Trucking Forum
     - Job Board
     - Other
   - "Referral Code" (optional text field, shown if referral selected)

2. **Track in GHL:**
   - Custom field: `lead_source`
   - Custom field: `referral_code`
   - Tag based on source

---

## Implementation Order (Recommended)

### Phase A: Quick Wins (1-2 days each)
1. **SMS Opt-in** - Simple checkbox addition
2. **Trust Elements** - Static content, high visual impact
3. **Referral Source Field** - Simple form field addition

### Phase B: Core Features (2-3 days each)
4. **Application Status Tracking** - High user value
5. **Referral Program Page** - Growth driver
6. **Calculator Widget** - Conversion booster

### Phase C: Content & Documents (3-5 days each)
7. **Document Upload** - Requires file storage setup
8. **Blog/Resources** - Requires content creation

---

## Environment Variables Needed

```env
# Existing
GHL_API_KEY=xxx
GHL_LOCATION_ID=xxx

# New - for document uploads (choose one)
AWS_S3_BUCKET=highroad-documents
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1

# OR use Cloudflare R2
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET=highroad-documents
```

---

## GHL Custom Fields to Create

Before implementation, create these custom fields in GoHighLevel:

1. `application_status` - Dropdown (new, reviewing, documents_needed, approved, carrier_matching, active)
2. `sms_opt_in` - Checkbox
3. `lead_source` - Dropdown
4. `referral_code` - Text
5. `referred_by_contact_id` - Text
6. `documents_cdl` - Text (file URL)
7. `documents_medical` - Text (file URL)
8. `documents_mvr` - Text (file URL)
9. `documents_complete` - Checkbox

---

## Ready to Start?

Reply with which feature to implement first, or say "start" to begin with Phase A (SMS Opt-in, Trust Elements, Referral Source Field).
