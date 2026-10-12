# GroundPulse — Remote Property Monitoring & Maintenance Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85" alt="GroundPulse Hero Banner" width="100%" style="border-radius: 24px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Know your home is fine. From anywhere.</strong><br>
  A modern, editorial, conversion-focused web platform built for remote property owners, NRIs, and real-estate investors.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.0-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Design-Editorial_Real_Estate-12452E?style=flat-square" alt="Design" />
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Key Features & Sections](#-key-features--sections)
- [Interactive Routes & Flows](#-interactive-routes--flows)
- [Project Architecture & File Structure](#-project-architecture--file-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Verification Standards & Compliance](#-verification-standards--compliance)
- [Contact & Support](#-contact--support)

---

## 🌟 Overview

**GroundPulse** solves the anxiety and lack of accountability faced by owners living away from their properties—including Non-Resident Indians (NRIs), multi-city real estate investors, and vacation-home owners. 

Instead of relying on distant relatives, busy neighbors, or unvetted caretakers, GroundPulse dispatches verified local field inspectors who follow standardized 22-point digital checklists, capture geotagged and timestamped photo/video evidence, and deliver an auditable health condition report within 48 hours.

### Core Value Pillars:
- **100% Owner Approval Guarantee**: Zero repairs or contractor work without explicit remote digital authorization.
- **48-Hour Turnaround SLA**: Auditable digital scorecard delivered to your WhatsApp and dashboard.
- **Standardized 22-Point Audit**: Inspection across 8 functional and structural property domains.
- **Vetted Local Assessors**: Multi-tier screening protocols for field inspectors.

---

## 🎨 Design System & Aesthetics

GroundPulse uses an editorial real-estate design system that evokes warmth, trustworthiness, and quiet luxury rather than a flashy, dark SaaS template:

### 1. Color Palette

| Token | Hex Code | Purpose |
|---|---|---|
| **Primary Background** | `#FAF8EF` | Warm cream base page canvas |
| **Secondary Background** | `#F3F0E5` | Subtle neutral panels & borders |
| **Card Background** | `#FFFFFF` | Crisp, high-contrast content containers |
| **Primary Forest Green** | `#12452E` | Brand color, primary CTAs, active states |
| **Dark Forest Green** | `#0B3523` | Button hover states, deep text emphasis |
| **Accent Pale Green** | `#DCE9DF` | Icon badges, highlights, pill indicators |
| **Primary Ink** | `#22231F` | High-readability charcoal body & title text |
| **Secondary Ink** | `#6B6B63` | Subtitles, helper text, and secondary details |
| **Borders** | `#E4DFD2` | Thin, warm structural dividers |
| **Status: Success** | `#258653` | Passed checklist checkpoints |
| **Status: Warning** | `#C58A2B` | Attention-needed checklist checkpoints |

### 2. Typography
- **Headlines & Expressive Titles**: **Playfair Display** (`font-serif`) — Timeless, elegant editorial typography.
- **Body & UI Elements**: **Geist Sans** (`font-sans`) — High legibility, crisp metrics, modern clean finish.

### 3. Surface & Geometry
- **Card Borders**: Subtle, warm borders (`1px solid #E4DFD2`).
- **Corner Radii**: Generous, refined curves (`20px`–`36px` for cards and hero).
- **Shadows**: Natural soft ambient shadows (`shadow-natural: 0 4px 20px -2px rgba(34,35,31,0.05)`).

---

## 🚀 Key Features & Sections

The landing page features 12 sequential, conversion-focused sections:

1. **Sticky Navigation**:
   - Forest-green house emblem with status beacon.
   - Links: Home, Services (with dropdown), How it works, Pricing, Sample report, Company (with dropdown).
   - Action: Pill *"Get started"* CTA button + responsive mobile drawer.

2. **Architectural Luxury Villa Hero**:
   - 90–95% viewport width container with `rounded-[32px]`.
   - Real high-resolution contemporary villa exterior photography with dark cinematic readability overlay.
   - Translucent badge: *"First 10 owners get a free inspection →"*.
   - Headline: *"Know your home is fine. From anywhere."*
   - Interactive Address Search Bar with client-side validation and auto-routing to booking.
   - Secondary CTA: *"See a sample report →"*.
   - Trust strip: *"Live in Bengaluru"* | *"Homes · Plots · Apartments"* | *"Your approval comes first"*.
   - Floating property status card for *"Ancestral Apartment"* featuring an **84/100 circular health gauge**.

3. **Trust & Peace-of-Mind Panel ("Why you can relax")**:
   - Large white rounded rectangular panel.
   - 3-column × 2-row feature grid with pale-green icon badges:
     - *You know who's coming.*
     - *Nobody enters without your OK.*
     - *Every room is documented.*
     - *Watch remotely.*
     - *Nothing happens without your approval.*
     - *Your property deserves care.* (Highlighted in soft pale-green `#F0F6F2`).

4. **How It Works (5-Step Process with Real React UI Previews)**:
   - `01 Add your property`: Micro property selector UI preview.
   - `02 Schedule an inspection`: Date and slot confirmation preview.
   - `03 Meet your verified inspector`: Assigned assessor badge preview.
   - `04 Review your inspection report`: Scorecard summary preview.
   - `05 Approve the next steps`: Interactive *Approve / Decline* buttons.

5. **What We Inspect (8 Domain Categories)**:
   - Plumbing & water leakage
   - Electrical safety
   - Security & locks
   - Pest indications
   - Cleanliness & upkeep
   - Seepage & dampness
   - Windows & doors
   - Visible structural concerns
   - Includes transparent visual inspection scope disclosure.

6. **Sample Inspection Report Preview**:
   - Document-style report preview for *Whitefield Apartment*.
   - Overall health score (84/100), 18 Passed, 3 Attention, 1 Failed.
   - Flagged issue: *Bathroom water leakage* (High severity, *"Estimated repair cost: Available after assessment"*).
   - Three photo evidence thumbnails and verified inspector recommendation.
   - CTA: *"View full sample report →"*.

7. **Inspector Verification Standards**:
   - Two-column layout with high-resolution field inspection photography.
   - 6-point verification standards checklist: Identity verification, Address verification, Reference checks, Background checks, Supervised trial inspections, and Ongoing reviews.

8. **Transparent Pricing Section**:
   - **One-Time Inspection**: ₹1,499 per visit.
   - **Quarterly Plan**: ₹3,999 per quarter (*Most popular*, highlighted in `#F0F6F2`).
   - **Annual Care Plan**: ₹12,999 per year.
   - Mandatory guarantee note: *"Repair costs are always presented for owner approval before work is assigned."*

9. **Testimonials**:
   - Three initials-based avatar cards for Ananya R. (Dubai NRI), Rahul M. (Bengaluru investor), and Meera S. (Mysuru vacation homeowner).

10. **Interactive FAQ**:
    - Accessible accordion answering all 6 core questions with minimal `#E4DFD2` dividers.

11. **Final Conversion CTA**:
    - Deep forest-green panel (`#12452E`, `rounded-[32px]`) with primary booking CTA and sample report link.

12. **Warm Cream Footer**:
    - Logo, brand description, Navigation links, Support & Legal links, `support@groundpulse.in`, and copyright © 2026 GroundPulse.

---

## 🔗 Interactive Routes & Flows

### 1. `/book-inspection`
Multi-step inspection booking workflow:
- **Address Auto-Prefill**: Automatically populates addresses passed via query parameter (e.g., `/book-inspection?address=Indiranagar%2C%20Bengaluru`).
- **Property Type**: Single-click selector for Apartment, Villa, Commercial, or Vacant Plot.
- **Service City**: Coverage across Bengaluru, Mumbai & MMR, Pune, Delhi NCR, Hyderabad, Chennai, and Goa.
- **Package Selection**: One-Time (₹1,499), Quarterly (₹3,999), or Annual (₹12,999).
- **Owner Contact**: NRI WhatsApp international phone format (+91, +1, +44, +971, +65).
- **Confirmation State**: Clear booking request confirmation screen.

### 2. `/sample-report`
Full interactive digital property inspection document:
- **84/100 Health Score Dial**: Circular SVG indicator with status badges.
- **Interactive Checkpoint Filters**: Filter by *All Checks (11)*, *Passed (7)*, *Attention (3)*, or *Failed (1)*.
- **Flagged Issue Remote Approval**: Interactive *"Authorize Plumber Assessment"* button with state updates.
- **Photo Evidence Gallery**: High-res inspection photos with timestamped captions.
- **PDF Download Action**: Instant download notification for official inspection certificate.

### 3. `/login`
Role-based login screen (PRD F-011):
- **Role switch**: Owner or Inspector, which decides the dashboard opened after login.
- **React Hook Form + Zod**: email format and minimum password length validated by a schema.
- **Demo session**: the chosen role is saved in `localStorage` until the NestJS + JWT backend is ready.

### 4. `/owner` — Owner Dashboard
Implements PRD US-002, US-005 and US-007:
- **Counts row**: properties, open issues, average health score, next inspection.
- **Property cards**: each with an SVG health-score ring (red 0-40, amber 40-70, green 70-100).
- **Health trend chart**: six-month line chart built with Recharts.
- **Approve / Decline**: flagged issues cannot become repairs without the owner's explicit decision.

### 5. `/inspector` — Inspector Dashboard
Implements PRD US-004 and US-006:
- **Assigned jobs**: status badge, date and a progress bar (`itemsDone / itemsTotal`).
- **Checklist grouped by room**: matches how an inspector walks through a property.
- **Pass / Attention / Fail** on every row; *Submit checklist* unlocks only when all items have a status.

---

## 📁 Project Architecture & File Structure

This is the **actual** structure in the repository today.

```text
GroundPulse-Frontend/
├── src/
│   ├── app/                        # App Router: every folder = one URL
│   │   ├── layout.tsx              # wraps every page (fonts, body, Providers)
│   │   ├── providers.tsx           # creates the TanStack Query client
│   │   ├── globals.css             # Tailwind import + colour tokens
│   │   ├── page.tsx                # "/"            landing page
│   │   ├── login/page.tsx          # "/login"       login + role switch
│   │   ├── owner/page.tsx          # "/owner"       owner dashboard
│   │   ├── inspector/page.tsx      # "/inspector"   inspector dashboard
│   │   ├── book-inspection/page.tsx
│   │   └── sample-report/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                     # small reusable building blocks
│   │   │   ├── Button.tsx          # 3 variants: primary / secondary / ghost
│   │   │   ├── Card.tsx            # white rounded panel
│   │   │   ├── Badge.tsx           # status pill + toneForStatus() colour map
│   │   │   ├── Input.tsx           # text field that renders its own error
│   │   │   └── StatCard.tsx        # one number + label box
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardShell.tsx  # shared top bar + login guard
│   │   │   └── HealthRing.tsx      # SVG circular health score
│   │   │
│   │   └── (landing page sections: Navbar, HeroSection, TrustSection,
│   │        HowItWorks, WhatWeInspect, SampleReportPreview,
│   │        InspectorVerification, PricingSection, Testimonials,
│   │        FAQSection, FinalCTA, Footer)
│   │
│   └── lib/                        # logic, no UI
│       ├── types.ts                # TypeScript types for every entity
│       ├── mock-data.ts            # sample data standing in for the database
│       ├── api.ts                  # fake API functions (return Promises)
│       ├── auth.ts                 # demo session in localStorage
│       └── utils.ts                # cn() class-merge helper
│
├── public/
├── FRONTEND-GUIDE.md               # how everything works, for reviews
├── next.config.ts
├── package.json
└── tsconfig.json
```

### Planned for later sprints (not built yet)

`admin/` and `provider/` dashboards, property detail and issue detail pages,
media upload, Socket.IO real-time updates, and the `hooks/` + `stores/` folders
that will appear once the backend API exists.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data fetching & caching**: [TanStack Query](https://tanstack.com/query) (`useQuery` in both dashboards)
- **Forms**: [React Hook Form](https://react-hook-form.com/) (login form state)
- **Validation**: [Zod](https://zod.dev/) (login schema, via `@hookform/resolvers`)
- **Charts**: [Recharts](https://recharts.org/) (owner health-score trend)
- **Class merging**: `clsx` + `tailwind-merge` (the `cn()` helper in `src/lib/utils.ts`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (*Playfair Display* & *Geist Sans*)

> **Note on shadcn/ui:** the PRD lists shadcn/ui. shadcn is a *pattern*, not a
> runtime dependency — components live inside your own repo so you can edit
> them. `src/components/ui/` follows that pattern and uses the same `cn()`
> helper. The Radix-based shadcn components will be added when we need a modal
> or dropdown (e.g. Schedule Inspection).

---

## 📊 Current Status

| Area | Status |
|---|---|
| Landing page, booking form, sample report | ✅ Built |
| Login with role switch | ✅ Built |
| Owner dashboard | ✅ Built |
| Inspector dashboard | ✅ Built |
| Data source | ⚠️ Mock data in `src/lib/mock-data.ts` — no backend yet |
| Authentication | ⚠️ Demo only (localStorage). Real auth = Passport.js + JWT on the backend |
| Photo/video upload | ❌ Needs backend S3 signed URLs |
| Real-time updates (Socket.IO) | ❌ Needs backend |
| Admin & Service Provider dashboards | ❌ Next sprint |

Backend (NestJS + Prisma + PostgreSQL) is developed separately in the
[Backend repository](https://github.com/Ground-Pulse/Backend). When its endpoints
are ready, only the function bodies in `src/lib/api.ts` change — no component is
touched.

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: `v18.18.0` or higher (Node `v20+` recommended)
- **Package Manager**: `npm` (v9+), `pnpm`, or `yarn`

### 1. Clone the repository

```bash
git clone https://github.com/your-username/groundpulse-frontend.git
cd groundpulse-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create a production build

```bash
npm run build
npm run start
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="GroundPulse"

# API & Backend
NEXT_PUBLIC_API_BASE_URL=https://api.groundpulse.in/v1
NEXT_PUBLIC_SOCKET_URL=wss://api.groundpulse.in

# Support
NEXT_PUBLIC_SUPPORT_EMAIL=support@groundpulse.in
```

---

## 🛡️ Verification Standards & Compliance

GroundPulse adheres strictly to truthful representation and transparent disclosures:
- **Visual Assessment Disclaimer**: Visual audits do not replace or substitute licensed structural engineering, electrical load certifications, or government statutory assessments.
- **Owner Consent Policy**: No repairs, modifications, or vendor dispatch take place without explicit owner approval.
- **Illustrative Demonstration Copy**: Testimonials and mock inspection reports are labeled as demonstration workflows.

---

## 📧 Contact & Support

For customer assistance, corporate partnerships, or service inquiries:

- **Email**: [support@groundpulse.in](mailto:support@groundpulse.in)
- **Operating Metros**: Bengaluru • Mumbai & MMR • Pune • Delhi NCR • Hyderabad • Chennai • Goa
- **Copyright**: © 2026 GroundPulse. All rights reserved.
