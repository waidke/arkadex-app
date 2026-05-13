# Product Requirements Document (PRD): ArkaDex MVP

| Metadata | Detail |
| :--- | :--- |
| **Document ID** | PRD-ARK-001 |
| **Status** | Approved for Development |
| **Version** | 1.0.0 |
| **Last Updated** | 2026-05-13 |
| **Owner** | Principal Product Manager |
| **Audience** | Engineering, Design, Stakeholders |

---

## 1. Executive Summary
ArkaDex is a **Social Digital Binder** purpose-built for the Indonesian Pokémon TCG collector community. Unlike global alternatives that prioritize investment tracking in USD, ArkaDex focuses on **local set accuracy (IDN Checklist)**, **ultra-fast inventory entry**, and **social virality (Story-ready sharing)**. 

The product adheres to a "Content-First" strategy, ensuring a definitive local card database is established before scaling user-facing features.

---

## 2. Strategic Context
### 2.1 The Market Gap
Indonesian collectors currently lack a dedicated platform for official Indonesian-language sets. Existing apps use English data/numbering, leading to significant friction and data inaccuracy. 

### 2.2 Core Objectives
*   **Accuracy**: Provide the most reliable database for official Pokémon TCG IDN sets.
*   **Velocity**: Achieve a **< 2-second** "Time-to-Log" per card via specialized UX.
*   **Social Engine**: Drive organic growth by transforming boring checklists into aesthetic social assets.
*   **Compliance**: Ensure strict adherence to Indonesia's **UU PDP Law** via anonymous-first data models.

---

## 3. Product Requirements

### 3.1 Functional Requirements (MVP)

| ID | Feature | Priority | Value Proposition | Status |
| :--- | :--- | :--- | :--- | :--- |
| **F-01** | **Digital Binder** | **P0** | Grid-based checklist for official IDN card sets. | ⏳ Dev |
| **F-02** | **Quick-Add Mode** | **P0** | 1-2 tap UI for high-velocity inventory entry. | ⏳ Dev |
| **F-03** | **Copy WTB List** | **P0** | Instant text export for buying lists on FB/IG. | ⏳ Dev |
| **F-04** | **Flex Image Gen** | **P1** | Automatic 9:16 story image for social flexing. | ⏳ Dev |
| **F-05** | **Lean CMS** | **P0** | Internal admin tool for bulk set/card ingestion. | ⏳ Dev |
| F-06 | Price Reference | P2 | IDR-based reference prices for rare cards. | 📅 Post-MVP |

### 3.2 Non-Functional Requirements (SLIs)
*   **Latency**: API response time < 500ms (P95).
*   **Mobile-First**: Responsive web app optimized for 9:16 viewport interaction.
*   **Privacy**: Anonymous-first model; Cloud Sync is optional via Google OAuth.
*   **Safety**: "Unofficial" legal disclaimers and data-minimization (no high-res image hosting).

---

## 4. Success Metrics (OKRs)

**Objective**: Become the definitive digital companion for IDN collectors through organic virality.

*   **KR1 (Adoption)**: 500 Weekly Active Users (WAU) within 4 weeks of launch.
*   **KR2 (Engagement)**: 30% of active users utilize "Flex" or "WTB" export tools weekly.
*   **KR3 (Performance)**: Average time to add 10 cards is < 20 seconds.
*   **KR4 (Accuracy)**: Zero validated reports of incorrect set numbering or missing card data.

---

## 5. Development Principles
1.  **Anonymous-First**: Zero friction for entry. Users can track collections locally immediately.
2.  **Client-Side Heavy**: Offload image generation (Canvas API) to the client to minimize server costs.
3.  **Content-First**: Database integrity for the latest 3 IDN sets is a hard prerequisite for launch.
4.  **UU PDP Compliance**: No PII collection unless explicitly requested for cross-device sync.

---

## 6. Constraints & Roadmap
*   **Architecture**: Next.js 14+ (App Router), Supabase (PostgreSQL/Auth).
*   **Phase 1**: Infrastructure, Internal CMS, and Data Seeding (*Terang Sekali, Hantaman Ganda, Kilau Hitam*).
*   **Phase 2**: Core Binder, Quick-Add UI, and Social Engine.
*   **Phase 3**: Account Sync (OAuth) and Public Launch.
