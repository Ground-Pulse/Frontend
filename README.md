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

---

## 📁 Project Architecture & File Structure

```text
groundpulse-frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── onboarding/
│   │   ├── welcome/page.tsx
│   │   └── add-first-property/page.tsx
│   │
│   ├── owner/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── properties/page.tsx
│   │   ├── property/[id]/page.tsx
│   │   ├── inspections/page.tsx
│   │   └── issue/[id]/page.tsx
│   │
│   ├── inspector/
│   │   ├── layout.tsx
│   │   ├── inspections/page.tsx
│   │   └── inspection/[id]/checklist/page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── properties/page.tsx
│   │   ├── inspections/page.tsx
│   │   ├── issues/page.tsx
│   │   ├── repairs/page.tsx
│   │   └── providers/page.tsx
│   │
│   └── provider/
│       ├── layout.tsx
│       ├── jobs/page.tsx
│       └── job/[id]/page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── empty-state.tsx
│   │
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── notification-bell.tsx
│   │   └── role-nav.tsx
│   │
│   ├── property/
│   │   ├── property-card.tsx
│   │   ├── property-form.tsx
│   │   ├── health-score-ring.tsx
│   │   └── inspection-history.tsx
│   │
│   ├── inspection/
│   │   ├── schedule-inspection-form.tsx
│   │   ├── inspection-card.tsx
│   │   ├── checklist-item-row.tsx
│   │   ├── checklist-section.tsx
│   │   ├── media-uploader.tsx
│   │   └── report-card.tsx
│   │
│   ├── issue/
│   │   ├── issue-card.tsx
│   │   ├── issue-detail-card.tsx
│   │   ├── flag-issue-sheet.tsx
│   │   ├── approve-decline-buttons.tsx
│   │   └── repair-status-tracker.tsx
│   │
│   ├── provider/
│   │   ├── job-card.tsx
│   │   └── mark-complete-dialog.tsx
│   │
│   └── admin/
│       ├── live-count-card.tsx
│       ├── drill-down-table.tsx
│       └── reassignment-dialog.tsx
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-properties.ts
│   ├── use-inspections.ts
│   ├── use-checklist.ts
│   ├── use-issues.ts
│   ├── use-repairs.ts
│   ├── use-providers.ts
│   └── use-notifications.ts
│
├── lib/
│   ├── api.ts
│   ├── axios.ts
│   ├── socket.ts
│   ├── query-client.ts
│   ├── validation.ts
│   └── utils.ts
│
├── stores/
│   ├── auth-store.ts
│   ├── checklist-store.ts
│   ├── preferences-store.ts
│   └── realtime-store.ts
│
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── property.ts
│   ├── inspection.ts
│   ├── issue.ts
│   ├── repair.ts
│   ├── provider.ts
│   └── notification.ts
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
├── .env.local.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
