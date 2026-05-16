# Development Roadmap: ArkaDex MVP

| Metadata | Detail |
| :--- | :--- |
| **Document ID** | PLAN-ARK-RD-001 |
| **Status** | Draft |
| **Strategy** | High-Velocity Content-First |
| **Last Updated** | 2026-05-16 |

---

> [!IMPORTANT]
> **Current Focus**
> - **Active Milestone**: M2 — Content
> - **Current Phase**: Phase 1 — Personal Alpha
> - **Phase Progress**: T2.1 done; T2.2 not started
> - **Blockers**: None
> - **Next Action**: T2.2 — KR4 Manual Audit (30 cards/set, rarity verification)
> - **Last Updated**: 2026-05-16

## Status Legend
- **T1.1: Supabase Schema & RLS** — 🟢 COMPLETED
- **T1.2: Google OAuth & Gating** — 🟢 COMPLETED
- **T1.3: Lean CMS for Bulk Ingestion** — 🟢 COMPLETED (Phase E sign-off 2026-05-16)
- **T1.4: Vercel Deployment** — 🟢 COMPLETED
- **T1.5: TDD Index & ADR Lock** — 🟢 COMPLETED
- ⚪ **Not Started**: Task is in the backlog.
- 🟡 **In Progress**: Actively being worked on.
- 🟢 **Completed**: Done and verified.
- 🔴 **Blocked**: Halted by external dependency.
- ⏸ **Deferred**: Postponed to a later phase.

---

## 1. Feature Workflow Convention
Every functional feature (F-01..F-06) must follow the **a→e gate sequence** to minimize rework and ensure testing integrity.

| Gate | Stage | Deliverable | Effort |
| :--- | :--- | :--- | :--- |
| **a** | **Spec & TDD** | `docs/specs/F-XX.md` (AC, Schema, API Contract) | 0.5d |
| **b** | **Hi-Fi Proto** | `prototypes/F-XX/index.html` (HTML/Tailwind, all states) | 0.5d |
| **c** | **Test Draft** | `tests/e2e/F-XX.spec.ts` (Skeleton with `.skip()`) | 0.25d |
| **d** | **Code** | Component build & Supabase wiring | 2–3d |
| **e** | **Activation** | Unskip tests + A11y check + Polish | 0.5d |

> [!IMPORTANT]
> No gate may be skipped. Gate **a** must be reviewed and locked before Gate **d** begins.

> [!TIP]
> **Templates & Rubric**:
> - **Spec + TDD**: `docs/specs/_template.md` — copy ke `docs/specs/F-XX-<name>.md`
> - **Hi-Fi Prototype**: `prototypes/_template/index.html` — copy folder ke `prototypes/F-XX/`
> - **DoD Checklist per artifact**: `docs/process/artifact-rubric.md` (paste ke commit message PR sebagai self-attestation)

ArkaDex follows a **Multi-Track Solo Development** pattern, transitioning from a personal utility (Phase 1) to a community platform (Phase 2). This roadmap serves as both the strategic plan and the live execution dashboard.

### 1.1 Development Tracks
1. **Core**: Database schema, RLS policies, and Auth integration.
2. **Content**: CMS tools, data ingestion, and set validation.
3. **Frontend**: UI components, state management, and user experience.
4. **DevOps**: CI/CD pipelines, deployment, and monitoring.
5. **Quality**: Automated testing, security audits, and performance tuning.

---

## 2. Milestone Matrix (Multi-Track)

| Milestone | Core | Content | Frontend | DevOps | Quality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1 Foundations** | RLS & OAuth | Lean CMS | Baseline UI | Vercel CI/CD | RLS Audit |
| **M2 Content** | — | Bulk Seed | — | — | Data KR4 Audit |
| **M3 Utility** | Zustand Sync | — | Binder Grid | Sentry | E2E Playwright |
| **M4 Social** | Multi-user RLS | — | Flex Image Gen | Rate Limiting | Share Flow Test |
| **M5 Polish** | — | Price Ref | Mobile UX | — | A11y Audit |
| **M6 Launch** | — | — | Landing Page | Production | UAT |

> [!NOTE]
> **Capacity Assumption**: Elapsed estimates assume ~5 hours/day of focused development. No major holidays or extended leave are accounted for.

---

## 3. Phase 1: Personal Alpha
**Goal:** Build a robust, multi-tenant ready infrastructure and core binder utility for the owner.

### M1 — Foundations
**Goal:** Establish the secure data core and admin tools.

| Task ID | Track | Description | Status |
| :--- | :--- | :--- | :--- |
| **T1.1** | Core | Implement Supabase Schema & RLS Policies | 🟢 |
| **T1.2** | Core | Setup Google OAuth & Progressive Gating | 🟢 |
| **T1.3** | Content | Build Lean CMS for bulk ingestion (F-03) | 🟢 |
| **T1.4** | DevOps | Configure Vercel Deployment & Env Secrets | 🟢 |
| **T1.5** | Quality | TDD Index & Cross-cutting ADRs Lock | 🟢 |

**Estimated: 11–14 Days** (Refined with persona overhead)

> [!TIP]
> **Actionable Breakdown**: 
> Detailed phase-by-phase tasks and persona dispatch for M1 can be found in [docs/breakdowns/M1-foundations.md](breakdowns/M1-foundations.md).



### M2 — Content
**Goal:** Populate the database with high-quality IDN set data.

| Task ID | Track | Description | Status |
| :--- | :--- | :--- | :--- |
| **T2.1** | Content | Bulk upload 2 recent IDN expansions | 🟢 |
| **T2.2** | Quality | Manual data audit (KR4 validation) | ⚪ |
| **T2.3** | Content | Setup optimized image storage/CDN | ⚪ |
| **T2.4** | Quality | Regression test for ingestion workflow | ⚪ |

**Estimated: 6–8 Days** (Refined with parallel paths)

> [!TIP]
> **Actionable Breakdown**: 
> Detailed phase-by-phase tasks and persona dispatch for M2 can be found in [docs/breakdowns/M2-content.md](breakdowns/M2-content.md).

### M3 — Utility
**Goal:** Deliver the primary "Digital Binder" experience.

| Task ID | Track | Description | Status |
| :--- | :--- | :--- | :--- |
| **T3.1** | Frontend | **F-01: Digital Binder Grid** (Gates a-e) | ⚪ |
| **T3.2** | Frontend | **F-02: Quick-Add UI** (Gates a-e) | ⚪ |
| **T3.3** | Quality | Deploy Sentry & E2E Infrastructure | ⚪ |

**Estimated: 9–12 Days** (Refined for workflow overhead)

> [!TIP]
> **Actionable Breakdown**: 
> Detailed phase-by-phase tasks and persona dispatch for M3 can be found in [docs/breakdowns/M3-utility.md](breakdowns/M3-utility.md).

---

## 4. Phase 2: Public Beta (Outline)
**Goal:** Scale the platform for community engagement and social virality.

### M4 — Social Engine
**Goal:** Activate social features to drive organic growth.

| Task ID | Track | Description | Status |
| :--- | :--- | :--- | :--- |
| **T4.1** | Frontend | **F-04: WTB Text Export** (Gates a-e) | ⚪ |
| **T4.2** | Frontend | **F-05: Flex Image Gen** (Gates a-e) | ⚪ |
| **T4.3** | Core | Multi-user RLS Audit & Rate Limiting | ⚪ |

**Estimated: 10–13 Days** (Refined for multi-tenant audit)

> [!TIP]
> **Actionable Breakdown**: 
> Detailed phase-by-phase tasks and persona dispatch for M4 can be found in [docs/breakdowns/M4-social-engine.md](breakdowns/M4-social-engine.md).

### M5 — Polish

| Task ID | Track | Description | Status |
| :--- | :--- | :--- | :--- |
| **T5.1** | Frontend | Mobile UX Refinement (Glassmorphism + Motion + WCAG AA) | ⚪ |
| **T5.2** | Content | **F-06: Price Reference** (Gates a-e) | ⚪ |
| **T5.3** | Quality | Performance & A11y Audit (LCP, API p95, WCAG) | ⚪ |

**Estimated: 7–10 Days** (Refined for audit remediation)

> [!TIP]
> **Actionable Breakdown**: 
> Detailed phase-by-phase tasks and persona dispatch for M5 can be found in [docs/breakdowns/M5-polish.md](breakdowns/M5-polish.md).

### M6 — Launch

| Task ID | Track | Description | Status |
| :--- | :--- | :--- | :--- |
| **T6.1** | Frontend | Landing Page (Public value prop + EA sign-up) | ⚪ |
| **T6.2** | DevOps | Production Deployment & Cutover | ⚪ |
| **T6.3** | Quality | UAT + WAU Instrumentation | ⚪ |

**Estimated: 6–9 Days** (Active development effort)

> [!TIP]
> **Actionable Breakdown**: 
> Detailed phase-by-phase tasks and persona dispatch for M6 can be found in [docs/breakdowns/M6-launch.md](breakdowns/M6-launch.md).

**Estimated Phase 2: 23–32 Days**

---

## 5. Roadmap Summary

| Phase | Milestone | Status | Effort | Progress |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Personal Alpha** | M1 Foundations | 🟢 | 11–14 Days | 5 / 5 tasks |
| | M2 Content | 🟡 | 6–8 Days | 1 / 4 tasks |
| | M3 Utility | ⚪ | 9–12 Days | 0 / 3 tasks |
| **Phase 2: Public Beta** | M4 Social Engine | ⚪ | 10–13 Days | 0 / 3 tasks |
| | M5 Polish | ⚪ | 7–10 Days | 0 / 3 tasks |
| | M6 Launch | ⚪ | 6–9 Days | 0 / 3 tasks |
| **Total** | | **0 / 6 milestones** | **49–66 Days** | **0%** |

---

## 6. Execution Patterns (Solo Dev)

### 6.1 Multi-Track Risks
| Risk | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- |
| **Context-Switching** | High | Batch design work at the end of the previous milestone. |
| **Testing Debt** | High | Playwright + RLS tests as **merge gates**. No green = no merge. |
| **Doc Drift** | Medium | ADR-touch policy when implementation diverges >20%. |

### 6.2 Sequencing Pattern
**Hybrid: Design leads, Code follows, Test/Doc parallel-in-flight.**
- **M(N-1) End**: Design for Milestone N.
- **M(N) Start**: Setup deployment and secrets.
- **M(N) In-Flight**: Code + Test paired; incremental doc updates.
- **M(N) End**: Verification, doc sweep, and 30-min Milestone Retrospective (logged to `/docs/retros/`).
- **M(N) Planning**: Finalize Design for N+1.

---

## 7. Exit Gates

### 🔒 Tech-Ready Gate (End of M3)
- ✅ PRD KR1: ≥ 2 IDN sets seeded within 48h (Delivered by **M2: T2.1**)
- ✅ PRD KR3: ≥ 1 Master Set fully logged (Delivered by **M3: T3.1**)
- ✅ PRD KR4: Zero data-entry errors (Delivered by **M2: T2.2**)
- ✅ RLS isolation test pass & Playwright green (Delivered by **M3: T3.3**)

### 🛑 Kill/Pivot Criteria
- **Stuck >3 weeks** on any milestone task → Mandatory pivot to scope reduction or pause project indefinitely.
- **Data Audit Failure** (KR4) >3 times → Re-evaluate ingestion strategy before proceeding.

### 🔓 Public-Launch Trigger (Before M4)
- ≥ 10 Early Access requests from the community (Validated in **M4: T4.3 Phase 0**)

### 🚀 Public Launch Event (End of M6)
- Production URL live + SSL active.
- UAT pass (≥ 4/5 users complete core scenarios).
- Analytics capturing WAU and feature adoption.
- Marketing assets ready for community amplification.

---

## 8. Status Tracking Convention
- Use `⏸ Deferred` for Phase 2 items that are intentionally postponed.
- **Definition of Done (DoD) per Lane**:
  - **Core/Frontend**: Code merged to main, E2E tests green, and deployed to staging.
  - **Content**: Data verified against KR4 audit and storage/CDN paths confirmed.
  - **DevOps/Quality**: Workflow/Audit results documented and results verified in CI.
- **Dual Last Updated Rules**:
  - Update *Current Focus Last Updated* for every status change.
  - Update *Metadata Last Updated* (top-level) only for document structural changes.

---

## 9. Cross-References

### Architecture Decision Records
- [ADR-001: Supabase Schema](adr/ADR-001-supabase-schema.md) — T1.1
- [ADR-002: Supabase RLS Strategy](adr/ADR-002-supabase-rls-strategy.md) — T1.1
- [ADR-003: Auth Strategy](adr/ADR-003-auth-strategy.md) — T1.2
- [ADR-004: Ingestion Strategy](adr/ADR-004-ingestion-strategy.md) — T1.3
- [ADR-005: Auth Umbrella](adr/ADR-005-auth-umbrella.md) — T1.1–T1.3
- [ADR-006: Deployment](adr/ADR-006-deployment.md) — T1.4

### Planning & Architecture Documents
- **PRD-ARK-001**: Functional requirements and OKRs. (File pending)
- [TDD-ARK-001: Technical Architecture](tdd_arkadex.md) — Master TDD index and system design.

### Milestone Breakdowns
- [M1 Foundations](breakdowns/M1-foundations.md) — Core infra and CMS baseline.
- [M2 Content](breakdowns/M2-content.md) — Bulk ingestion and data audit.
- [M3 Utility](breakdowns/M3-utility.md) — Digital Binder and Quick-Add UI.
- [M4 Social Engine](breakdowns/M4-social-engine.md) — Export flows and social features.
- [M5 Polish](breakdowns/M5-polish.md) — Mobile UX and price reference.
- [M6 Launch](breakdowns/M6-launch.md) — Production cutover and UAT.

### Process & Templates
- [Artifact Rubric](process/artifact-rubric.md) — DoD per artifact (Spec/TDD/Hi-Fi/Test).
- [Feature Spec Template](specs/_template.md) — Boilerplate for Gate a deliverables.
- [Hi-Fi Prototype Template](../prototypes/_template/index.html) — Boilerplate with UI states.

### Operational Runbooks & Audit Reports
- [Deployment Runbook](ops/deployment_runbook.md) — Vercel release and rollback procedure.
- [CMS Ingestion Runbook](ops/cms_ingestion_runbook.md) — Manual data seeding workflow.
- [RLS Isolation Report](audits/rls_isolation_report.md) — Security audit of the data layer.
