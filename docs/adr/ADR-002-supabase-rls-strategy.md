# ADR-002: Supabase Row Level Security (RLS) Strategy

*   **Status**: Accepted
*   **Date**: 2026-05-15
*   **Author**: Principal Technical Writer
*   **Deciders**: PM, DevSecOps, SA+Dev

## Context

ArkaDex requires a secure multi-tenant architecture where:
1.  **Master Data** (Expansion Sets and Cards) must be publicly accessible for catalog browsing.
2.  **User Collections** (Inventory) must be strictly isolated, ensuring users can only see and modify their own data.
3.  **Security Baseline** must follow a "Default Deny" posture to prevent accidental data leaks during schema evolution.

## Decision

We have implemented a three-tier RLS strategy on the Supabase PostgreSQL layer:

### 1. Default Deny Baseline
Every table in the `public` schema has RLS enabled. Without an explicit policy, all operations (SELECT, INSERT, UPDATE, DELETE) are rejected by default.

### 2. Master Data Access (Public Read-Only)
Tables containing reference data (`public.sets`, `public.cards`) are configured with a `FOR SELECT` policy using `true`.
- **Allowed**: Read access for both anonymous (`anon`) and authenticated users.
- **Restricted**: All write operations (INSERT/UPDATE/DELETE) are blocked for all users. These operations are reserved for administrative scripts using the `service_role` key.

### 3. User Data Access (Strict Tenant Isolation)
The `public.user_cards` table implements strict row-level isolation based on the `auth.uid()` claim from the Supabase JWT.
- **Policies**: `SELECT`, `INSERT`, `UPDATE`, and `DELETE` are scoped to `auth.uid() = user_id`.
- **Validation**: `WITH CHECK` clauses are used on `INSERT` and `UPDATE` to ensure a user cannot spoof the `user_id` field in the payload to target another user's collection.

## Consequences

### Positive
- **Security by Design**: Direct database access via the Supabase Client is inherently safe. Even a compromised frontend cannot access other users' data.
- **Frontend Simplicity**: The frontend does not need complex filtering logic for "my cards"—PostgreSQL filters the results automatically based on the session token.

### Negative / Trade-offs
- **JWT Dependency**: Transactional operations require a valid authenticated session. Anonymous users cannot use "Quick-Add" features until converted to a user account.
- **Payload Strictness**: Frontend developers MUST include the correct `user_id` (matching their token) in `INSERT` payloads, or the database will reject the transaction with a policy violation.

---
*Refer to [ADR-001 (Schema Design)](ADR-001-supabase-schema.md) for data structure details and the [RLS Isolation Audit](../audits/rls_isolation_report.md) for validation results.*
