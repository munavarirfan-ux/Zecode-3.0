# Ze[code] 3.0 — Work Summary (for Claude / context handoff)

**Project path:** `/Users/zesstaios/Documents/Projects/Ze[code] 3.0`  
**Stack:** Next.js (App Router), React, TypeScript, Tailwind, Prisma, NextAuth, Storybook 10 (`@storybook/nextjs`)  
**Product areas:** Ze[code] hiring/dashboard UI + **ZeMeet** (video interviews, code challenge, post-interview feedback)

> **Important constraint:** The folder name `Ze[code] 3.0` contains `[` and `]`, which break glob-based tooling (Storybook config discovery, story indexing). A custom launcher (`scripts/storybook-dev.mjs`) works around this. Always run Storybook via `npm run storybook`, not raw `npx storybook dev`.

---

## 1. ZeMeet — Post-interview feedback workspace

**Goal:** Minimal, premium evaluation UI (Linear / Notion / Vercel style), light theme aligned with the Ze[code] dashboard—not a heavy HR form.

### UX / design decisions implemented

| Area | Implementation |
|------|----------------|
| Layout | Modal overlay like **Add Candidate** (`CandidateFormDialog`): `max-w-[960px]`, centered, `dashboardCanvas` background |
| Heading | **“Submit feedback”** + subheading via `FeedbackWorkspaceHeading.tsx` |
| Hero | Hiring-style hero like **Candidate Report** (`FeedbackReviewHeader.tsx`): texture, glass meta pills, stats, candidate initials |
| Card padding | Unified `feedbackCardPad` tokens (`px-7 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9`) across workspace cards |
| Interview notes | **Sticky notes** on hero bottom-right (`HeroInterviewStickyNotes.tsx`); removed from sidebar |
| Skills | **Collapsible skill modules** (`FeedbackEditorialSkills.tsx`) — compact by default, expand for strengths / concerns / detailed notes |
| Sidebar | Rating, recommendation, collapsible interview details (`FeedbackReviewSidebar.tsx`, `InterviewDetailsCollapsible.tsx`) — **no notes panel** in sidebar |
| Footer | Sticky footer like Ze[code] dialogs (`FeedbackActionDock.tsx`): `Button`, `bg-forest`, not glass pill |
| Flow | End interview → confirm → `phase = "feedback"` → `ZeMeetPostInterviewFeedback` → submit → `phase = "ended"` |

### Key files

```
src/components/zemeet/feedback/
  ZeMeetPostInterviewFeedback.tsx      # Main shell
  ZeMeetEndInterviewDialog.tsx
  workspace/
    feedbackWorkspaceTokens.ts       # Design tokens, modal panel, hero shell, card shells
    FeedbackWorkspaceHeading.tsx
    FeedbackReviewHeader.tsx
    FeedbackEditorialSkills.tsx
    FeedbackReviewSidebar.tsx
    FeedbackActionDock.tsx
    HeroInterviewStickyNotes.tsx
    InterviewDetailsCollapsible.tsx
    RecommendationSegmented.tsx
    AutoGrowTextarea.tsx
```

### Data / flow

- Live notes from `useZeMeet().notes`; merged via `buildPostCallFeedbackBundle()` / `resolveSessionNotesForDisplay()` in `feedbackWorkspaceTokens.ts`
- Hiring feedback types in `src/lib/hiring/interviewFeedback.ts`
- Bridge: `src/lib/zemeet/feedbackBridge.ts`
- Sync: `src/lib/zemeet/sync.ts`

### Test URL (interviewer, feedback flow)

```
http://localhost:3000/meet/zm-c-sarah-jenkins-design-review?role=interviewer&join=1
```

End the interview from the control bar to open the feedback workspace.

### Removed / replaced

- `InterviewSessionNotesPanel.tsx` — deleted; notes live on hero sticky notes only

---

## 2. ZeMeet — Interviewer controls during live call

**Goal:** Interviewers can open **Resume** and **LinkedIn** during any live call (not only during active code challenge).

### Changes

| File | Change |
|------|--------|
| `ZeMeetControlBar.tsx` | `showIntelControls = isInterviewer` (always on live call); Resume/LinkedIn on dock (lg/md) + More menu / mobile sheet |
| `ZeMeetTopBar.tsx` | Resume + LinkedIn buttons for interviewer |
| `ZeMeetRoom.tsx` | Mounts `<ZeMeetInterviewerIntelPanel />` beside sidebar (video + code challenge layouts) |
| `src/lib/zemeet/session.ts` | Demo `candidateIntel` (e.g. resume URL for Emma Schneider demo session) |

`ZeMeetInterviewerIntelPanel.tsx` existed but was **never mounted** in `ZeMeetRoom.tsx` before this fix.

---

## 3. Storybook setup (bracket-safe + full component catalog)

### Problem

- Project path `Ze[code] 3.0` → `[` treated as glob character class
- Symptoms: `MainFileMissingError`, `makeTitle created an undefined title`, `@/` imports not resolving, JSX in generated `preview.mjs` failing

### Solution: `scripts/storybook-dev.mjs`

1. **Symlink** project → `$TMPDIR/zecode-storybook-root` (paths without `[`)
2. **Temp config dir** → `$TMPDIR/zecode-storybook-cfg-*` (config discovery works)
3. **Story directory** → symlinked `src` via `{ directory, files: '**/*.stories.@(ts|tsx)' }`
4. **Webpack `resolve.alias`:** `@` → `src`, `@/data` → `data`
5. **`resolve.modules`** → project `node_modules` (for `sonner`, etc.)
6. **Preview** → symlink to `.storybook/preview.tsx` (Toaster + `globals.css`)
7. **Watch polling** (`poll: 1000`) for HMR through symlink

### Commands

```bash
npm run storybook          # dev → http://localhost:6006
npm run build-storybook    # static build
```

**Do not** use `npx storybook dev` directly on this repo path.

### Story catalog (`src/storybook/`)

| File | Sidebar group | Contents (examples) |
|------|---------------|---------------------|
| `ze-ui.stories.tsx` | Ze[code]/UI | Buttons, forms, card, select/tabs, dialog |
| `ze-dashboard.stories.tsx` | Ze[code]/Dashboard | Greeting hero, KPI strip, metrics, activity, insight panels |
| `ze-hiring.stories.tsx` | Ze[code]/Hiring | Status badges, feedback UI kit, job card, jobs hero, candidate report, email feed, dialogs |
| `ze-zemeet.stories.tsx` | ZeMeet | Lobby, live top bar, control bar, feedback pieces, full post-interview workspace |
| `mocks.ts` | — | Sarah Jenkins session, hiring mocks, feedback bundle |
| `decorators.tsx` | — | `dashboardCanvasDecorator`, `sessionDecorator`, `zeMeetDecorator()` |

~**39 indexed stories** when last verified.

### Removed

- Default Storybook template under `src/stories/` (Button, Header, Page)
- Duplicate colocated `*.stories.tsx` next to components (consolidated under `src/storybook/`)

### Config files

```
.storybook/main.ts       # stories: ../src/**/*.stories.@(ts|tsx) — used when not via launcher
.storybook/preview.tsx   # globals.css + Toaster decorator
scripts/storybook-dev.mjs
```

---

## 4. Other fixes / notes from sessions

- Repeated accidental `motion.div` typos in JSX were corrected to `div` where found
- `tsc --noEmit` passed after major feedback workspace changes
- Toolbar behavior (from earlier work): candidate minimal dock; interviewer toolbar adjustments (minus Layout/Settings where specified)—verify in `ZeMeetControlBar.tsx` if still required
- ZeMeet notes may not persist across provider remount (optional future work)
- Optional: close button on feedback modal (not implemented unless added later)

---

## 5. Architecture quick reference

```
ZeMeetExperience
  └── ZeMeetProvider (session, phase, notes, codeChallenge, …)
        ├── lobby → ZeMeetLobby
        ├── live  → ZeMeetRoom (+ ZeMeetInterviewerIntelPanel)
        └── feedback (interviewer) → ZeMeetPostInterviewFeedback
```

**Phases:** `lobby` | `live` | `feedback` | `ended`

**Demo room (Sarah Jenkins):** `zm-c-sarah-jenkins-design-review`  
**Candidate id:** `c-sarah-jenkins`  
**Job:** Staff Product Designer

---

## 6. Suggested follow-ups (not necessarily done)

- [ ] Storybook: candidate report **dialog**, interview **kanban** board, **code challenge workspace**
- [ ] Persist ZeMeet notes across provider remount
- [ ] Close button on feedback modal
- [ ] Rename project folder to remove `[` (e.g. `Ze-code-3.0`) to drop Storybook launcher workaround
- [ ] Commit/push work if not yet in git

---

## 7. File index (high-signal)

| Purpose | Path |
|---------|------|
| Feedback main UI | `src/components/zemeet/feedback/ZeMeetPostInterviewFeedback.tsx` |
| Design tokens | `src/components/zemeet/feedback/workspace/feedbackWorkspaceTokens.ts` |
| ZeMeet provider | `src/components/zemeet/ZeMeetProvider.tsx` |
| Session resolver | `src/lib/zemeet/session.ts` |
| Hiring mock data | `src/lib/hiring/mockData.ts` |
| Storybook launcher | `scripts/storybook-dev.mjs` |
| Storybook stories | `src/storybook/*.stories.tsx` |
| Storybook mocks | `src/storybook/mocks.ts` |

---

## 8. How to use this doc with Claude

Paste this file (or sections) when starting a new chat so Claude knows:

1. What was already built (feedback workspace, interviewer intel, Storybook catalog)
2. Design intent (premium minimal, dashboard-aligned, hero + sticky notes)
3. Path/bracket constraint for Storybook
4. Where to look in the codebase and how to test locally

**Last updated:** May 2026 (conversation handoff)
