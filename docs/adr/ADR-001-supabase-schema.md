# ADR-001: Supabase Database Schema Design

*   **Status**: Accepted
*   **Date**: 2026-05-15
*   **Author**: SA+Dev
*   **Deciders**: PM, DevSecOps

## Context

ArkaDex requires a robust data foundation to support the local Pokémon TCG (IDN) card collections. The primary challenge is maintaining the integrity of master data (Sets & Cards) while ensuring high performance for inventory input (*Quick-Add Mode*), with a target response time of `< 2 seconds`.

## Decision

We have adopted a PostgreSQL schema in Supabase with the following characteristics:

### 1. Primary Key Strategy
We use **UUID v4** for all tables. While natural keys (e.g., `set_code`) are available, UUIDs provide standard relationship flexibility within the Supabase ecosystem and ensure better data distribution.

### 2. Master-Transactional Separation
- **Master Data (`sets`, `cards`)**: Contains static reference data. Integrity is enforced via `UNIQUE(set_id, card_number)` constraints to prevent duplicate card entries.
- **Transactional Data (`user_cards`)**: Stores individual user inventory.

### 3. Performance Optimization (UPSERT-Friendly)
- The `user_cards` table implements a `UNIQUE(user_id, card_id)` constraint.
- This allows the frontend to perform `UPSERT` (Insert or Increment) operations in a single network request, which is critical for the *Quick-Add* feature's performance goals.

### 4. Security Preparation
- All transactional tables include a `user_id` column referencing `auth.users(id)`.
- This is a prerequisite for the Row Level Security (RLS) implementation executed in Phase C.

## Consequences

### Positive
- **Integrity**: Master data duplication is prevented at the database level.
- **Scalability**: The UUID strategy facilitates easier data synchronization and future scaling.
- **UX**: The UPSERT-friendly design directly enables the "Quick-Add" speed requirements.

### Negative / Trade-offs
- **Complexity**: UUIDs are less human-readable than serial integers during manual database inspection.
- **Normalization**: The normalized schema (Sets -> Cards -> UserCards) requires joins for some views, but prevents master data redundancy.

---
*Refer to [ADR-002 (RLS Strategy)](ADR-002-supabase-rls-strategy.md) for security implementation details.*
