# Ze[hub] — Developer Handoff

> **Ze[hub]** is an enterprise hiring operations platform built on Next.js 14 (App Router). It combines three tightly integrated product surfaces: **Ze[hire]** (hiring pipeline), **Ze[meet]** (live video interviews), and **Ze[code]** (assessments & question pool).

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Application Modules](#application-modules)
5. [Routing Reference](#routing-reference)
6. [Authentication & Roles](#authentication--roles)
7. [State Management](#state-management)
8. [Design System & Tokens](#design-system--tokens)
9. [Data Layer](#data-layer)
10. [Key Workflows](#key-workflows)
11. [Environment Variables](#environment-variables)
12. [Scripts Reference](#scripts-reference)
13. [Conventions](#conventions)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.18 |
| Language | TypeScript | 5.6.3 |
| Runtime | React | 18.3.1 |
| Styling | Tailwind CSS | 3.4.1 |
| Animation | Framer Motion | 12.40.0 |
| Icons | Lucide React | 0.460.0 |
| UI Primitives | Radix UI | various |
| State | Zustand | 5.0.13 |
| Auth | NextAuth.js | 4.24.10 |
| ORM | Prisma | 5.22.0 |
| Database | SQLite (dev) | — |
| Forms | React Hook Form + Zod | 7.76 + 4.4 |
| Toasts | Sonner | 2.0.7 |
| Charts | Recharts | 2.15.4 |
| PDF | @react-pdf/renderer | 3.4.4 |
| Storybook | @storybook/nextjs | 10.4.0 |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/munavarirfan-ux/Zecode-3.0.git
cd Zecode-3.0
npm install
```

### Database Setup

```bash
cp .env.example .env          # fill in values — see Environment Variables section
npm run db:generate           # generate Prisma client
npm run db:push               # push schema to SQLite
npm run db:seed               # seed demo data (optional)
```

### Run Dev Server

```bash
npm run dev                   # http://localhost:3001
```

> The dev server runs on **port 3001** (configured in `.claude/launch.json`). Claude Code uses `npm run dev` via the `zecode-dev` launch config.

### Other Useful Commands

```bash
npm run dev:clean             # kill port + restart dev server
npm run dev:fresh             # clear cache + restart
npm run build                 # production build
npm run db:studio             # Prisma Studio UI at :5555
npm run storybook             # component explorer at :6006
```

---

## Project Structure

```
Zecode-3.0/
├── prisma/
│   ├── schema.prisma          # database schema
│   └── seed.ts                # demo data seeder
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── (dashboard)/       # protected dashboard layout group
│   │   │   ├── layout.tsx     # AppShell wrapper
│   │   │   ├── dashboard/     # Ze[hub] overview
│   │   │   ├── hiring/        # Ze[hire] — jobs pipeline
│   │   │   ├── candidates/    # candidate directory
│   │   │   ├── applicants/    # applicants view
│   │   │   ├── interviews/    # interview management
│   │   │   ├── assessments/   # Ze[code] assessments
│   │   │   ├── schedules/     # assessment drive
│   │   │   ├── question-pool/ # question library
│   │   │   └── settings/      # org & user settings
│   │   ├── meet/[roomId]/     # Ze[meet] live room (public route)
│   │   ├── api/               # API route handlers
│   │   ├── login/             # auth page
│   │   └── page.tsx           # root redirect
│   ├── components/
│   │   ├── ui/                # Radix-based primitive components (23 components)
│   │   ├── dashboard/         # Ze[hub] dashboard widgets
│   │   ├── hiring/            # Ze[hire] components (55+ files)
│   │   ├── zemeet/            # Ze[meet] room components (30+ files)
│   │   ├── onboarding/        # new user onboarding flow
│   │   └── AppShell.tsx       # root layout (sidebar, topbar, theme)
│   ├── config/
│   │   ├── previewRole.ts     # role enum & display config
│   │   ├── navigationByRole.ts# sidebar nav per role
│   │   ├── dashboardByRole.ts # dashboard widgets per role
│   │   ├── dashboardHeroByRole.ts # hero KPIs per role
│   │   └── routes.ts          # typed route constants (ROUTES.hiringJob(id) etc.)
│   ├── context/
│   │   └── RoleContext.tsx    # preview role React context
│   ├── features/
│   │   ├── dashboard/         # dashboard mock data
│   │   ├── question-pool/     # question pool feature module
│   │   └── settings/          # settings feature module
│   ├── hooks/                 # shared custom hooks
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── hiring/            # hiring business logic (42+ files)
│   │   ├── zemeet/            # Ze[meet] session & state logic
│   │   ├── dashboard/         # dashboard KPI logic
│   │   ├── scheduling/        # interview scheduling utilities
│   │   ├── pdf/               # PDF export utilities
│   │   ├── ai/                # AI integration helpers
│   │   └── utils.ts           # cn() and misc helpers
│   └── styles/
│       └── tokens.css         # CSS custom property definitions
├── .claude/
│   └── launch.json            # Claude Code dev server config (port 3001)
├── .env                       # local environment variables (gitignored)
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Application Modules

### Ze[hub] — Dashboard

**Route:** `/(dashboard)/dashboard`

The role-aware command centre. Every role gets a different hero, KPI set, and widget layout.

**Key files:**

| File | Purpose |
|---|---|
| `components/dashboard/GreetingHero.tsx` | Hero section with greeting, KPI cards, timeframe filters |
| `components/dashboard/DashboardPanels.tsx` | Operational panels (interviewer workload, feedback queue, pipeline activity) |
| `components/dashboard/DashboardExperience.tsx` | Top-level layout orchestrator |
| `components/dashboard/TimeframeHeroKpi.tsx` | Reusable KPI card with Today / This week / This month dropdown |
| `components/dashboard/InterviewerIntelligencePanels.tsx` | Interviewer-specific insights |
| `config/dashboardHeroByRole.ts` | KPI data (Interviews, Feedback Due, Offers Sent, Hired) per role |
| `config/dashboardByRole.ts` | Widget visibility matrix |
| `lib/dashboard/interviewTimeframeKpi.ts` | Timeframe KPI store — Today / Tomorrow / This week / Next week / This month |
| `features/dashboard/data/dashboard.mock.ts` | Mock KPI data and interviewer workload rows |

**KPI cards** — each card has an independent timeframe dropdown (persisted to localStorage per KPI):

- **Interviews** — uses `InterviewsTimeframeHeroKpi` (evaluator-aware, computes from real mock data)
- **Feedback Due / Offers Sent / Hired** — uses generic `TimeframeHeroKpi` (static mock per timeframe)

**Interviewer workload** uses two states only: `Available` (green) and `Busy` (red).

---

### Ze[hire] — Hiring Pipeline

**Routes:** `/(dashboard)/hiring/jobs`, `/(dashboard)/candidates`, `/(dashboard)/applicants`, `/(dashboard)/interviews`

End-to-end hiring — from creating a job to making an offer.

#### Sub-surfaces

| Surface | Route | Component |
|---|---|---|
| Jobs dashboard | `/hiring/jobs` | `JobsDashboard.tsx` |
| Job workspace | `/hiring/jobs/[jobId]` | `JobWorkspace.tsx` |
| Job overview tab | (tab inside workspace) | `workspace/JobWorkspaceOverview.tsx` |
| Applicants stats tab | (tab) | `HiringKanban` with `APPLICANTS_STATS_COLUMNS` |
| Interviews tab | (tab) | `InterviewKanbanBoard.tsx` |
| Hired & Offers tab | (tab) | `HiringKanban` with `HIRE_OFFERS_KANBAN_COLUMNS` |
| Candidate directory tab | (tab) | `JobApplicantsTab.tsx` |
| Global candidates | `/candidates` | Global candidate list |
| Interview feedback | `/interviews/[id]` | Feedback form workspace |

#### Job creation flow

```
NewJobFormDialog (4-step wizard)
  Step 1: Basic Details (title, department, location, work mode, experience, hiring manager)
  Step 2: Additional Details (description, responsibilities, skills, salary, deadline)
  Step 3: Custom Fields
  Step 4: Hiring Pipeline (interview rounds)

  → "Save as Draft" (final CTA)
  → createHiringJobDraft() — persists to localStorage + HIRING_JOBS array
  → navigate to /hiring/jobs/[jobId]
  → Job status = "Draft"

  → Add hiring team (Recruiter + Hiring Manager + Panel Member)
  → isHiringTeamComplete() returns true
  → "Publish Job" button appears in hero
  → Confirmation modal → publishPersistedJob()
  → Job status = "Published"
```

#### Applicant contact status

Candidates in **Applied** or **Screening** stages show one of:

| Status | Chip | Meaning |
|---|---|---|
| `needs_contact` | 🟡 amber "Needs Contact" | No recruiter outreach yet |
| `engaged` | 🔵 sky "Engaged by MC" | Contacted or marked via dropdown |

- Clicking **"Contact Candidate"** opens a dropdown: Send Email / Schedule Call / Mark as Engaged
- **"Mark as Engaged"** → `markCandidateEngaged(id)` → fires `CONTACT_STATUS_UPDATED_EVENT` → all cards re-render live
- Filter chips in `KanbanOwnershipToolbar`: quick pills **[All] [Needs Contact N] [Engaged N]** plus Filters popover

**Shortlisted column rule:** Cards owned by the current user suppress the engagement chip (Mine view). Cards owned by others show "Engaged by [initials]" (All candidates view).

#### Move-to-Interview approval workflow

| Role | Behavior when clicking "Move to Interview" |
|---|---|
| `superAdmin` | Opens `MoveToInterviewDialog` directly — moves immediately |
| `admin` | Opens `RequestMoveToInterviewDialog` — submits approval request to SA |

On pending request:
- Card: amber **"Move request pending"** chip + button disabled ("Waiting for Super Admin approval")
- Bell notification fires for Super Admin
- SA opens `CandidateReportDialog` → amber `MoveToInterviewApprovalBanner` at top
- **Approve** → `approveMoveToInterviewRequest()` → `moveCandidateToStage("Interviews")` → candidate moves
- **Reject** → optional reason → button re-enables for Admin

State persisted to `sessionStorage` via `lib/hiring/moveToInterviewApproval.ts`.

#### Candidate evaluation / interview feedback

**Skill sections** (`SkillEvaluationAccordion`):

Per competency (Communication, Technical Depth, Problem Solving, Collaboration, Leadership, Culture Fit, Ownership):
- **Rating** — segmented buttons: Poor / Fair / Good / Very Good / Excellent → stored as `skillRating?: SkillRating`
- **Strengths** — pill tags (from `SKILL_QUICK_SIGNALS` defaults)
- **Summary** — one-line text input
- **Detailed notes** — optional textarea

The selected rating shows as a coloured badge in the accordion header.

**Hiring Recommendation** (`EvaluationSidebar`) — completely independent from skill ratings:

| Value | Icon | Color |
|---|---|---|
| `strong_no_hire` | 👎👎 Strong No Hire | Red |
| `no_hire` | 👎 No Hire | Orange |
| `lean_hire` | — Neutral | Amber |
| `hire` | 👍 Hire | Emerald |
| `strong_hire` | 👍👍 Strong Hire | Green |

In readOnly mode the recommendation displays as a large visual card (icon + bold label + subtext + submitter name). Not calculated from competency ratings.

**Key lib files:**

| File | Purpose |
|---|---|
| `lib/hiring/createHiringJob.ts` | `createHiringJobDraft()`, `createHiringJob()` |
| `lib/hiring/persistedJobs.ts` | localStorage persistence, `publishPersistedJob()` |
| `lib/hiring/jobHiringTeam.ts` | Team groups, `isHiringTeamComplete()`, `TEAM_UPDATED_EVENT` |
| `lib/hiring/stages.ts` | `HiringStageName`, kanban column helpers, `getCandidateStage()` |
| `lib/hiring/interviewFeedback.ts` | `SkillFeedbackEntry`, `SKILL_RATING_OPTIONS`, `HireRecommendation`, `RECOMMENDATION_OPTIONS` |
| `lib/hiring/candidateContactStatus.ts` | `ContactStatus`, `markCandidateEngaged()`, `CONTACT_STATUS_UPDATED_EVENT` |
| `lib/hiring/moveToInterviewApproval.ts` | Admin → SA approval flow, notification store |
| `lib/hiring/kanbanOwnership.ts` | `KanbanOwnershipFilters`, `filterApplicantsStatsKanban()` |
| `lib/hiring/ownershipTransferRequests.ts` | Recruiter ownership transfers, collision detection |
| `lib/hiring/scheduleInterview.ts` | Interview scheduling mock data |

---

### Ze[meet] — Video Interview Room

**Route:** `/meet/[roomId]`

Live interview workspace — Google Meet-style video UI with ze[meet] intelligence layer.

**URL format:**
```
Interviewer: /meet/[roomId]
Candidate:   /meet/[roomId]?role=candidate
```

The **Share Link** toolbar button inside the room copies:
```
http://localhost:3001/meet/[roomId]?role=candidate
```

Pasting this URL opens the candidate lobby view (device setup → join session).

#### Session resolution

`lib/zemeet/session.ts` → `resolveZeMeetSession(roomId, viewerRole)`:

1. Parses `roomId` as `{candidateId}-{roundSlug}` format
2. Looks up candidate + job from `HIRING_CANDIDATES` / `HIRING_JOBS` mock data
3. Falls back to `getDemoZeMeetSession()` for unknown rooms (Aaran Sharma + Elena Hoffmann demo)

#### Component hierarchy

```
ZeMeetExperience
└── ZeMeetProvider  (session, devices, elapsed, recording, code challenge, notes)
    └── ZeMeetFlow
        ├── ZeMeetLobby           (device setup, camera preview, join button)
        ├── ZeMeetRoom            (live session)
        │   ├── GMeetTopBar       (Google Meet branding, timer, recording, participants)
        │   ├── VideoGrid
        │   │   └── GMeetVideoTile  (gradient bg + initials + glass pill footer)
        │   ├── ZeMeetToolbar     (right sidebar: Code, Resume, LinkedIn, Notes, Share Link)
        │   ├── ShareLinkToolbarBtn  (Radix Popover — copies candidate URL)
        │   ├── CandidateWaitingRoomModal  (fullscreen camera preview overlay)
        │   └── GMeetBottomControls  (mic / cam / captions / raise hand / share / end call)
        └── ZeMeetPostInterviewFeedback
```

#### Video tiles

All participant tiles use a unified `GMeetVideoTile` component:
- No avatar images — gradient background with large initials (`AS`, `EH`)
- Glass pill footer: `Name · Role` + mic-off icon + speaking pulse
- `isSpeaking` state drives emerald ring border + green pulse dot

#### Code challenge state machine

```
"idle" → "invite_pending" → "active" → "completed"
```

Persisted to localStorage: `zemeet-code-challenge:{roomId}`

**Key lib files:**

| File | Purpose |
|---|---|
| `lib/zemeet/types.ts` | All Ze[meet] types: `ZeMeetSession`, `ZeMeetParticipant`, `ZeMeetPhase` |
| `lib/zemeet/session.ts` | Session resolution from roomId + viewerRole |
| `lib/zemeet/rooms.ts` | `parseZeMeetRoomId()` |
| `components/zemeet/ZeMeetProvider.tsx` | Context provider — all meeting state |
| `components/zemeet/room/ZeMeetRoom.tsx` | Main live room layout |
| `components/zemeet/lobby/ZeMeetLobby.tsx` | Pre-join device setup screen |

---

### Ze[code] — Assessments & Question Pool

**Routes:** `/(dashboard)/assessments`, `/(dashboard)/schedules`, `/(dashboard)/question-pool`

#### Question Pool

Curated library of interview questions.

**Question types:** `multiple-choice`, `coding`, `database`, `comprehension`, `fill-blank`, `debug`

**Difficulty:** `beginner`, `intermediate`, `advanced`, `expert`

| File | Purpose |
|---|---|
| `features/question-pool/store/poolStore.ts` | Zustand — filters, pagination, selection, search |
| `features/question-pool/store/draftStore.ts` | Editor draft state |
| `features/question-pool/editor/editorConfig.ts` | Form schemas per question type |

#### Assessments

Pre-built templates assembled from question pool questions, sent to candidates.

| File | Purpose |
|---|---|
| `lib/hiring/assessments/assessmentStore.ts` | Zustand — active assessment state |
| `lib/hiring/assessments/assessmentFormSteps.ts` | Multi-step creation wizard |
| `lib/hiring/assessments/liveMonitoringData.ts` | Live candidate monitoring data |
| `components/hiring/assessments/` | All assessment UI |

#### Assessment Drive

Schedule assessments for batches of candidates with live monitoring.

| File | Purpose |
|---|---|
| `lib/scheduling/scheduleStore.ts` | Zustand — date/time slots, timezone |
| `components/hiring/assessment-schedules/` | Drive UI components |

---

## Routing Reference

### Protected routes (require auth session)

| Route | Description |
|---|---|
| `/dashboard` | Ze[hub] overview |
| `/hiring/jobs` | Jobs list |
| `/hiring/jobs/[jobId]` | Job workspace (Overview / Applicants stats / Interviews / Hired & Offers / Directory tabs) |
| `/hiring/jobs/new` | Redirects to `/hiring/jobs?addJob=1` |
| `/candidates` | Global candidate directory |
| `/candidates/[id]` | Candidate intelligence profile |
| `/applicants` | Applicants directory |
| `/applicants/[id]` | Applicant detail + evaluation tabs |
| `/interviews` | Interview directory |
| `/interviews/[id]` | Interview detail + feedback form |
| `/interviews/workflow/[jobId]` | Interview workflow per job |
| `/interviews/intelligence` | AI interview insights |
| `/my-schedule` | Personal interview calendar |
| `/assessments` | Assessment list |
| `/assessments/[id]` | Assessment detail |
| `/schedules` | Assessment drive |
| `/schedules/[assessmentId]` | Schedule workspace |
| `/question-pool` | Question library |
| `/question-pool/create/[type]` | Create question |
| `/settings/*` | Profile / org / appearance / notifications / audit / teams / localization |
| `/analytics` | Analytics dashboard |
| `/reports` | Report builder |

### Public routes

| Route | Description |
|---|---|
| `/` | Root (redirects based on auth state) |
| `/login` | Email/password + Google OAuth |
| `/meet/[roomId]` | Ze[meet] live room — `?role=candidate` for candidate view |
| `/meet-demo` | Static meet demo page |

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handlers |
| `/api/jobs` | GET/POST | Job CRUD |
| `/api/export/candidate/[id]` | POST | PDF candidate report |
| `/api/export/compare` | POST | Comparison export |
| `/api/interviews/[id]/upload` | POST | Recording upload |
| `/api/interviews/[id]/transcribe` | POST | Transcription trigger |
| `/api/interviews/[id]/summarize` | POST | AI summary trigger |
| `/api/health` | GET | Health check |
| `/api/settings/anonymized` | GET/POST | Anonymized screening config |
| `/api/settings/retention` | GET/POST | Data retention policy |

---

## Authentication & Roles

### NextAuth Setup

Config: `src/lib/auth.ts`

- **Strategy:** JWT (30-day max age)
- **Adapter:** Prisma (`@auth/prisma-adapter`)
- **Providers:**
  - `CredentialsProvider` — email + password (bcrypt)
  - `GoogleProvider` — optional (set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`)
- **Callbacks:** `jwt` adds `user.id`, `user.role`, `user.organizationId`; `session` propagates to client

**Middleware** (`src/middleware.ts`) redirects unauthenticated requests to `/login`. All `/(dashboard)/*` routes are protected.

### Preview Roles (frontend-only)

The role tab bar in the topbar lets any authenticated user preview the UI as a different persona. This is a **frontend-only demo feature** — it does not affect database auth or NextAuth session.

| Role | Key access |
|---|---|
| `superAdmin` | Full access — can approve move-to-interview requests, see all candidates |
| `admin` | Hiring, assessments, reports — **cannot** directly move shortlisted candidates to interview (must request SA approval) |
| `curator` | Question pool + assessments (content creation only) |
| `evaluator` | My schedule + assigned interviews + feedback writing only |
| `newUser` | Limited dashboard during onboarding |

**Role config:**

| File | Controls |
|---|---|
| `config/previewRole.ts` | Role enum, display labels, ordering |
| `config/navigationByRole.ts` | Sidebar navigation items per role |
| `config/dashboardByRole.ts` | Dashboard KPIs / widgets per role |
| `config/dashboardHeroByRole.ts` | Hero greeting + KPI values per role |

---

## State Management

### Zustand Stores

| Store | File | Manages |
|---|---|---|
| `usePoolStore` | `features/question-pool/store/poolStore.ts` | Question pool: filters, selection, pagination, search |
| `useDraftStore` | `features/question-pool/store/draftStore.ts` | Question editor draft state |
| `useScheduleStore` | `lib/scheduling/scheduleStore.ts` | Assessment schedule: date/time slots, timezone |
| `useAssessmentStore` | `lib/hiring/assessments/assessmentStore.ts` | Active assessment state |
| `useOnboardingStore` | `lib/onboarding/onboardingStore.ts` | New user onboarding checklist |

### React Context

| Context | File | Provides |
|---|---|---|
| `RoleContext` | `context/RoleContext.tsx` | `selectedRole`, `setSelectedRole` |
| `ZeMeetContext` | `components/zemeet/ZeMeetProvider.tsx` | Session, devices, elapsed, code challenge, notes |
| `ThemeContext` | `components/ThemeProvider.tsx` | Dark / light / system + custom brand color |

### Custom event stores

Multiple React trees can react to shared mutations without prop drilling via `window.dispatchEvent` + `useEffect` subscriptions:

| Event | File | Fires when |
|---|---|---|
| `kerohire:jobs-updated` | `lib/hiring/persistedJobs.ts` | Job created, published, deleted |
| `kerohire:team-updated` | `lib/hiring/jobHiringTeam.ts` | Hiring team member added/removed |
| `kerohire:contact-status-updated` | `lib/hiring/candidateContactStatus.ts` | Candidate marked as Engaged |
| `kerohire:transfer-notifications` | `lib/hiring/transferNotifications.ts` | Ownership transfer created/resolved |
| `kerohire:feedback-notifications` | `lib/hiring/feedbackNotifications.ts` | Feedback request sent/received |
| `kerohire:mti-updated` | `lib/hiring/moveToInterviewApproval.ts` | MTI request created/approved/rejected |

### localStorage Keys

| Key | Purpose |
|---|---|
| `ze-theme` | `"dark"` / `"light"` / `"system"` |
| `zecode.primary` | Custom brand hex color |
| `ze.sidebar.collapsed` | Boolean |
| `kerohire-created-jobs` | Persisted new jobs (JSON array) |
| `kerohire-job-overrides` | Status overrides (publish/delete) |
| `kerohire-hiring-team:{jobId}` | Hiring team per job |
| `kerohire-contacted-candidates` | Set of candidate IDs marked as Engaged |
| `ze.dashboard.{kpi}-timeframe` | Selected timeframe per KPI card |
| `zemeet-code-challenge:{roomId}` | Code challenge state machine value |
| `kanban-view-mode` | `"mine"` / `"all"` / `"team"` |

> Move-to-interview approval requests and notifications use **sessionStorage** (cleared on tab close).

---

## Design System & Tokens

### Token files

| File | Scope |
|---|---|
| `src/styles/tokens.css` | Root CSS variables (colors, radius, shadows) |
| `src/components/dashboard/dashboardTokens.ts` | Dashboard panel classes |
| `src/components/hiring/hiringTokens.ts` | Kanban card, hero strip, glass KPI, transitions |
| `src/components/zemeet/zemeetTokens.ts` | Meet room control buttons, glass dock |
| `src/features/question-pool/tokens.ts` | Question pool editor |
| `src/features/settings/settingsTokens.ts` | Settings pages |

### Color system

Colors use CSS custom properties so dark/light themes work via class toggling:

```css
var(--bg-base)        /* page background */
var(--surface-1)      /* card surface */
var(--text-primary)   /* main text */
var(--text-secondary) /* muted text */
var(--border-subtle)  /* card borders */
var(--brand-primary)  /* accent (violet by default) */
```

The `ThemeProvider` injects a boot script (`lib/themeBootScript.ts`) to prevent FOUC.

### Border radius scale

```
rounded-[8px]   — buttons, inputs, small chips
rounded-[12px]  — cards, dropdowns
rounded-[16px]  — large cards
rounded-[20px]  — dialogs, modals
rounded-full    — pills, avatars, badges
```

---

## Data Layer

### Mock data (current state)

Most hiring data is **in-memory mock data** — no API calls for the hiring pipeline:

- `src/lib/hiring/mockData.ts` — `HIRING_JOBS`, `HIRING_CANDIDATES`, `getCandidatesForJob()`, `getJobById()`, `moveCandidateToStage()`
- `src/lib/hiring/staffDesignerApplicants.ts` — detailed candidate profiles for the Staff Product Designer job

**Mutations** are applied by mutating the in-memory arrays and additionally persisted to localStorage for created/published jobs. The job workspace page is a **client component** that reads from localStorage on mount.

### Database (Prisma / SQLite)

Used for auth and audit only in the current state:

- `User`, `Account`, `Session` — NextAuth
- `Organization` — multi-tenant org
- `AuditEvent` — compliance log
- `Candidate`, `InterviewSession`, `Note` — real candidate records (not yet connected to UI)

---

## Key Workflows

### 1. Add Job → Save as Draft → Publish

```
NewJobFormDialog (4 steps: Basic → Additional → Custom Fields → Hiring Pipeline)
  → "Save as Draft" → createHiringJobDraft() → localStorage + HIRING_JOBS
  → navigate to /hiring/jobs/[jobId] (client component reads localStorage)
  → JobWorkspaceOverview shows PublishReadinessCard checklist
  → Add Recruiter + Hiring Manager + Panel Member via JobWorkspaceHiringSetup
  → TEAM_UPDATED_EVENT → JobWorkspaceHero re-checks isHiringTeamComplete()
  → "Publish Job" button → confirmation modal → publishPersistedJob()
  → status "Published" → page reload
```

### 2. Applicant contact flow

```
HiringKanban → CandidateCard
  → getContactStatus(candidate, contactedIds) → "needs_contact"
  → Amber "Needs Contact" chip + "Contact Candidate" dropdown
  → "Mark as Engaged" → markCandidateEngaged(id) → localStorage
  → CONTACT_STATUS_UPDATED_EVENT → all subscribed components re-render
  → Card shows sky "Engaged by MC" chip
```

### 3. Move-to-Interview approval (Admin role)

```
Admin clicks "Move to Interview" on Shortlisted card
  → ownership.previewRole === "admin"
  → Opens RequestMoveToInterviewDialog
  → Selects stage + adds note → "Send Request"
  → createMoveToInterviewRequest() → sessionStorage + SA notification

Super Admin: notification bell → "Move to Interview request"
  → Opens CandidateReportDialog → MoveToInterviewApprovalBanner appears
  → "Approve" → approveMoveToInterviewRequest() → moveCandidateToStage("Interviews")
  → candidate moves to Interviews column; Admin receives approval notification
```

### 4. Ze[meet] interview session

```
Interviewer opens: /meet/[roomId]
  → ZeMeetLobby (device setup) → Join
  → ZeMeetRoom (live)
  → "Share Link" toolbar → Popover shows: /meet/[roomId]?role=candidate
  → Candidate pastes URL → sees ZeMeetLobby (candidate view)
  → Candidate joins → both in live session
  → Code Challenge: interviewer sends → shared editor activates
  → Session ends → ZeMeetPostInterviewFeedback form
```

### 5. Interview evaluation submission

```
Feedback form (SkillEvaluationAccordion)
  → Per competency: select rating (Poor → Excellent) + strengths + summary
  → EvaluationSidebar: select Hiring Recommendation independently (👍👍 Strong Hire etc.)
  → Submit

Read-only view:
  → Large Hiring Recommendation card (icon + bold label + colour coding)
  → Skill sections: read-only rating chip + strengths pills + summary
  → No star scores, no averaged numbers
```

---

## Environment Variables

```bash
# Required
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-min-32-chars"

# Optional — Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

## Scripts Reference

| Script | Command | What it does |
|---|---|---|
| `dev` | `next dev` | Start dev server (port 3001 via launch.json) |
| `dev:clean` | kill port + `next dev` | Clean restart |
| `dev:fresh` | clear `.next` + restart | Full cache bust |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `lint` | `next lint` | ESLint check |
| `db:generate` | `prisma generate` | Regenerate Prisma client |
| `db:push` | `prisma db push` | Apply schema to DB (no migration file) |
| `db:migrate` | `prisma migrate dev` | Create and apply migration |
| `db:seed` | `tsx prisma/seed.ts` | Seed demo data |
| `db:studio` | `prisma studio` | Prisma Studio at :5555 |
| `storybook` | `storybook dev -p 6006` | Component explorer |
| `build-storybook` | `storybook build` | Static Storybook build |

---

## Conventions

### File naming

- **Components:** `PascalCase.tsx` — `JobWorkspaceHero.tsx`
- **Lib/hooks:** `camelCase.ts` — `interviewFeedback.ts`, `useRole.ts`
- **Config:** `camelCase.ts` — `dashboardHeroByRole.ts`
- **Tokens:** `*Tokens.ts` — `hiringTokens.ts`

### Import alias

`@/` maps to `src/` (configured in `tsconfig.json`):

```ts
import { cn } from "@/lib/utils";
import { HiringKanban } from "@/components/hiring/HiringKanban";
import type { HiringJob } from "@/lib/hiring/types";
```

### Component patterns

- `"use client"` at top of any component using state, effects, or browser APIs
- All pages in `(dashboard)/` are server components unless they need interactivity
- `cn()` always used for conditional class composition (`clsx` + `tailwind-merge`)
- Radix UI used as the base for all interactive elements (Dialog, Popover, Select, Tabs, DropdownMenu, etc.)

### Toast notifications

```ts
import { toast } from "sonner";
toast.success("Job published successfully");
toast.error("Could not save draft. Please try again.");
toast("Move request rejected.", { description: "Email sent to Admin." });
```

### Event / reactivity pattern

For cross-tree state updates without prop drilling:

```ts
// emit (in lib)
window.dispatchEvent(new CustomEvent("kerohire:team-updated", { detail: { jobId } }));

// subscribe (in component)
useEffect(() => {
  const refresh = () => setTeam(getJobHiringTeamForJob(job));
  window.addEventListener("kerohire:team-updated", refresh);
  return () => window.removeEventListener("kerohire:team-updated", refresh);
}, [job]);
```

### Styling approach

- Tailwind utility classes only — no custom CSS except `src/styles/tokens.css`
- Arbitrary values (`text-[13px]`, `rounded-[12px]`, `h-[calc(100vh-230px)]`) preferred over config extensions
- Dark mode via `dark:` prefix + `class` strategy on `<html>`
- Shared style strings extracted to `*Tokens.ts` constants (e.g. `hiringHeroGlassKpi`, `kanbanCard`)

---

## Repository

```
GitHub: https://github.com/munavarirfan-ux/Zecode-3.0
Branch: main
Last commit: 904bcc7
```

---

*Maintained by the Zessta Software Services team.*
