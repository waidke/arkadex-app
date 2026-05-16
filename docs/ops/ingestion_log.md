# ArkaDex Ingestion Log

This document records all production data ingestion events, row counts, and verification status for the ArkaDex MVP.

---

## 1. Summary of All Ingestions

| Date | Set Code | Set Name | Cards Ingested | Status |
| :--- | :--- | :--- | :--- | :--- |
| 2026-05-16 | SV9s | Ikatan Takdir | 185 | ✅ Success (Manual SQL) |
| 2026-05-16 | SV8s | Kilat Rasi | 244 | ✅ Success (Manual SQL) |

---

## 2. Detailed Ingestion Records

### 2.1 M2-Content Initial Batch — 2026-05-16
**Objective:** Baseline data for 2 most recent IDN expansions (PRD KR1).

#### A. Set Ingestion
- **Batch ID:** `batch_20260516_sets`
- **Method:** SQL `UPSERT` via Supabase Dashboard
- **Target Sets:** 
  1. `SV9s` (Ikatan Takdir)
  2. `SV8s` (Kilat Rasi)
- **Status:** ✅ SUCCESS

#### B. Card Ingestion — Ikatan Takdir (SV9s)
- **Batch ID:** `batch_20260516_sv9s`
- **Rows:** 185
- **Method:** Multi-chunk SQL `UPSERT` (batch size 50)
- **Status:** ✅ SUCCESS
- **Audit:** 185 rows verified in DB via `COUNT(*)`

#### C. Card Ingestion — Kilat Rasi (SV8s)
- **Batch ID:** `batch_20260516_sv8s`
- **Rows:** 244
- **Method:** Multi-chunk SQL `UPSERT` (batch size 50)
- **Status:** ✅ SUCCESS
- **Audit:** 244 rows verified in DB via `COUNT(*)`

---

## 3. Post-Ingestion Verification (KR4) — T2.1 Phase B

- **Audit Report:** [docs/audits/T2.1-spot-check.md](../audits/T2.1-spot-check.md)
- **Date Completed:** 2026-05-17
- **Auditor:** Principal QA Engineer
- **Sample Size:** 45 cards (20 SV9s + 25 SV8s; stratified by rarity)
- **Fields Verified:** card_number, card_name, rarity, supertype, element, image_url
- **Critical Issues:** 0
- **Major Issues:** 0
- **Known Limitations:** L-001 — Rarity collapse SAR/UR/HR → SR (systematic, deferred to T2.2)
- **Audit Status:** CLOSED — PASS
- **Next Step:** T2.2 — KR4 Manual Audit (30 cards/set, full rarity verification)

---
**End of Log**
