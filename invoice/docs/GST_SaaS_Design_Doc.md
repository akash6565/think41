# Design System Document: Automated GST Compliance & Invoicing SaaS

## 1. Design Vision & Philosophy
The aesthetic is inspired by modern, high-end SaaS UI kits found on Envato Elements. The goal is to balance **Financial Trust** with **Modern Efficiency**. The interface should feel breathable, data-dense but not cluttered, and use visual cues to simplify the complexity of GST compliance.

**Key Principles:**
- **Clarity over Decoration:** Every element serves a functional purpose in the invoicing workflow.
- **Soft Precision:** Use of rounded corners and soft shadows to make the professional environment feel approachable.
- **State-Driven Visuals:** Heavy reliance on color-coding for compliance statuses (e.g., Filed, Pending, Overdue).

---

## 2. Color Palette
Based on the analyzed references, we use a "Professional Electric" palette.

| Role | Hex Code | Description |
| :--- | :--- | :--- |
| **Primary (Brand)** | `#3B82F6` | Electric Blue for primary actions and brand identity. |
| **Secondary (Deep)** | `#1E293B` | Slate/Navy for sidebars and primary headings. |
| **Success** | `#10B981` | Emerald Green for "GST Filed" or "Paid" status. |
| **Warning** | `#F59E0B` | Amber for "Pending" or "Action Required". |
| **Danger** | `#EF4444` | Red for "Overdue" or "Error". |
| **Background (App)** | `#F8FAFC` | Very light cool gray for the main workspace. |
| **Surface (Cards)** | `#FFFFFF` | Pure white for cards and containers to create depth. |

---

## 3. Typography
Focus on geometric sans-serif fonts that maintain legibility at small sizes (essential for tax tables).

- **Primary Font:** *Inter* or *Plus Jakarta Sans*
- **Headings:**
    - **H1 (Page Titles):** 24pt, Bold, `#1E293B`
    - **H2 (Section Titles):** 18pt, Semi-bold, `#1E293B`
- **Body Text:** 14pt, Regular, `#475569`
- **Data/Monospace:** 13pt, Medium (For Invoice Numbers/GSTINs)

---

## 4. Layout & Grid
The layout follows a **Hybrid Sidebar-Header** structure.

- **Sidebar:** Width: 260px. Fixed left. Dark background (`#1E293B`) or clean white with active state indicators.
- **Main Container:** Max-width: 1440px. Centered with 32px padding.
- **Grid:** 12-column system for dashboard widgets.
- **Card Spacing:** 24px gutter between dashboard "stats" cards.

---

## 5. Component Style

### 5.1 Cards
- **Corner Radius:** `12px` or `16px`.
- **Shadow:** `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
- **Border:** `1px solid #E2E8F0`.

### 5.2 Buttons
- **Primary:** Rounded (`8px`), Background: `#3B82F6`, Text: White.
- **Secondary:** Transparent background, Border: `1px solid #E2E8F0`, Text: `#1E293B`.
- **Ghost:** No border/background until hover. Used for "Add Row" in invoices.

### 5.3 Status Badges
Pill-shaped with light background tints and saturated text:
- **Paid:** Bg: `#D1FAE5`, Text: `#065F46`
- **Unpaid:** Bg: `#FEE2E2`, Text: `#991B1B`

---

## 6. Data Visualization (Charts & Tables)
- **Tables:** No vertical borders. Subtle horizontal dividers (`#F1F5F9`). Hover state: `#F8FAFC`.
- **Charts:** Use Area Charts with gradients (Primary Blue to Transparent).
- **Icons:** Dual-tone or Thin-outline icons (e.g., Lucide or Phosphor Icons) with a 2px stroke width.

---

## 7. GST-Specific UI Patterns
- **The "Compliance Bar":** A sticky top element showing the countdown to the next GSTR-1 or GSTR-3B filing deadline.
- **Invoice Preview:** A split-screen view where the left side is the form and the right side is a real-time rendered PDF preview.
- **Bulk Action Toolbar:** Appears at the bottom of the table when multiple invoices are selected.

---
*Created for: Automated GST Compliance & Invoicing SaaS*
