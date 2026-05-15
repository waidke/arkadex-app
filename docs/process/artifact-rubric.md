# Artifact Rubric: Quality Gates for ArkaDex MVP

This document defines the **Definition of Done (DoD)** for every artifact emitted during the development lifecycle. No gate may be unblocked until the corresponding artifact passes this rubric.

---

## 1. Trigger Matrix: When to Emit?

| Artifact | Trigger | Mandatory? |
| :--- | :--- | :--- |
| **Spec & TDD** | Start of Gate **a** | Yes |
| **Hi-Fi Prototype** | Start of Gate **b** | Yes |
| **Test Skeleton** | Start of Gate **c** | Yes |
| **Audit Report** | End of Infrastructure Tasks | Yes |
| **ADR** | Architecture decision or deviation | Yes |
| **Runbook** | Deployment or Ops Task | Yes |

---

## 2. Definition of Done (DoD) per Artifact

### 2.1 Spec & TDD (`docs/specs/F-XX.md`)
- [ ] **Goal Statement**: Clear description of user value.
- [ ] **Acceptance Criteria**: Minimum 3 testable scenarios.
- [ ] **Data Contract**: Table showing field name, type, and nullability.
- [ ] **API Contract**: Method, endpoint, and expected response schema.
- [ ] **Performance Budget**: Latency and bundle size constraints.
- [ ] **Error States**: Handled edge cases (e.g., 404, 403, 500).
- [ ] **Traceability**: Linked to PRD requirements.

### 2.2 Hi-Fi Prototype (`prototypes/F-XX/index.html`)
- [ ] **States**: Includes Loading, Empty, Success, and Error states.
- [ ] **Interactivity**: All primary buttons and links are functional.
- [ ] **Tailwind Parity**: Uses design tokens (Glassmorphism, Neon).
- [ ] **Responsive**: Verified at 360px, 768px, and 1280px.
- [ ] **Test IDs**: `data-testid` attributes present for E2E.
- [ ] **A11y**: Contrast ratio ≥ 4.5:1 for all text.
- [ ] **No Placeholders**: Real content or high-quality mock data.

### 2.3 E2E Test Skeleton (`tests/e2e/F-XX.spec.ts`)
- [ ] **Coverage**: Covers all AC scenarios defined in the Spec.
- [ ] **Isolated**: Tests are independent and don't rely on state from others.
- [ ] **Clean-up**: Includes `afterEach` or `afterAll` to reset data.
- [ ] **Skip Mode**: Initially committed with `.skip()` as a contract.
- [ ] **Environment**: Uses standard `BASE_URL` and `TEST_USER` env vars.

---

## 3. Stop Iterating Signals

Iteration on an artifact must stop if:
1. **Diminishing Returns**: Further changes don't affect the functional outcome or security posture.
2. **Spec Lock**: Gate **a** has been signed off by the PM persona.
3. **Time-Box Expired**: The phase duration has reached 120% of its breakdown estimate.

---

## 4. Fail-Safe Recovery

If a gate fails:
1. **Rollback**: Revert to the last known stable state of the artifact.
2. **Review**: PM and SA+Dev personas must hold a "5-Minute Triage" to adjust the spec or effort.
3. **Quarantine**: If the issue is persistent, isolate the task in a separate branch and move to the next parallel task.

---

## 5. 1-Page Cheat Sheet

| Task Type | Core Requirement | Persona Lead |
| :--- | :--- | :--- |
| **Infrastructure** | Security Audit & ADR | DevSecOps |
| **Feature** | a→e Gate Sequence | SA+Dev |
| **Audit/QA** | Test Report & Playwright | QA |
| **Policy/PM** | Acceptance & Gate Release | PM |

---

## Sign-off
*This rubric is self-attested by the solo dev switching hats between personas.*
