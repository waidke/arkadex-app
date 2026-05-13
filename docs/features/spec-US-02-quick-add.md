---
title: Feature Specification - Quick-Add Mode (US-02)
version: 1.0.0
status: Completed
owner: Product Management
date: 2026-05-13
---

# Feature Specification: Quick-Add Mode (US-02)

## 1. Executive Summary
The **Quick-Add Mode** is a high-performance interaction layer for the ArkaDex Digital Binder. It enables collectors to perform rapid, bulk updates to their digital inventory by toggling ownership status directly from the grid view, bypassing the overhead of individual card modals.

## 2. Terminology & Glossary
| Term | Definition |
| :--- | :--- |
| **Optimistic UI** | A front-end pattern where the UI reflects a successful operation before the server confirms it. |
| **Inventory Desync** | A state where the local UI counter does not match the actual database records. |
| **Grayscale State** | Visual indicator for unowned cards (Missing). |
| **Active State** | Visual indicator for owned cards (Collected). |

## 3. User Personas & Goals
*   **The Power Collector**: Needs to log 100+ cards from a new set release in under 10 minutes.
*   **The Mobile User**: Needs large, easy-to-tap targets for quick entry while on the go.

## 4. Requirements Traceability Matrix (RTM)

| ID | Requirement | Category | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | Mode Toggle | UI | Must | Header toggle with clear ON/OFF visual distinction. |
| **FR-02** | Rapid Toggle | UX | Must | Single-tap to switch between Owned/Missing status. |
| **FR-03** | Modal Suppression | UX | Must | Card Detail Modals are disabled when Quick-Add is ON. |
| **NFR-01** | Latency | Perf | Must | Interaction feedback must be < 100ms (Optimistic). |
| **NFR-02** | Persistence | Integrity | Must | Background synchronization with retry-on-failure logic. |

## 5. Implementation Architecture

### 5.1 Front-End Logic
The `BinderGrid` component maintains a local state for the mode. When active, it intercepts click events on `CardItem` components.
*   **Trigger**: `onClick` event on card grid item.
*   **Logic**:
    1. Check `isQuickAddMode`.
    2. If TRUE: Execute `toggleOwnership()` -> Update Local Set -> Async API Call.
    3. If FALSE: Execute `openModal()`.

### 5.2 API Strategy
To prevent database throttling during rapid interaction, the system uses an `upsert/delete` pattern via the Supabase client.
*   **Target Table**: `public.user_collections`
*   **Fields**: `user_id` (UUID), `card_id` (UUID), `quantity` (Int), `condition` (Enum).

## 6. Constraints & Limitations
*   **Bulk Limit**: While rapid, clicking more than 5 cards per second may trigger network-level rate limiting depending on environment configurations.
*   **Offline Mode**: Currently not supported; requires active connection for optimistic sync.

## 7. Revision History
| Version | Date | Description | Author |
| :--- | :--- | :--- | :--- |
| 1.0.0 | 2026-05-13 | Initial Specification & Implementation | System Analyst |
