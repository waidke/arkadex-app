# Feature Specification: F-03 — Lean CMS Bulk Ingestion

| Metadata | Detail |
| :--- | :--- |
| **Status** | Draft |
| **Owner** | Solo Dev |
| **Milestone** | M1 |
| **Last Updated** | 2026-05-16 |
| **Linked PRD** | PRD-ARK-001 §3.1 (row F-03) |
| **Linked Hi-Fi** | `prototypes/F-03/index.html` |
| **Linked Test** | `tests/e2e/F-03.spec.ts` |

---

## 1. User Story

As an **Admin (email in ADMIN_EMAIL_WHITELIST)**, I want to **import TCG set and card data into the ArkaDex database via CSV file with dry-run preview before commit**, so that **the card catalog can be populated in bulk without the risk of data corruption due to invalid input or missing sets in the database**.

---

## 2. Acceptance Criteria (AC)

Mapped to `tests/e2e/F-03.spec.ts`.

| ID | Criteria | Given/When/Then |
| :--- | :--- | :--- |
| **AC-01** | Happy path import cards (NEW) | **Given** admin login + mode "Import Cards"; **When** upload valid `cards.csv` (≤500 rows, ≤5MB, all set_code exists in DB) + click "Run Dry-Run"; **Then** preview table shows all NEW rows, stats `total=N, new=N, overwrite=0, error=0`, "Commit" button active |
| **AC-02** | Happy path import sets | **Given** admin login + mode "Import Sets"; **When** upload valid `sets.csv` (≤50 rows, ≤5MB); **Then** preview table shows NEW or OVERWRITE, 0 ERROR, admin can commit |
| **AC-03** | Dry-run mandatory before commit | **Given** file is selected; **When** dry-run has not been executed or result is critical error; **Then** "Commit to Database" button is disabled |
| **AC-04** | Critical error — set not found | **Given** one or more `set_code` in `cards.csv` not found in `sets` table; **When** dry-run is executed; **Then** critical error banner displays with missing set names, entire batch rejected, commit button disabled, "Switch to Import Sets" shortcut appears |
| **AC-05** | Error per row — field validation | **Given** `cards.csv` contains rows with `card_number` not matching regex or invalid enum for `rarity`/`supertype`/`element`; **When** dry-run is executed; **Then** row marked ERROR with inline message `"Row N: field — message"`, valid rows remain NEW/OVERWRITE, warning banner appears, commit button active for valid rows |
| **AC-06** | Admin-only access | **Given** user is not authenticated or email not in `ADMIN_EMAIL_WHITELIST`; **When** accessing `/admin/bulk-upload`; **Then** middleware redirects to `/` — page is never rendered |
| **AC-07** | Hard limit rejected in dropzone | **Given** file `cards.csv` > 500 rows or > 5MB (or `sets.csv` > 50 rows); **When** file is dropped; **Then** error appears in dropzone without starting dry-run, explicit message states which limit was violated |

---

## 3. Technical Design (TDD)

### 3.1 Data Schema & RLS

**Tables involved:** `sets` and `cards` (schema already final from T1.3 Option B migration).

**Relevant `cards` columns:**
```sql
id UUID PK
set_id UUID FK → sets.id
card_number TEXT NOT NULL
name TEXT NOT NULL
rarity TEXT nullable
supertype TEXT nullable
element TEXT nullable
image_url TEXT nullable
UNIQUE(set_id, card_number)
```

**Migration:** No new migration. T1.3 Option B is already final and includes the addition of `supertype` and `element` columns.

**RLS Write Path — Server Action:**

Client component **does not** call Supabase directly for write operations. The flow is:
1. Client selects CSV file and runs dry-run (parsing & validation on client)
2. After preview, admin clicks "Commit to Database"
3. Client calls Server Action at `src/app/admin/bulk-upload/actions.ts`
4. Server Action uses `SUPABASE_SERVICE_ROLE_KEY` (server-only environment variable, never sent to browser)
5. Route `/admin/bulk-upload` is already secured by middleware whitelist — service role key is only needed to bypass RLS at the database layer

**Auto-update `total_cards`:**
After successfully committing cards, the Server Action calculates `COUNT(cards)` per `set_id` that was imported and updates `sets.total_cards` in the same transaction as the card upsert.

---

### 3.2 API & Interface Contract

**Pipeline:** `File Drop → PapaParse → Validation Layer → Dry-Run Resolver → State Machine → Server Action (commit)`

#### TypeScript Interfaces (`src/types/ingestion.ts`)

```typescript
export interface ParsedCard {
  set_code: string;
  card_number: string;
  card_name: string;
  rarity: string;
  supertype: string;
  element?: string;
  image_url?: string;
}

export interface ParsedSet {
  code: string;
  name: string;
  release_date?: string;
  total_cards?: string;
}

export type DryRunStatus = 'NEW' | 'OVERWRITE' | 'ERROR';

export interface DryRunRow {
  rowIndex: number;       // 1-based
  status: DryRunStatus;
  setCode: string;
  cardNumber?: string;
  name: string;
  rarity?: string;
  errors?: string[];      // empty if not ERROR
}

export interface IngestionStats {
  total: number;
  newCount: number;
  overwriteCount: number;
  errorCount: number;
}
```

#### State Machine — `useReducer` Discriminated Union

```typescript
type IngestionState =
  | { status: 'idle' }
  | { status: 'file-selected'; file: File; mode: 'cards' | 'sets' }
  | { status: 'dry-running'; file: File; mode: 'cards' | 'sets' }
  | { status: 'preview'; rows: DryRunRow[]; stats: IngestionStats; mode: 'cards' | 'sets'; file: File }
  | { status: 'critical-error'; missingSets: string[]; file: File; mode: 'cards' | 'sets' }
  | { status: 'confirm-modal'; rows: DryRunRow[]; stats: IngestionStats; mode: 'cards' | 'sets' }
  | { status: 'committing'; stats: IngestionStats }
  | { status: 'success'; stats: IngestionStats }
  | { status: 'error-fatal'; message: string }
```

#### Server Action Contract (`src/app/admin/bulk-upload/actions.ts`)

```typescript
'use server';

export async function commitIngestion(
  rows: DryRunRow[],
  mode: 'cards' | 'sets'
): Promise<{ success: boolean; committed: number; errors: string[] }>
```

- Upsert in chunks of 100 rows per batch
- Conflict resolution: `onConflict: 'set_id,card_number'` for cards, `onConflict: 'code'` for sets
- After committing cards: update `sets.total_cards` for each `set_id` involved
- Partial commit acceptable — if chunk fails, log error and continue to next chunk
- All operations in the same transaction for data consistency

#### CSV Parser Configuration

```typescript
import Papa from 'papaparse';

const result = Papa.parse<ParsedCard | ParsedSet>(text, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (h) => h.trim(),
});
```

**Dependensi baru:**
- `papaparse`
- `@types/papaparse`

---

## 4. Visual States (Gate b)

Mapping to prototype at `prototypes/F-03/index.html`.

| State | Condition | Key Elements |
| :--- | :--- | :--- |
| **Idle** | Page opened / after reset | Empty dropzone, "Run Dry-Run" button disabled, mode selector (Import Sets / Import Cards) |
| **File Selected** | Valid file dropped | File name + size displayed, "Run Dry-Run" button active |
| **Dry-Run Processing** | "Run Dry-Run" button clicked | Spinner, log stream (optional), no button active |
| **Preview Clean** | Dry-run complete, 0 errors | Table with NEW+OVERWRITE rows, IngestionStats (total/new/overwrite/error), "Commit to Database" button active |
| **Preview with Errors** | Dry-run complete, ERROR rows present | Table with status column (NEW/OVERWRITE/ERROR), inline error message per row, warning banner, "Commit to Database" button active (partial commit) |
| **Critical Error** | Set not found | Error banner with list of missing sets, NO "Commit to Database" button, "Switch to Import Sets" shortcut |
| **Confirm Modal** | "Commit to Database" button clicked | Modal overlay: X new / Y overwrite / Z skip (error rows), "Confirm Commit" + "Cancel" buttons |
| **Committing** | "Confirm Commit" button clicked | Progress bar or spinner, all buttons disabled, status message |
| **Success** | Commit complete without errors | Final stats (committed rows), "Import More" button (reset state), optional success toast |
| **Error Fatal** | Network failure during commit | Detailed error message + "Retry" button (return to preview) + "Cancel" button, data is idempotent (check committed rows in DB) |

---

## 5. Edge Cases

| # | Scenario | Behavior |
| :--- | :--- | :--- |
| **EC-01** | Card name contains comma in quoted field (e.g. `"Pikachu, Star"`) | PapaParse handles correctly per standard CSV rules. Naive `split(',')` would fail — this is the main regression test in Gate c. |
| **EC-02** | Duplicate `(set_code, card_number)` within one batch | Second and subsequent duplicate rows marked ERROR with message `"Row N: duplicate of row M in this batch"` |
| **EC-03** | CSV file with BOM (from Windows Excel) | PapaParse handles BOM by default; header is not corrupted |
| **EC-04** | Network failure during commit (chunk 3 of 5 fails) | Server Action returns `{ success: false, committed: N, errors: [...] }`. Already committed data remains valid (upsert is idempotent). Client displays error-fatal state with info on how many rows already committed, with retry or discard options. |
| **EC-05** | File contains only header without data rows | Dry-run returns error "Empty file — no data rows found" without starting batch processing |

---

## 6. Out of Scope

Explicitly listed — what this feature does NOT handle:

- **JSON import** — CSV only (confirmed in Phase 0)
- **Auto-create set from cards.csv** — set must already exist in database
- **Bulk delete / deactivate** — F-03 only upserts (add or update existing)
- **Image upload / hosting** — `image_url` is an external URL, not a file upload
- **Audit log / import history** — no `ingestion_log` table in M1
- **Multi-file in one session** — one file per session (reset after commit or cancel)

---

## 7. Success Metric

| Metric | Target | Window |
| :--- | :--- | :--- |
| **KR4 — card population** | ≥ 2 IDN sets imported without errors (per T2.1 spec) | Before end of M1 |
| **Dry-run latency** | < 3 seconds for 500 rows (including set resolution query) | Per-run, P95 latency |
| **Commit latency** | < 10 seconds for 500 cards (chunk 100/batch) | Per-run, P95 latency |
| **Error false-positive** | 0% — valid rows not marked ERROR | Per-run, regression test in Gate c |
| **Admin redirect** | 100% — non-whitelist user always redirected to `/` | Gate e (authentication gate) |

---

## 8. Open Questions

All Open Questions from Phase 0 & Phase A are now locked:

- **OQ-01 (write path):** ✅ Server Action at `src/app/admin/bulk-upload/actions.ts` + `SUPABASE_SERVICE_ROLE_KEY`
- **OQ-03 (JSON):** ✅ CSV only (out of scope)
- **OQ-04 (total_cards):** ✅ Auto-update after commit via Server Action, not DB trigger
- **OQ-05 (test path):** ✅ Moved to `tests/e2e/F-03.spec.ts` (Gate c convention)
- **OQ-06 (file size):** ✅ Both limits apply — 500 rows cards / 50 rows sets AND max 5MB

---

## 9. DoD Self-Attestation

Paste this checklist into the commit message when merging the spec PR. See full rubric at `docs/process/artifact-rubric.md`.

```
Spec DoD (F-03):
- [ ] 7 AC Given/When/Then (≥5 minimum met)
- [ ] 5 edge cases documented
- [ ] 10 visual states explicit
- [ ] 6 out-of-scope items listed
- [ ] Success metric measurable
- [ ] Linked PRD & Hi-Fi bidirectional
- [ ] 0 unresolved Open Questions

TDD DoD:
- [ ] Schema impact: T1.3 Option B already final, no new migration
- [ ] API contract: pipeline PapaParse → validation → dry-run → Server Action documented
- [ ] State machine: useReducer discriminated union, 9 states
- [ ] Auth & RLS: middleware whitelist + Server Action service role key
- [ ] Performance budget: dry-run <3s, commit <10s for 500 rows
- [ ] Dependencies: papaparse, @types/papaparse
```

---

## 10. Revision History

- **2026-05-16**: Feature specification created from plan `devsecops-agent-buat-plan-sprightly-russell.md`. All OQ decisions locked, ready for Phase B implementation (Gate b).
