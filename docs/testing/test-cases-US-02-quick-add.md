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

### 2.1 Mode Management & Accessibility (UI/UX)
| ID | Scenario | Steps | Expected Result | Priority | Automation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Activation State | 1. Navigate to `/binder`<br>2. Toggle Quick-Add ON | Button background turns purple; "Live" pulse icon appears. | P0 | Y |
| **TC-02** | Mode Switching | 1. Enable Quick-Add<br>2. Click a card<br>3. Disable Quick-Add<br>4. Click the same card | 1. First click: Toggles color (No modal).<br>2. Second click: Opens detail modal. | P0 | Y |
| **TC-03** | Visual Feedback (Hover/Focus) | 1. Hover/focus Quick-Add toggle | Hover state is clearly visible. Contrast remains ≥ 4.5:1. | P1 | N |
| **TC-04** | Screen Reader Announce | 1. Toggle Quick-Add with VoiceOver/TalkBack on | Screen reader announces "Quick-Add mode enabled/disabled". | P1 | N |
| **TC-05** | Touch Target & Spacing | 1. Inspect on 360px mobile view | Toggle button touch target is ≥ 44x44pt to avoid misclicks. | P1 | N |

### 2.2 Core Logic (Optimistic UI)
| ID | Scenario | Steps | Expected Result | Priority | Automation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-06** | Rapid Addition | 1. Enable Quick-Add<br>2. Click 5 grayscale cards rapidly | All 5 cards turn colored instantly; counter shows +5 update. | P0 | Y |
| **TC-07** | Error Recovery UI | 1. Enable Quick-Add<br>2. Simulate API timeout/failure<br>3. Click a card | 1. Card turns colored (Optimistic).<br>2. API fails.<br>3. Card reverts; Error toast visible with clear ARIA role="alert". | P1 | Y |

### 2.3 Edge Cases & Stress
| ID | Scenario | Steps | Expected Result | Priority | Automation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-08** | Double-Click Race | 1. Enable Quick-Add<br>2. Double-click a single card rapidly | System processes both as separate toggles; final state matches DB. | P2 | Y |
| **TC-09** | Session Persistence | 1. Add 3 cards in Quick-Add mode<br>2. Refresh page (F5) | Card states and counter values are persisted from DB. | P0 | Y |

## 3. Exit Criteria
A feature release is considered **READY** only if:
1. 100% of P0 cases pass.
2. No Critical or Blocker defects are open.
3. UI jank (frame drops) is not observable during TC-06.
4. VoiceOver/TalkBack testing confirms clear mode state transitions.
