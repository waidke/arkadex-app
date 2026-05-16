# Runbook: Bulk Data Ingestion for IDN TCG Cards

**Owner:** Platform Ops / Admin Support  
**Last Updated:** 2026-05-16  
**Related ADR:** [ADR-004-ingestion-strategy.md](../adr/ADR-004-ingestion-strategy.md)  
**Status:** Operational (Conditional Pass, KR4 manual audit pending)

---

## 1. Overview

This runbook explains how an admin performs a bulk import of IDN TCG set and card data into the ArkaDex application using the Bulk Upload Admin Surface feature.

### 1.1 Purpose
- Import new data from TCGdex source (or other data providers) into the application database
- Ensure data quality before entering the database (dry-run preview is mandatory)
- Idempotent UPSERT to support re-import without duplication
- Complete audit trail for compliance & troubleshooting

### 1.2 When to Use
- **Before M2 Content milestone:** Load baseline set + card data for collection features
- **Regular updates:** When new cards/sets from TCGdex are available (typically monthly/quarterly)
- **Data correction:** If there is an error in existing card data (e.g., wrong rarity), re-import with corrected data

### 1.3 Who Can Access
- **Only Admin users** with email in `ADMIN_EMAIL_WHITELIST` environment variable
- Access point: `https://<app-url>/admin/bulk-upload`
- Non-admin access: 401 Unauthorized

---

## 2. Prerequisites

Before starting ingestion, verify:

| Checklist | Status |
|-----------|--------|
| You are logged in as an admin to the ArkaDex application | [ ] |
| Supabase database is running and accessible | [ ] |
| ArkaDex app is deployed (development/staging) | [ ] |
| CSV file is prepared from TCGdex or other data source | [ ] |
| You have access to a file editor (to edit CSV if there are errors) | [ ] |
| Internet connection is stable (upload + database write) | [ ] |

---

## 3. CSV Preparation Guide

### 3.1 Sets CSV Format

The file for importing sets must have this structure:

**Filename:** `sets_YYYYMMDD.csv` (e.g., `sets_20260516.csv`)

**Header row (REQUIRED in first row):**
```
code,name,release_date,total_cards
```

**Example data rows:**
```
SV4,Scarlet & Violet,2023-03-09,200
SV4PT,Scarlet & Violet Promos,2023-03-10,50
SV5,Scarlet & Violet - Temporal Forces,2024-03-14,230
```

**Field requirements:**

| Field | Type | Required | Constraints | Example |
|-------|------|----------|-------------|---------|
| `code` | TEXT | YES | 2-10 chars, alphanumeric + dash, unique per set | `SV4`, `SV4PT`, `JPN-EX1` |
| `name` | TEXT | YES | 3-200 chars, allow space & special char | `Scarlet & Violet` |
| `release_date` | DATE | YES | Format `YYYY-MM-DD` | `2023-03-09` |
| `total_cards` | INTEGER | YES | 1-500, expect final card count | `200` |

**Special cases:**
- **Quoted values with comma:** If `name` contains a comma, use quotes: `"Scarlet & Violet, Special Edition",200`
- **BOM on Windows Excel:** Windows Excel files may have UTF-8 BOM marker — PapaParse handles this automatically, but if there is a parse error, save CSV as "UTF-8 without BOM"
- **Empty rows:** Do not have blank rows in the middle of data; if present, remove before uploading

---

### 3.2 Cards CSV Format

The file for importing cards must have this structure:

**Filename:** `cards_YYYYMMDD.csv` (e.g., `cards_20260516.csv`)

**Header row (REQUIRED in first row):**
```
set_code,card_number,card_name,rarity,supertype,element,image_url
```

**Example data rows:**
```
SV4,001/198,Sprigatito,C,Pokémon,Grass,https://tcgex.api.pokemontcg.io/image/sv4/001.png
SV4,002/198,Floragato,U,Pokémon,Grass,https://tcgex.api.pokemontcg.io/image/sv4/002.png
SV4,150/198,Cilan,U,Trainer,,https://tcgex.api.pokemontcg.io/image/sv4/150.png
SV4,195/198,Grass Energy,C,Energy,Grass,https://tcgex.api.pokemontcg.io/image/sv4/195.png
```

**Field requirements:**

| Field | Type | Required | Constraints | Example |
|-------|------|----------|-------------|---------|
| `set_code` | TEXT | YES | Must match existing `sets.code` | `SV4` |
| `card_number` | TEXT | YES | Format `NNN/NNN` or `N/N` (e.g., `001/198` or `1/60`); regex: `^\d{1,3}/\d{1,3}$` | `001/198`, `150/198` |
| `card_name` | TEXT | YES | 1-200 chars | `Sprigatito`, `Rayquaza VMAX` |
| `rarity` | ENUM | YES | C \| U \| R \| RR \| SR \| UR (case-sensitive) | `C`, `R`, `SR` |
| `supertype` | ENUM | NO | Pokémon \| Trainer \| Energy (case-sensitive) | `Pokémon`, `Trainer`, `Energy` |
| `element` | ENUM | NO | Grass \| Fire \| Water \| Lightning \| Psychic \| Fighting \| Dragon \| Colorless \| Metal | `Grass`, `Fire` |
| `image_url` | URL | YES | HTTPS only; valid image URL | `https://tcgex.api.pokemontcg.io/image/sv4/001.png` |

**Special cases:**
- **Trainer/Energy cards:** When `supertype=Trainer` or `Energy`, the `element` field is often empty (NULL) — this is valid, leave the field empty
- **Card number format:** Must be exact format `NNN/NNN` or `N/N`; if `1/198`, will be rejected (must be `001/198` or `1/1`)
- **Quoted values:** If `card_name` has special chars/comma, use quotes: `"Rayquaza, VMAX Edition",...`
- **Image URL validation:** HTTPS required (http:// will be rejected); test URL is accessible before uploading

---

### 3.3 CSV Validation Checklist

Before uploading, verify your local CSV:

```
[ ] Header row complete (sets: 4 columns; cards: 7 columns)
[ ] No blank rows in the middle of data
[ ] `card_number` format correct: NNN/NNN or N/N
[ ] `rarity` only: C, U, R, RR, SR, UR (case-sensitive)
[ ] `supertype` only: Pokémon, Trainer, Energy (case-sensitive, or empty)
[ ] `element` only enum value or empty (case-sensitive)
[ ] `image_url` all HTTPS, not HTTP
[ ] File size < 5 MB (typically: 500 rows ≈ 100-200 KB)
[ ] File encoding: UTF-8 (with or without BOM)
[ ] For sets: all `code` values unique, `release_date` format YYYY-MM-DD
[ ] For cards: all `set_code` values exist in existing sets table (if updating, or import sets first)
```

---

## 4. Ingestion Workflow (Step-by-Step)

### 4.1 Step 1: Login & Navigate

1. Open browser, navigate to `https://<your-arkadex-app>/admin/bulk-upload`
2. If not logged in: will redirect to login form
3. Login with your admin email
4. If access denied (403): your email is not in `ADMIN_EMAIL_WHITELIST`, contact platform ops

**Expected result:** Page displays "Bulk Upload Admin Surface" with two buttons:
- "Import Sets"
- "Import Cards"

---

### 4.2 Step 2: Select Import Mode

Select the mode based on the data you want to import:

**Option A: Import Sets**
- Click "Import Sets" button
- Page changes: form with label "Select a CSV file (Sets)"
- File input ready for file drop or click-to-select

**Option B: Import Cards**
- Click "Import Cards" button
- Page changes: form with label "Select a CSV file (Cards)"
- File input ready for file drop or click-to-select

---

### 4.3 Step 3: Upload CSV File

After selecting a mode, upload your CSV file:

**Method 1: Drag & Drop**
1. Drag CSV file to the highlighted upload area
2. File will be automatically selected and parsing will begin

**Method 2: Click to Select**
1. Click in the upload area or "Choose File" button
2. File browser opens
3. Select your CSV file
4. Click "Open"

**Expected result after upload:**
- Progress indicator: "Parsing CSV..." (< 1 second)
- File info displayed: "File: cards_20260516.csv (156 KB, 500 rows)"
- Preview table appears (first 10 rows of CSV)

**If file size > 5MB:**
- Error toast: "File size exceeds 5 MB. Please split into smaller batches."
- Action: Split CSV into multiple files, upload one by one

**If parsing error (invalid CSV format):**
- Error toast: "Parsing error: Unexpected field [field name] at row 45"
- Action: Open CSV in editor, check row 45, fix format, save, re-upload

---

### 4.4 Step 4: Run Dry-Run Preview

After the file is successfully parsed, click the **"Run Dry-Run"** button:

1. Button state: "Running..." (disabled, show spinner)
2. Backend performs:
   - Re-parse file (security check)
   - Schema validation per row
   - Cross-reference check (e.g., set existence for cards)
   - Conflict detection (which rows are NEW vs OVERWRITE)
3. Wait for results (target < 3 seconds)

**Expected result:**
- Preview table appears with 4 columns: Row#, Status, Data Preview, Error Message
- **Status badges:**
  - 🟢 **NEW:** Row will be inserted (new data, no conflict)
  - 🟡 **OVERWRITE:** Row will be updated (data already exists, value changed)
  - 🔴 **ERROR:** Row is not valid, will not be committed

**Example preview table:**
```
| Row | Status | Data Preview | Error Message |
|-----|--------|--------------|---------------|
| 1 | 🟢 NEW | code=SV5, name=Scarlet & Violet - TF | - |
| 2 | 🟡 OVERWRITE | code=SV4, name=Scarlet & Violet | Already exists, will update |
| 3 | 🔴 ERROR | card_number=123/abc, rarity=XX | Invalid card_number format; invalid rarity |
| 4 | 🟢 NEW | card_number=001/198, rarity=C | - |
```

**Summary stats above preview:**
```
Summary: X NEW, Y OVERWRITE, Z ERROR (Total X+Y+Z rows)
Ready to commit: X+Y rows will be saved to database
```

---

### 4.5 Step 5: Review Preview & Error Handling

Carefully read the preview table:

#### 5.1 If there are no ERROR rows (all GREEN + YELLOW)
- Proceed to step 6 (Commit)

#### 5.2 If there are ERROR rows (RED rows present)
**Action 1: Identify error cause**
- Click on ERROR row to expand error message
- Read error detail:
  - Example: "Invalid card_number format: '123/abc', expected pattern NNN/NNN or N/N"
  - Example: "Invalid rarity: 'XX', expected one of: C, U, R, RR, SR, UR"
  - Example: "Set not found: SV99 — ensure sets imported first"

**Action 2: Fix CSV & Retry**
- Click "Edit File" button (back to file selection)
- Open CSV in local editor (Excel, VS Code, etc.)
- Identify the error rows (use row number from preview)
- Fix the values (example: change `123/abc` to `123/200`)
- Save file
- Return to browser, re-upload the corrected file
- Click "Run Dry-Run" again
- If still errors, repeat the process until all rows are valid

**Action 3: Partial Commit (Optional, not recommended)**
- If error rows are only a few (< 5%) and not critical:
  - You can proceed to commit (skip error rows)
  - Preview will show "X rows will be skipped due to error"
  - Not recommended: better to fix CSV and re-import to ensure data quality

---

### 4.6 Step 6: Commit to Database

After you are satisfied with the preview (all rows valid or skip errors):

1. Click the **"Commit to Database"** button
2. Modal dialog appears: "Confirm Ingestion"
   - Title: "Review before final commit"
   - Stats: "X new sets, Y existing sets will be updated"
   - Buttons: "Cancel" | "Proceed"

3. **Review stats in modal:**
   - Verify the number of new vs overwrite matches expectations
   - Example: "10 new cards, 5 existing cards will be updated"
   - Example: "1 new set, 0 existing sets"

4. If you agree, click **"Proceed"**
   - Modal closes
   - Button state: "Committing..." (disabled, show spinner)
   - Backend executes UPSERT to database

5. Wait for results (target < 10 seconds)

**Expected result:**
- Success panel appears:
  ```
  ✅ Ingestion Complete
  Committed: 490 rows to database
  - 450 new cards inserted
  - 40 existing cards updated
  - 10 skipped due to error (see logs for details)
  
  Timestamp: 2026-05-16 14:35:22 UTC
  Session ID: ing_abc123xyz789
  ```

- "New Upload" button (reset to mode selection)

---

### 4.7 Step 7: Verification

After successful commit, verify that data has entered the database:

1. **Auto-verify in preview:**
   - Success panel displays "Committed: X rows"
   - If 0 rows committed, there is a problem (check error log)

2. **Manual spot-check (recommended):**
   - Navigate to `/collection` or `/admin/data-browser`
   - Search for cards/sets that were newly imported
   - Verify: card name, card number, rarity, image (visual check)
   - Example: search for "Sprigatito", verify image loads, rarity = C, element = Grass

3. **Database query (for ops):**
   ```sql
   -- Check sets count
   SELECT COUNT(*) FROM sets WHERE code LIKE 'SV%';
   
   -- Check cards count per set
   SELECT set_code, COUNT(*) as card_count FROM cards GROUP BY set_code;
   
   -- Check last ingestion session
   SELECT * FROM ingestion_logs WHERE session_id = 'ing_abc123xyz789' ORDER BY created_at DESC LIMIT 10;
   ```

---

## 5. Troubleshooting Guide

### Table: Common Errors & Solutions

| Error Message | Cause | Solution |
|---|---|---|
| **"Critical Error: Missing Sets"** | CSV cards reference set_code that does not exist | Import sets first (`sets_YYYYMMDD.csv`), verify `set_code` matches, then re-import cards |
| **"Empty file — no data rows found"** | CSV only has header, no data rows | Edit CSV, ensure at least 1 data row (after header), save, re-upload |
| **"File size exceeds 5 MB"** | CSV file > 5 MB | Split CSV: A) count total rows; B) divide into 2-3 files; C) upload one by one |
| **"Card number format invalid: '1/198'"** | card_number must be NNN/NNN or N/N pattern | Reformat: `001/198` (3 digit + 3 digit) or `1/1` (1 digit + 1 digit); not `1/198` (mixed) |
| **"Invalid rarity: 'rare'"** | rarity is case-sensitive; only C, U, R, RR, SR, UR | Update CSV: change 'rare' → 'R', 'uncommon' → 'U', etc. (uppercase) |
| **"Invalid element: 'grass'"** | element is case-sensitive; must be Grass, Fire, Water, etc. | Update CSV: 'grass' → 'Grass', 'fire' → 'Fire' (title case) |
| **"Image URL must be HTTPS"** | image_url in CSV uses http:// instead of https:// | Replace all `http://` → `https://` in CSV |
| **"Network error during commit"** | Connection lost during upload or database write | Retry: dry-run state remains, click "Commit to Database" again (idempotent UPSERT prevents duplication) |
| **"401 Unauthorized"** | Your email is not in ADMIN_EMAIL_WHITELIST | Contact platform ops to add your email to whitelist |
| **"Parsing error: Unexpected field X at row 45"** | CSV format invalid (e.g., missing quote, extra delimiter) | Edit CSV row 45, verify format (quote consistency, delimiter count), save as UTF-8, re-upload |

---

### FAQ & Edge Cases

**Q: Can I import cards without importing sets first?**
A: No. Cards CSV references set_code; if the set does not exist, you will get CRITICAL_ERROR. Import sets first, then cards.

**Q: If I need to update a card, how do I do it?**
A: Ingestion has UPSERT semantics. Re-import the card with new data (same set_code + card_number, updated name/rarity/image). Conflict policy will UPDATE, not INSERT duplicate.

**Q: If import fails halfway, is there partial data in the database?**
A: It depends on the failure phase:
- If it fails during validation (dry-run): NO data written (0 commit)
- If it fails during commit (network error): PARTIAL commit possible, see "Committed count" in success panel
- If partial commit occurs: re-import is safe (idempotent UPSERT)

**Q: Can I cancel commit after clicking "Proceed"?**
A: No. After clicking "Proceed", backend executes UPSERT immediately. If you want to cancel, you must wait for it to complete, then perform manual rollback (see section 7).

**Q: What if there is a typo in the CSV and it has already been committed?**
A: Re-import with the corrected CSV. Idempotent UPSERT will update old values with new ones.

---

## 6. KR4 Data Quality Verification (Manual Audit)

Milestone M1 has Key Result KR4: "Data quality gate for bulk ingestion 500+ cards". To verify KR4 before M2 Content kick-off, perform a manual audit:

### 6.1 Sample Size

- Audit at least **10% of total cards** or **min 20 cards**, whichever is larger
- Example: If importing 500 cards, audit min 50 cards; if importing 150 cards, audit min 20 cards
- Random selection: use a random row picker for objective sampling

### 6.2 Audit Checklist

For each sampled card, verify against source data (TCGdex or original provider):

| Attribute | Check | Pass/Fail | Notes |
|-----------|-------|----------|-------|
| **set_code** | Match source set code | [ ] | Example: SV4 |
| **card_number** | Exact match format | [ ] | Example: 001/198 (not 1/198) |
| **card_name** | Exact match or minor typo ok | [ ] | Example: "Sprigatito" |
| **rarity** | Match source rarity (C/U/R/RR/SR/UR) | [ ] | Verify against TCGdex |
| **supertype** | Pokémon/Trainer/Energy match source | [ ] | Or empty if not applicable |
| **element** | Match source element type | [ ] | Example: Grass, Fire, etc. |
| **image_url** | Image loads (no 404), visually correct | [ ] | Open URL in browser, verify card artwork |

### 6.3 Severity Levels

Classify findings:

- **Critical:** Card name completely wrong, image 404, set_code mismatch
- **Major:** Rarity wrong, supertype wrong, card number typo
- **Minor:** Image aspect ratio off, small text formatting issue

### 6.4 Sign-off Documentation

Document audit results:

```markdown
## KR4 Data Quality Audit — 2026-05-16

**Auditor:** [Your Name]  
**Date Completed:** 2026-05-16  
**Import Session:** ing_abc123xyz789  
**Sample Size:** 50 cards (10% of 500 imported)

### Summary
- Cards sampled: 50
- Cards passed: 50
- Critical issues: 0
- Major issues: 0
- Minor issues: 0

### Findings
[List each issue found, or "No issues found"]

### Recommendation
✅ APPROVED for M2 Content milestone
```

Save file in `docs/audit/KR4-2026-05-16.md` or shared audit log.

### 6.5 Pass Criteria

KR4 sign-off requirement:
- **0 Critical issues** (data fundamentally wrong)
- **0 Major issues** (attribute wrong, prevent functional use)
- Minor issues acceptable (cosmetic, do not block feature)

If there are Critical or Major issues: reject import, fix CSV, re-import, audit again.

---

## 7. Rollback Procedure

If a critical error is discovered post-commit (during audit or within 24 hours):

### 7.1 Identify Affected Data

Query the database to identify what was imported:

```sql
-- Check last ingestion session
SELECT session_id, mode, committed_count, created_at 
FROM ingestion_logs 
ORDER BY created_at DESC LIMIT 1;

-- List cards from that session (via ingestion_logs detail)
SELECT * FROM ingestion_logs_detail 
WHERE session_id = 'ing_abc123xyz789' 
AND status = 'committed' 
LIMIT 20;
```

### 7.2 Manual Rollback (SQL Delete)

**⚠️ WARNING: Destructive operation. Execute only if critical error is confirmed.**

```sql
-- Delete cards from specific set (example: SV4)
DELETE FROM cards 
WHERE set_id = (SELECT id FROM sets WHERE code = 'SV4')
AND created_at >= '2026-05-16 14:00:00'::timestamp;

-- Delete entire set if needed (rare)
DELETE FROM sets WHERE code = 'SV4' AND created_at >= '2026-05-16 14:00:00'::timestamp;

-- Verify deleted
SELECT COUNT(*) FROM cards WHERE set_id = (SELECT id FROM sets WHERE code = 'SV4');
```

### 7.3 Re-import Corrected Data

1. Fix CSV file with correct data
2. Upload & run dry-run again
3. Commit again
4. Audit results

**Better approach:** Not delete + re-import, but **update via re-import**:
- Idempotent UPSERT means re-importing the fixed CSV will update fields for matching rows
- No delete needed, simpler operation

---

## 8. References & Related Documentation

### Primary Documents
- **[ADR-004-ingestion-strategy.md](../adr/ADR-004-ingestion-strategy.md)** — Architecture decision & rationale
- **[F-03-lean-cms.md](../features/F-03-lean-cms.md)** — Functional spec & requirements
- **[F-03-ingestion-audit.md](../audit/F-03-ingestion-audit.md)** — KR4 audit checklist & results

### Implementation Reference
- **src/app/admin/bulk-upload/page.tsx** — Admin UI page
- **src/app/admin/bulk-upload/actions.ts** — Server actions (commitIngestion, etc.)
- **src/app/admin/bulk-upload/csv-validator.ts** — CSV validation logic
- **src/lib/ingestion.ts** — Types & utility functions

### Database & Migrations
- **supabase/migrations/20260516003330_add_supertype_element_to_cards.sql** — Schema migration
- **supabase/migrations/[earlier]_create_ingestion_logs.sql** — Audit logging table

### Support & Escalation
- **Slack channel:** #arkadex-ops (for troubleshooting)
- **On-call runbook:** [link to incident response guide]
- **PM contact:** [PM email for data spec questions]

---

**End of Runbook**

---

### Appendix A: CSV Template Files

Admins can download templates from `/admin/bulk-upload/templates/`:

1. **sets_template.csv**
   ```
   code,name,release_date,total_cards
   ```

2. **cards_template.csv**
   ```
   set_code,card_number,card_name,rarity,supertype,element,image_url
   ```

Admin copies template, fills with data, saves, re-uploads.

---

### Appendix B: Known Limitations (M1 → M2)

Features deferred to M2:

1. **Error row re-import UI:** M1 has error list, but no UI to re-import only error rows. M2 will add "Re-import Errors" feature.
2. **Batch status tracking:** M1 does not have real-time progress bar during commit. M2 will add progress indicator.
3. **Conflict resolution UI:** M1 auto-OVERWRITE. M2 will add option to "Skip existing" vs "Overwrite".
4. **CSV editor integration:** M1 requires manual CSV edit outside app. M2 will consider inline CSV editor for quick fix.

---

### Appendix C: Performance & Limits Reference

| Metric | Target | Tested? |
|--------|--------|---------|
| CSV parse time (500 rows) | < 1 sec | Assumed (not profiled) |
| Dry-run validation time (500 rows) | < 3 sec | Assumed |
| Commit time (500 rows) | < 10 sec | Assumed |
| File size limit | 5 MB | Enforced |
| Row limit | 500 (cards) / 50 (sets) | Enforced |

**Note:** Performance testing (Gate e) deferred post-M1. Recommend profiling pre-M2 Content.
