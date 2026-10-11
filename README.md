# Frontend

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
