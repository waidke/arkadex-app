# ADR-006: Deployment & Environment Strategy

*   **Status**: Accepted
*   **Date**: 2026-05-16
*   **Author**: Principal Technical Writer
*   **Deciders**: PM, DevSecOps, SA+Dev

## Context

ArkaDex is a full-stack Next.js application that integrates with Supabase (Database/Auth) and relies on several environment-specific configurations. As we transition from M1 (Foundations) to M2 (Content), we need a formalized strategy for hosting, secret management, and environment isolation to ensure deployment stability.

## Decision

We have standardized on **Vercel** as the hosting platform, utilizing its native integration with GitHub for CI/CD and its environment variable management system.

### 1. Environment Classification
Access and configuration are divided into three tiers:
-   **Local Development**: `localhost:3000` with Supabase CLI local stack.
-   **Preview (Staging)**: Vercel preview deployments linked to GitHub Pull Requests.
-   **Production**: The primary application branch (`master`) deployed to the production URL.

### 2. Secret Management & Variable Scope
We strictly enforce a boundary between client-side and server-side variables:
-   **NEXT_PUBLIC_* Variables**: Only for non-sensitive values (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). These are baked into the client bundle.
-   **Server-Only Variables**: Sensitive keys (e.g., `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL_WHITELIST`) must **never** be prefixed with `NEXT_PUBLIC`. They are stored in Vercel's encrypted environment variable store and are accessible only in Route Handlers, Server Components, and Server Actions.

### 3. CI/CD & Branching Strategy
-   **Push-to-Deploy**: Every push to `master` triggers a production build.
-   **Preview Deploys**: Pull Requests generate unique preview URLs, allowing QA to test features in an environment identical to production before merging.
-   **Migration Strategy**: Database migrations are managed via the Supabase CLI (`supabase db push`) and must be applied to the target environment before the corresponding application code is deployed.

### 4. Infrastructure Protection (vercel.json)
Standardized security headers are enforced across all deployments via `vercel.json` (see [ADR-003](ADR-003-auth-strategy.md) Section 8). This ensures consistency regardless of the deployment tier.

### 5. Rollback Procedure
Vercel's "Instant Rollback" feature is the primary recovery mechanism for the application layer. However, database schema changes are non-atomic and must be rolled back manually via SQL migration scripts if necessary.

## Consequences

### Positive
-   **High Velocity**: Integrated CI/CD allows for rapid iteration and testing.
-   **Security**: Minimal exposure of sensitive keys via strict naming conventions and Vercel's encrypted store.
-   **Consistency**: Identical configuration across preview and production environments reduces "works on my machine" issues.

### Negative / Trade-offs
-   **State Drift**: The application code (Vercel) and database schema (Supabase) are deployed separately. A failed database migration can leave the application in a broken state until manual intervention occurs.
-   **Vendor Lock-in**: Deep integration with Vercel/Supabase features (like Preview Deploys) makes migration to other providers more complex.

## Cross-References

*   **Security Foundation**: [ADR-003 (Auth Strategy)](ADR-003-auth-strategy.md), [ADR-005 (Auth Umbrella)](ADR-005-auth-umbrella.md)
*   **Database Management**: [ADR-001 (Schema)](ADR-001-supabase-schema.md)
*   **Key Files**: `vercel.json`, `.env.local`, `supabase/migrations/`
