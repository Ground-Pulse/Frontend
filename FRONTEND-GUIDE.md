# GroundPulse Frontend — how it works

My half of the OJT project is the frontend. My teammate builds the backend
(NestJS + Prisma + PostgreSQL). This file explains what is built, where each
file is, and why. Everything maps to the project documentation (PRD, UX, FEA,
API-WEB-01).

---

## 1. Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

The app runs **without the backend** using a built-in mock API
(`NEXT_PUBLIC_USE_MOCK_API=true` in `.env.local`). All data is saved in the
browser's localStorage, so it survives reloads. Settings → "Reset demo data"
restores the sample data.

Demo accounts (password `password123`):

| Role | Email | What to try |
|---|---|---|
| Owner | priya@example.com | approve/decline the flagged leak, schedule an inspection |
| Owner | arvind@example.com | 3-property portfolio |
| Inspector | ravi@example.com | today's Sarjapur job → full checklist → submit |
| Admin | admin@groundpulse.in | assign providers, verification queue, templates, audit log |
| Provider | imran@example.com | job in progress → mark complete |
| Provider | deepa@example.com | locksmith in Mumbai (gets the Andheri job) |

In mock mode the user menu also has a **"Switch demo account"** list.

**Running against the real backend** (separate repo `groundpulse-backend`,
branch `feat/match-frontend-contract`):

1. In the backend: `docker compose up -d`, `npx prisma migrate deploy`,
   `npm run prisma:seed`, `npm run start:dev` (port 3001).
2. Here, in `.env.local`: `NEXT_PUBLIC_USE_MOCK_API=false`
   (`NEXT_PUBLIC_API_BASE_URL` / `NEXT_PUBLIC_WS_URL` already point at :3001).
3. `npm run dev`. Same demo logins (password `password123`).

No component changes — every request goes through `src/lib/apiClient.ts`,
which also refreshes the 15-minute access token automatically.

---

## 2. Routes

| Route | Role | Doc reference |
|---|---|---|
| `/` `/book-inspection` `/sample-report` | public | marketing |
| `/login` `/register` `/onboarding/welcome` | public | onboarding stack |
| `/onboarding/add-property` | Owner | Flow 3 / onboarding |
| `/dashboard` | Owner | UX screen 1, US-002 |
| `/property/[id]` | Owner, Admin | UX screen 2 (health timeline, report, issues, documents) |
| `/schedule` | Owner | inspections list + calendar + .ics export |
| `/issues` | Owner | issues & repairs |
| `/issue/[id]` | all roles | UX screen 6 (approve/decline, repair tracker, messages, audit trail) |
| `/report/[id]` | Owner, Inspector, Admin | US-005 inspection report |
| `/inspections` `/inspections/calendar` `/inspections/history` | Inspector | UX screen 4 |
| `/inspection/[id]/checklist` | Inspector | UX screen 5 (full screen) |
| `/admin/dashboard` `/admin/reassign` `/admin/verification` `/admin/templates` `/admin/audit` | Admin | UX screen 7, US-009, US-011 |
| `/provider/jobs` `/provider/history` | Provider | UX screen 8, US-010 |
| `/notifications` | all roles | UX screen 9 |

`/owner` and `/inspector` (old routes) redirect to the new ones.

---

## 3. Tech stack — where each piece is used

| Technology | Where |
|---|---|
| Next.js 16 App Router, route groups `(owner)` `(inspector)` `(admin)` `(provider)` `(shared)` `(focus)` | `src/app/**` |
| TypeScript strict | everywhere; API types in `src/lib/types.ts` |
| Tailwind v4 + theme tokens (light + dark) | `src/app/globals.css` (`bg-surface`, `text-ink`, `border-line`…) |
| shadcn-style components (source in repo) + Radix Dialog | `src/components/ui/*` |
| TanStack Query (server state) | `src/hooks/use*.ts` |
| Zustand (client state) | `src/stores/*` — auth, preferences, **activeChecklistStore** (offline draft), realtime |
| React Hook Form + Zod | property form, schedule, flag issue, login/register, settings |
| Recharts | `src/components/charts/HealthCharts.tsx` |
| Calendar UI | `src/components/calendar/MonthCalendar.tsx` (date picker + job calendar) |
| Socket.IO client | `src/lib/socket.ts`, wired in `components/providers/RealtimeBridge.tsx` |
| Route guard | `src/proxy.ts` (Next 16 renamed middleware → proxy) + `AppShell` |

---

## 4. Data flow

```
Page (view.tsx)
  └─ hook (src/hooks/useIssues.ts → useApproveIssue)
       └─ apiClient.post("/issues/:id/approve")       src/lib/apiClient.ts
            ├─ mock mode → src/lib/mock/server.ts     (same rules the backend must enforce)
            └─ real mode → fetch(API_URL + path, Bearer JWT)
Socket event "repair.status.updated"
  └─ RealtimeBridge → invalidate TanStack queries → UI updates, toast shown
```

The mock server enforces the same business rules as the spec: role-scoped
data, verified-only assignment (`PROVIDER_NOT_VERIFIED`), repair state machine
(`REPAIR_INVALID_TRANSITION`), past dates rejected, checklist must be complete,
issue needs a photo, audit log on every state change, notifications + socket
events, async report generation (stand-in for the BullMQ job) and recurring
inspections spawning the next one.

---

## 5. Feature checklist (PRD)

Must have: F-001 property registration · F-002 scheduling (one-off/weekly/monthly/quarterly) ·
F-003 room checklist with draft/resume · F-004 photo/video capture · F-005 report ·
F-006 issue flagging · F-007 notifications (bell, page, toasts, channel preference) ·
F-008 approve/decline · F-009 verified provider assignment · F-010 admin dashboard ·
F-011 role-based access · F-012 persistence (mock: localStorage).

Should have: S-013 health score · S-014 inspection timeline · S-015 repair status tracking (live) ·
S-016 provider ratings · S-017 per-issue messaging · S-018 multi-property overview.

Could have: C-019 calendar export (.ics) · C-020 checklist templates (admin) ·
C-021 cost estimates · C-022 document storage.

UX: skeletons, empty and error states with retry, confirm dialogs for high-stakes
actions, dark mode, keyboard-operable status controls, `aria` labels on rings and
badges, reduced-motion support, mobile bottom tabs + bottom sheets.

---

## 6. Backend contract

The backend implements every endpoint the frontend calls, with the same
response shapes as `src/lib/mock/server.ts` (see the backend README's API
table). Errors are `{ code, message, statusCode }`. Socket.IO events
`notification.new`, `repair.status.updated`, `issue.flagged`, `report.ready`,
`inspection.updated`, `dashboard.changed` go to room `user:{id}`. Uploads use
`POST /media/presign` → PUT the file → store `publicUrl`.

---

## 7. Honest limitations

1. Mock mode stores everything in one browser — use the real backend to share data between people/devices.
2. Mock videos/PDFs are session-only blob URLs (images are compressed and persisted).
3. Login is real on the backend (JWT); in mock mode passwords are checked against seed data only.
4. The frontend role check (proxy + AppShell) is UX only — the backend must enforce RBAC with CASL.
