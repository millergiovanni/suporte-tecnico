---
name: Technical Support System
colors:
  surface: '#fbf9fa'
  surface-dim: '#dbd9db'
  surface-bright: '#fbf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#efedef'
  surface-container-high: '#e9e7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1c1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f2'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4f6073'
  primary: '#041627'
  on-primary: '#ffffff'
  primary-container: '#1a2b3c'
  on-primary-container: '#8192a7'
  inverse-primary: '#b7c8de'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#211200'
  on-tertiary: '#ffffff'
  tertiary-container: '#38260b'
  on-tertiary-container: '#a88c69'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4fb'
  primary-fixed-dim: '#b7c8de'
  on-primary-fixed: '#0b1d2d'
  on-primary-fixed-variant: '#38485a'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#feddb5'
  tertiary-fixed-dim: '#e1c29b'
  on-tertiary-fixed: '#281802'
  on-tertiary-fixed-variant: '#584326'
  background: '#fbf9fa'
  on-background: '#1b1c1d'
  surface-variant: '#e4e2e3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built for high-utility technical environments where clarity and rapid information processing are paramount. The brand personality is authoritative, reliable, and calm—reducing the cognitive load of support agents dealing with high-pressure ticket volumes.

The style is **Corporate Modern**, utilizing a flat UI foundation enhanced by purposeful depth. It avoids unnecessary decoration, focusing instead on structural integrity and clear information hierarchy. By combining a "2xl" roundedness with a deep navy palette, the system achieves a sophisticated balance between high-tech precision and approachable usability.

## Colors

The palette is anchored by "Deep Navy" (#1a2b3c), which serves as the primary color for navigation, headers, and high-emphasis typography. "Light Gray" (#f8f9fa) provides a clean, neutral canvas that minimizes eye strain during long shifts.

Semantic colors are strictly reserved for status indicators and alerts:
- **Critical (Red):** System outages or breached SLAs.
- **High (Orange):** Urgent tickets or impending deadlines.
- **Medium (Blue):** Standard active tasks.
- **Low (Gray):** Resolved, pending, or informational items.

Surface colors utilize pure white against the light gray background to create distinct containment for data modules.

## Typography

The design system employs **Inter** for its exceptional legibility in data-heavy interfaces. The typographic scale is optimized for screen-based density. 

- **Headlines:** Use tighter letter spacing and heavier weights to establish clear section starts.
- **Body Text:** Uses a standard weight for maximum readability. 
- **Labels:** Small, uppercase labels are used for table headers and metadata categories to distinguish them from actionable content.
- **Numeric Data:** While Inter is sans-serif, its tabular numeric features should be enabled for use in data tables to ensure columns of numbers align perfectly.

## Layout & Spacing

This design system uses a **Fixed-Fluid Hybrid Grid**. The sidebar remains fixed at 260px, while the main content area expands to fill the viewport up to a maximum width of 1600px.

A strict **8px spacing system** governs all element relationships:
- **Component Padding:** 16px (md) or 24px (lg) for internal card spacing.
- **Stacking:** 24px (lg) vertical gap between metric cards and data tables.
- **Desktop:** 12-column layout with 24px gutters.
- **Tablet:** 6-column layout with 16px gutters; sidebar collapses to an icon-only rail.
- **Mobile:** Single column with 16px margins; sidebar transitions to a bottom navigation or hamburger overlay.

## Elevation & Depth

To maintain a "Modern Flat" aesthetic, elevation is used sparingly to indicate interactivity and hierarchy.

- **Level 0 (Background):** Light gray (#f8f9fa). No shadows.
- **Level 1 (Cards/Tables):** White surface. Subtle, diffused shadow (0px 4px 20px rgba(26, 43, 60, 0.05)). This provides a "lift" from the background without feeling heavy.
- **Level 2 (Hover/Active):** Slightly more pronounced shadow (0px 8px 30px rgba(26, 43, 60, 0.08)) to indicate an element is clickable or active.
- **Outlines:** All cards and inputs utilize a 1px solid border (#e0e4e8) to maintain structural definition regardless of shadow rendering.

## Shapes

In accordance with the "2xl" requirement, the shape language is distinctly rounded to soften the technical nature of the dashboard.

- **Metric Cards & Data Tables:** 1.5rem (24px) corner radius.
- **Buttons & Input Fields:** 0.5rem (8px) corner radius for a more standard functional feel.
- **Status Badges:** Fully rounded (pill) to distinguish them from interactive containers.
- **Sidebar Selection:** 0.75rem (12px) rounded corners on the right side of the active indicator to create a "tab" feel.

## Components

### Sidebar Navigation
The sidebar uses the Deep Navy (#1a2b3c) as a background. Active states are indicated by a high-contrast white text and a subtle left-aligned accent bar in a lighter blue.

### Metric Cards
Large, bold numbers for KPIs. They sit on Level 1 elevation with a 24px rounded corner. Trend indicators (up/down arrows) use the semantic color palette.

### Status Badges
Small, high-contrast labels. Use a light tinted background (10% opacity of the semantic color) with 100% opacity text for the label. Example: Critical has a light red background with dark red text.

### Data Tables
Tables should have no vertical borders, only horizontal dividers (#e0e4e8). The header row uses the `label-caps` typography style. Rows should include a subtle hover state using the light gray (#f8f9fa).

### Buttons
- **Primary:** Deep Navy background, white text.
- **Secondary:** White background, Deep Navy border and text.
- **Actionable Icons:** 40x40px touch targets with 8px rounding.

### Input Fields
Clean, outlined boxes with 8px rounding. Focus states should use a 2px Deep Navy border or a soft blue glow to match the primary brand color.