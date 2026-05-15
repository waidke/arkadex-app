# ADR-003: Authentication & Progressive Gating Strategy

*   **Status**: Accepted
*   **Date**: 2026-05-15
*   **Author**: Principal Technical Writer
*   **Deciders**: PM, DevSecOps, SA+Dev

## Context

ArkaDex requires an authentication layer that satisfies three competing constraints:

1. **Frictionless Onboarding**: Users must experience the core value (Digital Binder) before
   being asked to log in. A hard authentication gate at entry kills conversion.
2. **Secure Data Persistence**: Once a user begins logging cards, their collection must be
   tied to a verified identity and synced across devices — local storage alone is insufficient.
3. **UU PDP Compliance**: Indonesian data privacy regulation (UU PDP) requires minimal PII
   collection. Storing passwords, phone numbers, or secondary identifiers is unnecessary risk.

These constraints were formalised in the [T1.2 Gating Tiers Definition](../specs/T1.2-gating-tiers.md)
and inform every decision below.

## Decision

We have implemented a **Google OAuth-only, progressive gating** authentication strategy with
three access tiers, server-side session management via Supabase SSR, and environment-based
admin access control.

### 1. Single OAuth Provider (Google Only)

Only Google OAuth is enabled. Email/password signup, magic links, and all other social
providers (Apple, GitHub, etc.) are explicitly disabled.

- **Rationale**: Reduces attack surface, eliminates password storage liability, and satisfies
  UU PDP data minimalism — Google's identity token provides `email` and `profile` only.
- **Implementation**: `[auth.external.google] enabled = true` in `supabase/config.toml`;
  `[auth.email] enable_signup = false` both locally and in the Supabase Dashboard.
- **Local Dev Note**: `skip_nonce_check = true` is set in `config.toml` for the local
  Supabase CLI stack only. The hosted production instance enforces standard OIDC nonce
  validation. This flag has no effect on the deployed application.

### 2. Three-Tier Progressive Gating

Access is segmented into three tiers that users traverse organically:

| Tier | Role | Access | Trigger |
| :--- | :--- | :--- | :--- |
| **Tier 1 — Anonymous** | `anon` | Read catalog (`sets`, `cards`) | Default on first visit |
| **Tier 2 — Authenticated** | `authenticated` | Log collection, sync to cloud | OAuth login |
| **Tier 3 — Admin/Owner** | `authenticated` + whitelist | `/admin/*` CMS routes | Email in `ADMIN_EMAIL_WHITELIST` |

The user journey follows a **"Try-then-Commit"** pattern: anonymous users browse freely;
a non-intrusive prompt appears only when they attempt to save a card to the cloud.

### 3. Server-Side Session Management (Supabase SSR)

Session tokens are stored in secure HTTP-only cookies managed by `@supabase/ssr`, not
in `localStorage`. Two distinct client factories are used:

- **`createServerSupabase()`** (`src/lib/supabase-server.ts`): Used in Route Handlers
  (e.g., `/auth/callback`). Reads and writes cookies via `next/headers`. A try/catch on
  `setAll()` handles the read-only constraint in Server Components gracefully.
- **`createMiddlewareSupabase(request, response)`** (`src/lib/supabase-server.ts`): Used
  exclusively in `src/middleware.ts`. Reads from `request.cookies` and writes refreshed
  session cookies directly onto the `NextResponse` object.

> [!IMPORTANT]
> Middleware uses `supabase.auth.getUser()`, not `getSession()`. `getUser()` validates the
> JWT against the GoTrue server on every request — the only safe method for authorization
> decisions. `getSession()` reads unverified cookie state and must never be used for access
> control.

### 4. PKCE Callback & Open Redirect Prevention

The OAuth flow uses PKCE (Proof Key for Code Exchange), handled at `src/app/auth/callback/route.ts`:

1. Google redirects to Supabase GoTrue with an authorization code.
2. GoTrue redirects to `/auth/callback?code=<pkce_code>`.
3. The route handler calls `supabase.auth.exchangeCodeForSession(code)`.
4. On success, the session cookie is written and the user is redirected to `next` or `/binder`.

The `next` redirect parameter is validated with a `startsWith('/')` guard to prevent
open-redirect attacks. Absolute URLs (e.g., `//evil.com`) are rejected and fall back to
`/binder`. Auth errors redirect to `/?message=auth_error`.

> [!CAUTION]
> The `?message=auth_error` and `?message=unauthorized` query parameters are written by
> the middleware and callback route, but no UI component currently renders them as user-facing
> messages. This is deferred to M3 (Frontend). Users see a blank home page on auth failure.

### 5. Admin Access Control via Environment Whitelist

Admin status is determined exclusively by the `ADMIN_EMAIL_WHITELIST` environment variable
— a comma-separated list of authorized email addresses.

`ADMIN_EMAIL_WHITELIST=admin@example.com, owner@example.com`

The middleware normalises entries with `.trim().toLowerCase()` and compares
case-insensitively against the verified user email from `getUser()`.

> [!WARNING]
> Admin status is intentionally **not stored in the database**. Storing it in a `roles`
> table or `user_metadata` would expose it to privilege escalation via SQL injection or
> Supabase policy misconfiguration. The environment variable is the single source of truth
> and can only be changed by a deployment with infrastructure access.

### 6. Anonymous-to-Authenticated Data Migration

When an anonymous user logs in for the first time, their local card collection (encrypted
in `localStorage` via `persistence.ts`) is merged into the `user_cards` table:

1. `onAuthStateChange` fires with event `SIGNED_IN` in `BinderGrid`.
2. `persistenceManager.loadCollection()` decrypts and reads local items.
3. All items are upserted to `user_cards` with `onConflict: 'user_id,card_id'`.
4. **Only after a confirmed successful upsert** is `persistenceManager.clearCollection()`
   called — the "Verify then Clear" pattern prevents data loss on network failure.

### 7. Rate Limiting

Per-IP rate limits are enforced at the Supabase Auth (GoTrue) layer:

| Event | Limit | Window |
| :--- | :--- | :--- |
| Sign-in / Sign-up | 30 requests | per 5 minutes |
| Token refresh | 150 requests | per 5 minutes |

Google's own OAuth infrastructure provides an additional layer of brute-force protection
for the credential verification step. Application-layer rate limiting is not required for
the current Personal Alpha phase.

### 8. Defence-in-Depth via HTTP Security Headers

All HTTP responses carry security headers configured in `vercel.json`:

| Header | Value | Purpose |
| :--- | :--- | :--- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforce HTTPS |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `Content-Security-Policy` | `default-src 'self'; connect-src *.supabase.co` | Restrict resource origins |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict browser APIs |

## Consequences

### Positive
- **Data Minimalism**: No passwords, no secondary contact methods — Google email only.
  Fully aligned with UU PDP data minimisation principles.
- **Security by Default**: RLS at the database layer means even a compromised frontend
  cannot access other users' data. Middleware provides a second enforcement layer for
  admin routes.
- **Frictionless Onboarding**: Tier 1 anonymous access requires zero friction. The auth
  gate appears only at the moment of cloud-sync intent.
- **Operational Simplicity**: Admin access is managed via a single environment variable —
  no admin dashboard, no role management UI, no database migrations needed to grant or
  revoke access.

### Negative / Trade-offs
- **Google Ecosystem Lock-in**: Users without a Google account cannot access Tier 2 or
  Tier 3 features. This is an acceptable constraint for the Indonesian TCG collector
  community target audience.
- **Admin Drift Risk**: `ADMIN_EMAIL_WHITELIST` must be updated manually per deployment
  when admin access changes. There is no self-service mechanism.
- **localStorage Merge Complexity**: The anonymous-to-authenticated transition requires
  careful "Verify then Clear" logic. A failed merge leaves data in `localStorage` silently;
  the user sees no error message (deferred to M3 UI).
- **Error Message Gap**: Auth failures (`?message=auth_error`, `?message=unauthorized`)
  are not surfaced to the user as human-readable messages in the current implementation.

## Cross-References

*   **Inputs**: [T1.2 Gating Tiers Definition](../specs/T1.2-gating-tiers.md)
*   **Foundation**: [ADR-001 — Supabase Schema](ADR-001-supabase-schema.md),
    [ADR-002 — RLS Strategy](ADR-002-supabase-rls-strategy.md)
*   **Security Audit**: [T1.2 Auth Hardening Report](../audits/T1.2-auth-hardening-report.md)
*   **QA Verification**: [T1.2 E2E Auth Test Report](../audits/T1.2-e2e-auth-test-report.md)
*   **Key Files**: `src/middleware.ts`, `src/app/auth/callback/route.ts`,
    `src/lib/supabase-server.ts`, `supabase/config.toml`
