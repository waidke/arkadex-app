---
title: Test Case Specification - Quick-Add Mode
version: 1.0.0
owner: QA Engineering
---

# Test Case Specification: US-02 Quick-Add Mode

## 1. Test Environment & Configuration
*   **Platform**: Web (Desktop/Mobile Responsive)
*   **Browser Coverage**: Chrome (Latest), Safari (Latest)
*   **Data Set**: SV1S Scarlet ex (78 Cards)
*   **Identity**: Valid Mock User (UUID: 7a705556-7518-48e4-9fbd-4d72747105f5)

## 2. Test Suite: Functional & Non-Functional

### 2.1 Mode Management (UI/UX)
| ID | Scenario | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Activation State | 1. Navigate to `/binder`<br>2. Toggle Quick-Add ON | Button background turns purple; "Live" pulse icon appears. | P0 |
| **TC-02** | Mode Switching | 1. Enable Quick-Add<br>2. Click a card<br>3. Disable Quick-Add<br>4. Click the same card | 1. First click: Toggles color (No modal).<br>2. Second click: Opens detail modal. | P0 |

### 2.2 Core Logic (Optimistic UI)
| ID | Scenario | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **TC-03** | Rapid Addition | 1. Enable Quick-Add<br>2. Click 5 grayscale cards rapidly | All 5 cards turn colored instantly; counter shows +5 update. | P0 |
| **TC-04** | Error Recovery | 1. Enable Quick-Add<br>2. Simulate API timeout/failure<br>3. Click a card | 1. Card turns colored (Optimistic).<br>2. API fails.<br>3. Card reverts to grayscale; Error toast visible. | P1 |

### 2.3 Edge Cases & Stress
| ID | Scenario | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **TC-05** | Double-Click Race | 1. Enable Quick-Add<br>2. Double-click a single card rapidly | System processes both as separate toggles; final state matches DB. | P2 |
| **TC-06** | Session Persistence | 1. Add 3 cards in Quick-Add mode<br>2. Refresh page (F5) | Card states and counter values are persisted from DB. | P0 |

## 3. Exit Criteria
A feature release is considered **READY** only if:
1. 100% of P0 cases pass.
2. No Critical or Blocker defects are open.
3. UI jank (frame drops) is not observable during TC-03.
