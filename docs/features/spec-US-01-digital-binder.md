---
title: Feature Specification - Digital Binder (US-01)
version: 1.0.0
status: Completed
owner: Product Management
date: 2026-05-13
---

# Feature Specification: Digital Binder (US-01)

## 1. Executive Summary
The **Digital Binder** is the core visual engine of the ArkaDex platform. It provides a premium, responsive grid interface that allows Pokémon TCG collectors to visualize their progress within specific sets (starting with *Scarlet ex - SV1S*). The interface focuses on high-fidelity asset rendering and clear visual distinction between owned and missing cards.

## 2. Terminology & Glossary
| Term | Definition |
| :--- | :--- |
| **Binder Grid** | The main responsive layout containing card items. |
| **Lazy Loading** | A performance technique where images are loaded only when they enter the viewport. |
| **CDN Fallback** | A secondary asset source used when the primary TCGdex IDN assets are missing. |
| **Metadata Modal** | The full-screen overlay displaying card details (Name, Number, Rarity). |

## 3. User Personas & Goals
*   **The Completionist**: Needs a clear "check-off" list to see which specific cards are missing from their collection.
*   **The Aesthetic Collector**: Wants to view high-resolution art of their rare cards in a premium digital environment.

## 4. Requirements Traceability Matrix (RTM)

| ID | Requirement | Category | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | Card Grid | UI | Must | Responsive grid (3 cols mobile / 6+ cols desktop). |
| **FR-02** | Collection State | UX | Must | Missing cards = Grayscale (40% opacity); Owned = Full Color. |
| **FR-03** | Detail Modal | UX | Must | Clicking a card opens a high-res metadata overlay. |
| **FR-04** | Progress Counter | UI | Must | Displays "X / Total Cards" progress in the header. |
| **NFR-01** | Performance | Perf | Must | Page Load Time (LCP) < 1.5s via image lazy loading. |
| **NFR-02** | Resilience | Stability | Must | Graceful fallback UI for missing CDN assets. |

## 5. Implementation Architecture

### 5.1 Front-End Logic (`BinderGrid.tsx`)
The component handles data fetching from Supabase and coordinates the grid state.
*   **Data Source**: `public.cards` joined with `public.user_collections`.
*   **Visual State**: Calculates `isOwned` for each card based on the presence of the `card_id` in the user's collection set.

### 5.2 Asset Management
Due to missing Indonesian (ID) assets for SV1S cards #21-#78, the system implements a **Database-Level Fallback**:
*   **Logic**: If `id` asset is unavailable on TCGdex, the database `image_url` is pre-populated with the Japanese (`ja`) variant.
*   **UI Resilience**: `CardItem.tsx` includes an `onError` handler to display a fallback placeholder if the CDN fails.

## 6. Constraints & Limitations
*   **Static Data**: In the MVP phase, the set selection is hardcoded to *SV1S*.
*   **Asset Sourcing**: Depends entirely on TCGdex CDN availability.

## 7. Revision History
| Version | Date | Description | Author |
| :--- | :--- | :--- | :--- |
| 1.0.0 | 2026-05-12 | Initial Draft - Requirements defined. | Product Manager |
| 1.1.0 | 2026-05-13 | Standardization & Implementation - Added RTM and Fallback logic. | System Analyst |
