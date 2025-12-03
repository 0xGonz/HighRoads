# High Road Technologies - Lease-to-Own Trucking Platform

Phase 1 MVP: Digital intake system for driver applications.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (copy .env.example to .env.local)
cp .env.example .env.local
# Then fill in your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Features

### Landing Page
- Hero section with CTA
- Value propositions
- How it works steps
- Driver testimonials (placeholder)
- FAQ accordion
- Call-to-action sections

### Application Flow
- Multi-step application form
- Pre-qualification logic
- Form validation with Zod
- Disqualification messaging

### Admin Dashboard
- Applicant list with search/filter
- Status management (pipeline)
- Applicant detail view
- Quick contact actions

### Notifications
- Email notifications via Resend
- SMS notifications via Twilio
- Admin alerts on new applications
- Applicant confirmations

## Setup

### 1. Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Copy your project URL and keys from Settings > API

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (Email)
RESEND_API_KEY=re_your_api_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15551234567

# Admin
ADMIN_EMAIL=admin@highroad.com
ADMIN_PHONE=+15559876543
```

### 3. Run Development Server

```bash
npm run dev
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **SMS**: Twilio
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page
│   ├── about/             # About page
│   ├── how-it-works/      # How it works
│   ├── faq/               # FAQ page
│   ├── apply/             # Application form
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── landing/           # Landing page sections
│   ├── forms/             # Form components
│   ├── layout/            # Header, Footer
│   └── admin/             # Admin components
├── lib/
│   ├── supabase.ts        # Database client
│   ├── email.ts           # Email notifications
│   ├── sms.ts             # SMS notifications
│   ├── validations.ts     # Form schemas
│   └── utils.ts           # Utilities
└── types/
    └── applicant.ts       # TypeScript types
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

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
