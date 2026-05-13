---
title: Test Case Specification - Digital Binder
version: 1.0.0
owner: QA Engineering
---

# Test Case Specification: US-01 Digital Binder

## 1. Test Environment & Configuration
*   **Platform**: Web (Desktop/Mobile Responsive)
*   **Browser Coverage**: Chrome (Latest), Safari (Latest)
*   **Data Set**: SV1S Scarlet ex (78 Cards)
*   **Asset Source**: TCGdex CDN (ID and JA variants)

## 2. Test Suite: Functional & Non-Functional

### 2.1 Display, Layout & Accessibility (UI/UX)
| ID | Scenario | Steps | Expected Result | Priority | Automation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Initial Grid Load | 1. Navigate to `/binder` | Loading state appears, followed by 78 cards in grid. | P0 | Y |
| **TC-02** | Responsive Layout | 1. View at 360px (Mobile)<br>2. View at 1440px (Desktop) | Mobile: 3 cols; Desktop: 6+ cols. No horizontal scroll. | P0 | Y |
| **TC-03** | Ownership Visuals | 1. Identify owned card 'A'<br>2. Identify missing card 'B' | Card 'A': Full Color; Card 'B': Grayscale/40% Opacity. | P0 | Y |
| **TC-04** | Keyboard Navigation | 1. Press `Tab` through grid | Focus indicator visible. `Enter` opens modal. | P1 | N |
| **TC-05** | Touch Target (Mobile) | 1. Inspect grid on mobile view | Clickable area ≥ 44x44pt to prevent misclicks. | P1 | N |
| **TC-06** | A11y Contrast Ratio | 1. Run Axe/Lighthouse | Text/BG contrast ≥ 4.5:1, proper ARIA labels on grid. | P1 | Y |

### 2.2 Core Interactions (Functional)
| ID | Scenario | Steps | Expected Result | Priority | Automation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-07** | Modal Metadata | 1. Click a card in grid | Modal opens with Name, Number, Rarity matching DB. | P0 | Y |
| **TC-08** | Modal Navigation | 1. Open modal<br>2. Click Backdrop/Esc | Modal closes with smooth exit animation. | P1 | Y |
| **TC-09** | Progress Accuracy | 1. View header progress text | "X / 78" matches the count of colored cards in grid. | P0 | Y |

### 2.3 Performance & Resilience
| ID | Scenario | Steps | Expected Result | Priority | Automation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-10** | Lazy Loading | 1. Scroll through the grid | Images load incrementally as they enter the viewport. | P1 | Y |
| **TC-11** | Asset Fallback | 1. Simulate CDN error for image 'Z' | Card displays "Image Unavailable" fallback UI with card name. | P1 | Y |
| **TC-12** | Empty Collection | 1. Test with new user (0 cards) | All cards appear grayscale; counter shows "0 / 78". | P2 | Y |

## 3. Exit Criteria
A feature release is considered **STABLE** only if:
1. 100% of P0 cases pass.
2. LCP (Largest Contentful Paint) is < 1.5s on Desktop.
3. No broken image icons appear (fallback logic must trigger).
4. Zero Level A or AA WCAG accessibility violations on automated checks.
