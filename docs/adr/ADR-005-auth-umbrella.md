# ADR-005: Cross-cutting Authentication & Authorization Umbrella

*   **Status**: Accepted
*   **Date**: 2026-05-16
*   **Author**: Principal Technical Writer
*   **Deciders**: PM, DevSecOps, SA+Dev

## Context

Authentication and authorization in ArkaDex are not isolated to a single component but span the entire stack—from the database layer (RLS) to the application middleware and server-side actions. 

While [ADR-001](ADR-001-supabase-schema.md) and [ADR-002](ADR-002-supabase-rls-strategy.md) established the data and RLS foundations, and [ADR-003](ADR-003-auth-strategy.md) defined the specific Google OAuth implementation, there is a need for a consolidated "Umbrella" architecture that defines how these layers interlock to form a secure boundary.

## Decision

We have implemented a multi-layered security architecture that integrates Supabase Auth, Next.js Middleware, and Server Actions into a cohesive protection model.

### 1. Authentication Decision Tree
Access follows a progressive gating model:
1.  **Anonymous (`anon`)**: Access to public catalog data (`sets`, `cards`) via RLS `FOR SELECT` policies.
2.  **Authenticated (`authenticated`)**: Access to personal collection data (`user_cards`) via RLS `auth.uid() = user_id` policies. Triggered by Google OAuth login.
3.  **Admin/Owner**: Access to CMS management routes (`/admin/*`) and write-heavy Server Actions. Restricted by an environment-based email whitelist.

### 2. Session Lifecycle & Sovereignty
The application uses **Server-Side Rendering (SSR)** session management via `@supabase/ssr`.
-   **Storage**: Sessions are stored in secure, HTTP-only, partitioned cookies.
-   **Validation**: Authentication decisions (in Middleware and Server Actions) use `supabase.auth.getUser()`. This ensures the JWT is validated against the Supabase GoTrue server on every request, preventing the use of stale or forged client-side sessions.
-   **Persistence**: Anonymous data in `localStorage` is migrated to the cloud only upon first verified login (the "Verify then Clear" pattern).

### 3. Admin Access Control (Whitelist-based)
Admin authorization is decoupled from the database role system to prevent privilege escalation via SQL injection.
-   **Source of Truth**: `ADMIN_EMAIL_WHITELIST` environment variable.
-   **Verification**: Middleware and `assertAdmin()` check the verified user email against this whitelist case-insensitively.
-   **Isolation**: No `is_admin` flag exists in the database; even a database leak cannot grant administrative access to the application layer.

### 4. RLS Integration (The Final Gate)
Row Level Security (RLS) acts as the final enforcement layer.
-   **Policy Scope**: All transactional tables (`user_cards`) use `auth.uid()` to isolate data.
-   **Service Role Bypass**: Administrative write operations (e.g., bulk ingestion) use the `service_role` key within protected Server Actions. This key bypasses RLS but is never exposed to the client.

### 5. Security Boundaries
Security is enforced at two distinct boundaries:
-   **Navigation Boundary**: `src/middleware.ts` intercepts requests to `/admin/*` and redirects unauthorized users to `/binder`.
-   **Execution Boundary**: Each sensitive Server Action (e.g., `commitIngestion`) calls `assertAdmin()` internally. This protects the logic even if the middleware is bypassed or the action ID is discovered.

## Consequences

### Positive
-   **Defense-in-Depth**: Multiple layers (Middleware, Server Actions, RLS) must be breached simultaneously to compromise data.
-   **Zero Trust Architecture**: Every request is re-validated via `getUser()`; no trust is placed in unverified cookie state.
-   **Operational Safety**: Admin access is non-persistent and easily revocable via infrastructure configuration.

### Negative / Trade-offs
-   **Latency**: Calling `getUser()` on every request adds a round-trip to the Supabase Auth server. This is mitigated by Next.js edge caching where possible.
-   **Email Dependency**: Admin access is tied strictly to the Google OAuth email; if a user's email changes, the whitelist must be updated.

## Cross-References

*   **Database Foundation**: [ADR-001 (Schema)](ADR-001-supabase-schema.md), [ADR-002 (RLS)](ADR-002-supabase-rls-strategy.md)
*   **Auth Implementation**: [ADR-003 (Auth Strategy)](ADR-003-auth-strategy.md)
*   **Ingestion Security**: [ADR-004 (Ingestion Strategy)](ADR-004-ingestion-strategy.md)
*   **Key Files**: `src/middleware.ts`, `src/app/admin/bulk-upload/actions.ts`, `src/lib/supabase-server.ts`
