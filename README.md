# High Road Technologies - Lease-to-Own Trucking Platform

Phase 1 MVP: Digital intake system for driver applications with GoHighLevel CRM integration.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Then fill in your GoHighLevel API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Features

### Landing Page
- Hero section with trust badge and CTAs
- Value propositions (4 key benefits)
- How it works (3-step process)
- Driver testimonials carousel with crossfade transitions
- FAQ accordion with smooth animations
- Call-to-action section

### Application Flow
- 4-step application form (Contact → Qualification → Preferences → Review)
- Real-time form validation with Zod
- Pre-qualification logic (CDL, medical card, experience, work eligibility)
- Disqualification screen with helpful guidance
- Success page with next steps
- Partial submission tracking for abandoned form recovery

### CRM Integration (GoHighLevel)
- Automatic contact creation/update
- Custom field mapping for all application data
- Pipeline opportunity creation
- Tagging (prequalified/disqualified, source tracking)
- Abandoned form recovery via partial submissions

### UI/UX
- Responsive design (mobile-first)
- Strategic animations (purposeful, not decorative)
- Accessible form controls with proper focus states
- Loading states and error handling
- Professional B2B trucking aesthetic

## Setup

### 1. GoHighLevel Configuration

1. Create a GoHighLevel account/sub-account
2. Go to Settings > API Keys to get your API key
3. Get your Location ID from Settings > Business Info
4. (Optional) Set up a pipeline for lead tracking

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# GoHighLevel Configuration
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_location_id

# Optional: Pipeline settings
GHL_PIPELINE_ID=your_pipeline_id
GHL_PIPELINE_STAGE_NEW=your_stage_id_for_new

# Optional: Webhook URL (alternative to API)
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **CRM**: GoHighLevel (contacts, pipelines, automations)
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page
│   ├── about/             # About page
│   ├── how-it-works/      # How it works
│   ├── faq/               # FAQ page
│   ├── apply/             # Application form
│   │   ├── page.tsx       # Form page
│   │   └── success/       # Success page
│   ├── admin/             # GHL dashboard redirect
│   └── api/
│       ├── applicants/    # Form submission API
│       └── health/        # Health check endpoint
├── components/
│   ├── ui/                # Button, Input, Checkbox, RadioGroup, Select
│   ├── landing/           # Hero, ValueProps, HowItWorks, Testimonials, FAQ, CTA
│   ├── forms/             # ApplicationForm, step components
│   └── layout/            # Header, Footer
└── lib/
    ├── ghl.ts             # GoHighLevel API client
    ├── validations.ts     # Zod schemas + pre-qualification logic
    └── utils.ts           # Utility functions
```

## API Endpoints

### POST /api/applicants
Submit a new application or partial submission for tracking.

**Request body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "has_cdl": "boolean",
  "has_medical_card": "boolean",
  "experience_months": "number",
  "location_state": "string",
  "us_work_eligible": "boolean",
  "weekly_payment_budget": "string",
  "truck_preference": "string",
  "freight_preference": "string",
  "has_existing_carrier": "boolean",
  "carrier_name": "string (optional)"
}
```

### GET /api/health
Health check endpoint for monitoring.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (GHL_API_KEY, GHL_LOCATION_ID)
4. Deploy

### Manual

```bash
npm run build
npm start
```

## Pre-Deployment Checklist

- [ ] Set GHL_API_KEY and GHL_LOCATION_ID in production environment
- [ ] Update support phone number in ApplicationForm.tsx (currently placeholder)
- [ ] Verify email address (contact@highroadtech.com) is active
- [ ] Test form submission end-to-end with GHL
- [ ] Set up GHL automations for notifications (email/SMS)

## Phase 2+ Roadmap

Future phases will include:
- Driver portal with authentication
- Carrier portal
- Document management
- Payment/settlement tracking
- Escrow ledger
- Carrier matching engine
- Truck inventory management
- Mobile app

## Support

For questions about this codebase, contact the development team.
