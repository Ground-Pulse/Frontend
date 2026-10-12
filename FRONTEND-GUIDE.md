# GroundPulse Frontend — how it works

My half of the OJT project is the frontend. My teammate builds the backend
(NestJS + Prisma + PostgreSQL). This file explains what I built, where each file
is, and why.

---

## 1. What exists right now

| Route | File | What it is |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing page (hero, how it works, pricing, FAQ…) |
| `/login` | `src/app/login/page.tsx` | Login with role selection (Owner / Inspector) |
| `/owner` | `src/app/owner/page.tsx` | Owner dashboard |
| `/inspector` | `src/app/inspector/page.tsx` | Inspector dashboard |
| `/book-inspection` | `src/app/book-inspection/page.tsx` | Booking form (built earlier) |
| `/sample-report` | `src/app/sample-report/page.tsx` | Sample report view (built earlier) |

---

## 2. Tech stack — and where each piece is actually used

Everything below is from **PRD Section 7.1 (Frontend Web)**.

| Technology | Where I use it | File |
|---|---|---|
| **Next.js 16 (App Router)** | Every page. A folder inside `src/app` = a URL | `src/app/**` |
| **TypeScript** | Every file. All data shapes are typed | `src/lib/types.ts` |
| **Tailwind CSS v4** | All styling, utility classes in JSX | `src/app/globals.css` |
| **TanStack Query** | Fetching + caching dashboard data | `src/app/providers.tsx`, both dashboards |
| **React Hook Form** | Login form state | `src/app/login/page.tsx` |
| **Zod** | Login validation rules | `src/app/login/page.tsx` |
| **Recharts** | Health-score trend line chart | `src/app/owner/page.tsx` |
| **lucide-react** | Icons on the landing page | landing components |

**About shadcn/ui (honest answer if asked):** shadcn/ui is not a normal npm
library — it is a pattern where the component source lives *inside your repo* so
you can edit it. I followed that pattern: my primitives sit in
`src/components/ui/` and use the same `cn()` helper (clsx + tailwind-merge) that
shadcn uses. I have not added the Radix-based components yet because Button,
Card, Badge and Input don't need Radix behaviour. When we add a modal or a
dropdown (Schedule Inspection), that's when Radix/shadcn CLI gets installed.

---

## 3. File structure

```
src/
├── app/                        ← every folder here becomes a URL (App Router)
│   ├── layout.tsx              ← wraps EVERY page: fonts, <body>, Providers
│   ├── providers.tsx           ← creates the TanStack QueryClient
│   ├── globals.css             ← Tailwind import + colour tokens
│   ├── page.tsx                ← "/"          landing page
│   ├── login/page.tsx          ← "/login"     login + role switch
│   ├── owner/page.tsx          ← "/owner"     owner dashboard
│   └── inspector/page.tsx      ← "/inspector" inspector dashboard
│
├── components/
│   ├── ui/                     ← small reusable building blocks
│   │   ├── Button.tsx          ← 3 variants (primary / secondary / ghost)
│   │   ├── Card.tsx            ← white rounded panel
│   │   ├── Badge.tsx           ← status pill + toneForStatus() colour mapper
│   │   ├── Input.tsx           ← text field that shows its validation error
│   │   └── StatCard.tsx        ← one number + label box
│   │
│   ├── dashboard/
│   │   ├── DashboardShell.tsx  ← shared top bar + login guard for both roles
│   │   └── HealthRing.tsx      ← SVG circular health score (0-100)
│   │
│   └── (landing page components: Navbar, HeroSection, Pricing…)
│
└── lib/                        ← logic with no UI inside
    ├── types.ts                ← TypeScript types for every entity
    ├── mock-data.ts            ← fake data standing in for the database
    ├── api.ts                  ← fake API functions (return Promises)
    ├── auth.ts                 ← saves the demo session in localStorage
    └── utils.ts                ← cn() class-merging helper
```

---

## 4. How data flows (the question most likely to be asked)

```
Component (owner/page.tsx)
        │  useQuery({ queryKey: ["properties"], queryFn: api.getProperties })
        ▼
TanStack Query  ── caches the result under the key "properties"
        │
        ▼
src/lib/api.ts  ── getProperties()  (fake: returns a Promise after 500ms)
        │
        ▼
src/lib/mock-data.ts  ── the array of properties
```

**When the backend is ready**, only one line inside `api.ts` changes:

```ts
getProperties: () => fetch(`${API_URL}/properties`).then(r => r.json())
```

No component changes. That separation is the reason `lib/api.ts` exists instead
of calling fetch directly inside the pages.

---

## 5. Page-by-page

### `/login`
1. `useForm({ resolver: zodResolver(loginSchema) })` connects React Hook Form to Zod.
2. `loginSchema` says: email must be a valid email, password at least 6 characters.
3. If validation fails, `errors.email.message` is shown under the field — I never
   wrote an `if` statement for validation.
4. On success: `saveSession()` stores name/email/role, then `router.push()` sends
   the user to `/owner` or `/inspector` based on the selected role.

### `/owner` (PRD US-002, US-005, US-007)
- Three `useQuery` calls: properties, issues, health trend. Each caches separately.
- Property cards show the **health score ring** (`HealthRing.tsx`) — colour rule
  from the PRD: red 0-40, amber 40-70, green 70-100.
- **Recharts** `LineChart` shows the score over 6 months.
- Flagged issues have **Approve / Decline** buttons — this is the PRD rule that no
  repair happens without the owner's explicit approval. Right now the decision is
  stored in React state; with the backend it becomes a `useMutation`.

### `/inspector` (PRD US-004, US-006)
- Assigned jobs with a status badge and a progress bar (`itemsDone / itemsTotal`).
- The checklist is **grouped by room** using `reduce()`, because the inspector
  walks room by room.
- Each row has three buttons: **Pass / Attention / Fail** — the three states the
  PRD defines for a checklist item.
- "Submit checklist" stays disabled until every item has a status.

### `DashboardShell.tsx`
Both dashboards are wrapped in it. It:
- reads the session from localStorage,
- redirects to `/login` if there is none,
- redirects to the correct dashboard if the role doesn't match the page,
- draws the top bar with the user's name and the logout button.

This is the **frontend half** of role-based access (F-011). The backend must
check the role again — a frontend check alone is never security.

---

## 6. Honest limitations (say these before the mentor finds them)

1. **No real backend yet.** All data comes from `src/lib/mock-data.ts`.
2. **Login is not real authentication.** No password is verified; the role is
   stored in localStorage. The PRD specifies Passport.js + JWT on the backend.
3. **Photo upload is not built.** The PRD puts media on AWS S3 — that needs the
   backend's signed URLs.
4. **Socket.IO real-time updates are not wired** — nothing to connect to yet.
5. **Admin and Service Provider dashboards are not built yet** — next sprint.

---

## 7. Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build (currently passes, 7 routes)
npm run lint     # eslint
```

---

## 8. Likely viva questions

**Why Next.js and not plain React?**
File-based routing (a folder = a URL), server-side rendering for the landing
page so it is SEO friendly, and one project for both pages and future API routes.

**What is the App Router?**
Next.js routing where `src/app/owner/page.tsx` automatically becomes `/owner`.
`layout.tsx` wraps every page inside its folder.

**What does "use client" mean at the top of a file?**
Next.js renders on the server by default. `"use client"` marks a component that
needs the browser — state, effects, event handlers. My dashboards and login form
use hooks, so they are client components. The landing page stays server-rendered.

**Why TanStack Query instead of useEffect + useState?**
It gives caching, loading and error states, de-duplicated requests and refetching
for free. With `useEffect` I would hand-write all of that in every component.

**What does `queryKey` do?**
It is the cache ID. Two components asking for `["properties"]` share one cached
result instead of making two network calls.

**Why Zod with React Hook Form?**
The validation rules live in one schema object, and `z.infer` generates the
TypeScript type from that same schema — so the rules and the types can never
drift apart.

**How is the health score ring drawn?**
Two SVG circles. The coloured one uses `strokeDasharray` set to
`circumference × score / 100`, so the arc length equals the percentage.

**How would you connect the real backend?**
Replace the function bodies in `src/lib/api.ts` with `fetch` calls to the NestJS
API and send the JWT in the Authorization header. No component changes.

**Where is the role check?**
`DashboardShell.tsx` on the frontend, and (once built) a CASL guard on the
backend. The frontend check is only for user experience.
