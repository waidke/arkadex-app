# Product Requirements Document (PRD): ArkaDex MVP

| Metadata | Detail |
| :--- | :--- |
| **Document ID** | PRD-ARK-001 |
| **Status** | Ready for Development |
| **Version** | 1.0.0 |
| **Last Updated** | 2026-05-15 |
| **Owner** | Eka Dwi Ramadhan |
| **Audience** | Engineering, Design, Stakeholders |

### Revision History
| Version | Date | Description | Author |
| :--- | :--- | :--- | :--- |
| 1.0.0 | 2026-05-15 | Final | Eka Dwi Ramadhan |

---

## 1. Executive Summary
ArkaDex is a **Social Digital Binder** purpose-built for the **Master Set Collector (Completionist)** within the Indonesian Pokémon TCG community. Unlike global alternatives that prioritize investment tracking in USD, ArkaDex focuses on **local set accuracy (IDN Checklist)**, **ultra-fast inventory entry**, and **social virality (Phase 2)**.

### 1.1 Core Value Proposition
*   **Accuracy**: The definitive "Single Source of Truth" for official Indonesian sets.
*   **Efficiency**: Minimized friction for high-volume card logging.
*   **Shareability (Phase 2)**: Transform checklists into social assets.

### 1.2 Target Persona
**The Master Set Collector**
*   **Motivation**: To complete every numbered card in a specific set.
*   **Pain Point**: Using English-based apps for Indonesian cards causes numbering confusion and data gaps.
*   **Goal**: A digital checklist that matches their physical binder layout.

### 1.3 Jobs-to-be-Done (JTBD)
> "As a completionist, when I finish opening a booster box, I want to log the cards I received in < 2 seconds, so that I can immediately share the list of cards I still need (WTB) with the community."

The product adheres to a **Content-First** strategy, ensuring a definitive local card database is established before scaling user-facing features.

### 1.4 Product Vision & Phasing Strategy
ArkaDex follows a dual-phase lifecycle to balance immediate personal utility with long-term community growth.

*   **Phase 1: Personal Alpha (Current)**
    *   **Focus**: Frictionless personal logging for the owner.
    *   **Key Tech**: Supabase with Multi-tenant schema (RLS) ready for Phase 2.
*   **Phase 2: Public Beta**
    *   **Focus**: Community sharing, WTB lists, and organic social flexing.
    *   **Trigger (Exit Phase 1)**: ≥ 3 complete main expansion sets seeded AND ≥ 10 "Early Access" requests from the community.

---

## 2. Strategic Context
### 2.1 The Market Gap
Indonesian collectors currently lack a dedicated platform for official Indonesian-language sets. Existing apps use English data/numbering, leading to significant friction and data inaccuracy. 

### 2.2 Core Objectives
*   **Accuracy**: Provide the most reliable database for official Pokémon TCG IDN sets.
*   **Velocity**: Achieve a **< 2-second** "Time-to-Log" per card via specialized UX.
*   **Social Engine (Phase 2)**: Drive organic growth by transforming boring checklists into aesthetic social assets.
*   **Compliance**: Ensure strict adherence to Indonesia's **UU PDP Law** via data-minimalism and frictionless OAuth.

---

## 3. Product Requirements

### 3.1 Functional Requirements (Phased)
| ID | Feature | Phase | Priority | Value Proposition | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | **Digital Binder** | P1 | P0 | Grid checklist IDN | F-03 |
| **F-02** | **Quick-Add Mode** | P1 | P0 | <2s tap-to-log | F-01 |
| **F-03** | **Lean CMS** | P1 | P0 | Bulk ingestion | — |
| **F-04** | **WTB Export** | P2 | P1 | Text export trade group | F-01, Multi-user |
| **F-05** | **Flex Image Gen** | P2 | P2 | 9:16 social asset | F-01 |
| **F-06** | **Price Reference** | P2 | P2 | IDR ref price | F-01 |

### 3.2 User Stories
| ID | User Story |
| :--- | :--- |
| **US-01** | As a collector, I want to see a grid of cards for a specific set so I can match them with my physical binder. |
| **US-02** | As a collector, I want to tap cards rapidly after a box break so I don't lose my momentum. |
| **US-03** | As a seeker, I want to generate a text list of my missing cards so I can post it to trade groups instantly. |
| **US-04** | As an admin, I want to upload a CSV of new set data so the app stays updated with official releases. |

### 3.3 Out of Scope (Explicit Non-Goals)
*   **Direct Marketplace**: No buying/selling cards directly within the app.
*   **Deck Builder**: No tools for competitive play testing or deck list management.
*   **Portfolio Tracking**: No advanced financial ROI or investment tracking (USD focus).
*   **Third-Party Auth**: No social providers other than Google OAuth.

### 3.4 Non-Functional Requirements (SLIs)
*   **Latency**: API response time < 500ms (P95).
*   **Mobile-First**: Responsive web app optimized for 9:16 viewport interaction.
*   **Privacy**: Frictionless Auth model; 1-click Google OAuth is required before saving collection data to ensure persistence while minimizing PII collection.
*   **Safety**: "Unofficial" legal disclaimers and data-minimization (no high-res image hosting).

---

## 4. Success Metrics (OKRs)

### 4.1 Phase 1 OKRs (Personal Utility)
**North Star Metric**: Completion percentage of the owner's active Master Set collection.

*   **KR1**: 100% of cards from 2 most recent IDN sets seeded within 48 hours of release.
*   **KR2**: Average time to log 1 full booster box (150 cards) is < 8 minutes.
*   **KR3**: 100% of cards from at least one physical Master Set successfully logged into the Digital Binder.
*   **KR4**: Zero data-entry errors found after manual personal audit of logged cards.

### 4.2 Phase 2 OKRs (Draft - Public Beta)
**North Star Metric**: Number of IDN cards successfully logged by external users per week.

*   **KR1**: 500 Weekly Active Users (WAU) within 4 weeks of public launch.
*   **KR2**: 30% of active users utilize "WTB" export tools weekly.

---

## 5. Development Principles
1.  **Frictionless Auth (OAuth Only)**: Minimize onboarding friction. Use progressive gating via 1-click Google OAuth to ensure data persistence without manual registration.
2.  **Client-Side Heavy**: Offload image generation (Canvas API) to the client to minimize server costs.
3.  **Content-First**: Database integrity for mainline sets is a hard prerequisite for any phase transition.
4.  **UU PDP Compliance**: No PII collection beyond verified email (OAuth) for sync.
5.  **Multi-Tenant Ready by Default**: Implement RLS and `user_id` foreign keys in the Phase 1 schema to avoid high-cost refactoring in Phase 2.

---

## 6. Constraints, Risks & Roadmap

### 6.1 Technical Constraints
*   **Architecture**: Next.js 14+ (App Router), Supabase (PostgreSQL/Auth).
*   **Deployment**: Vercel (Frontend), Supabase (Database/Auth).

### 6.2 Key Risks & Mitigations
| Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Operational Toil** | High | Prioritize Lean CMS (F-03) with bulk ingestion capabilities. |
| **Workflow Abandonment**| Medium | Maintain < 2s logging speed; prioritize "Quick-Add" UX over complex metadata. |
| **Data Inaccuracy** | High | Establish "Content-First" prerequisite and validation via KR4. |
| **Platform Cost** | Low | Offload heavy assets and processing to client-side (Canvas API). |

### 6.3 Roadmap & Milestones
**Phase 1: Personal Alpha**
*   **M1 (Foundations)**: Supabase schema (RLS), OAuth setup, and Lean CMS (Bulk Upload).
*   **M2 (Content)**: Seeding 2 most recent IDN expansions.
*   **M3 (Utility)**: Digital Binder (Grid View) and Quick-Add UI.

**Phase 2: Public Beta**
*   **M4 (Social Engine)**: Text-based Social Engine (WTB Export) and Flex Image Gen (F-05).
*   **M5 (Polish)**: Mobile-first UX refinements, Price Reference (F-06), and Performance audit.
*   **M6 (Launch)**: Public landing page and early access rollout.

---

## 7. Glossary
*   **IDN Set**: Official Pokémon TCG expansions released by AKG Entertainment for Indonesia. For MVP, this is limited to **Main Expansion Sets** only (excluding Promo cards, Gym promos, or deck-exclusive cards) to ensure data integrity.
*   **Master Set**: A collection including one of every card number in a single set expansion.
*   **WTB (Want to Buy)**: A list of items a collector is looking to acquire.
*   **Flexing**: Sharing one's collection or rare pulls to gain social recognition.
*   **Box Break**: The act of opening a full booster box (typically 20-30 packs) in one sitting.
