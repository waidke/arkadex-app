# Feature Specification: F-XX — [Feature Name]

| Metadata | Detail |
| :--- | :--- |
| **Status** | Draft / Locked |
| **Owner** | Solo Dev |
| **Milestone** | M3 / M4 |
| **Last Updated** | YYYY-MM-DD |
| **Linked PRD** | PRD-ARK-001 §3.1 (row F-XX) |
| **Linked Hi-Fi** | `prototypes/F-XX/index.html` |
| **Linked Test** | `tests/e2e/F-XX.spec.ts` |

## 1. User Story
As a **[Persona]**, I want to **[Action]**, so that **[Benefit]**.

## 2. Acceptance Criteria (AC)
Mapped to `tests/e2e/F-XX.spec.ts`.

| ID | Criteria | Given/When/Then |
| :--- | :--- | :--- |
| **AC-01** | [Title] | Given... When... Then... |
| **AC-02** | [Title] | Given... When... Then... |

## 3. Technical Design (TDD)
### 3.1 Data Schema / RLS
- **Table**: `[table_name]`
- **RLS**: `[policy_description]`

### 3.2 API / Interface Contract
- **Input**: `[params]`
- **State Management**: `[zustand_logic]`

## 4. Visual States (Gate b)
- [ ] **Empty**: No data state.
- [ ] **Loading**: Skeleton or spinner.
- [ ] **Error**: Connectivity or auth failure.
- [ ] **Loaded**: Happy path UI.

## 5. Edge Cases
- [ ] [Scenario 1]
- [ ] [Scenario 2]
- [ ] [Scenario 3 — minimum 3 per DoD rubric]

## 6. Out of Scope
Eksplisit listed — apa yang TIDAK di-handle feature ini:
- [item 1]
- [item 2]

## 7. Success Metric
- **Event**: `[event_name]`
- **Target**: [angka konkret]
- **Time window**: [duration]

## 8. Open Questions
Resolve all before marking Spec DoD passed.
- [ ] [Question 1]
- [ ] [Question 2]

---

## 9. DoD Self-Attestation
Paste checklist ini ke commit message saat merge spec PR. Lihat full rubric di `docs/process/artifact-rubric.md`.

```
Spec DoD (F-XX):
- [ ] 5+ AC Given/When/Then
- [ ] 3+ edge cases
- [ ] UI states explicit (Empty/Loading/Error/Loaded)
- [ ] Out-of-scope listed
- [ ] Success metric measurable
- [ ] Linked PRD bidirectional
- [ ] No unresolved Open Questions

TDD DoD:
- [ ] Schema impact + SQL snippet
- [ ] API contract (path/method/payload/response)
- [ ] State decision per data piece
- [ ] Auth & RLS path
- [ ] Performance budget (if relevant)
- [ ] Dependencies listed
```

---

## 10. Revision History
- **2026-05-15**: Template initialized.
