# Vikmac Ajira Design System

## Overview

This document outlines the comprehensive design system for the Vikmac Ajira platform across web and desktop implementations. The system ensures consistency, accessibility, and user experience excellence across all platforms.

---

## 1. Color Palette

### Primary Colors
- **Primary Blue**: `#002060` - Used for headers, primary actions, and main navigation
- **Primary Purple**: `#5b4bd9` - Used for highlights, active states, and secondary actions
- **Primary Red**: `#d32f2f` - Used for critical actions, alerts, and urgent information

### Neutral Colors
- **White**: `#ffffff` - Backgrounds, cards, and light surfaces
- **Light Gray**: `#f5f7fa` - Secondary backgrounds, disabled states
- **Medium Gray**: `#e5e5e5` - Borders, dividers
- **Dark Gray**: `#999999` - Secondary text
- **Black**: `#1a1a1a` - Primary text, headings

### Status Colors
- **Success Green**: `#4ade80` - Positive actions, confirmations
- **Warning Orange**: `#ffa500` - Warnings, attention needed
- **Error Red**: `#ef4444` - Errors, destructive actions
- **Info Blue**: `#3b82f6` - Informational messages

---

## 2. Typography

### Font Families
- **Primary Font**: Inter (System fallback: -apple-system, BlinkMacSystemFont, Segoe UI)
- **Monospace Font**: Space Mono (For code, technical content)

### Type Scale

#### Headings
- **H1**: 2.75rem (44px), Font Weight 800, Line Height 1.1
- **H2**: 2rem (32px), Font Weight 700, Line Height 1.2
- **H3**: 1.5rem (24px), Font Weight 700, Line Height 1.3
- **H4**: 1.25rem (20px), Font Weight 600, Line Height 1.4

#### Body Text
- **Large Body**: 1.125rem (18px), Font Weight 400, Line Height 1.6
- **Regular Body**: 1rem (16px), Font Weight 400, Line Height 1.6
- **Small Body**: 0.875rem (14px), Font Weight 400, Line Height 1.5
- **Extra Small**: 0.75rem (12px), Font Weight 500, Line Height 1.4

#### Labels & Captions
- **Label Large**: 1rem (16px), Font Weight 600
- **Label Medium**: 0.875rem (14px), Font Weight 600
- **Label Small**: 0.75rem (12px), Font Weight 600

---

## 3. Spacing System

### Base Unit: 4px

- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

### Application
- **Padding**: Use multiples of base unit (8px, 16px, 24px, 32px)
- **Margins**: Use multiples of base unit
- **Gaps**: Use consistent spacing between related elements
- **Gutters**: 16px for mobile, 24px for tablet, 32px for desktop

---

## 4. Component Library

### Buttons

#### Primary Button
- **Background**: #5b4bd9
- **Text Color**: White
- **Padding**: 16px 24px
- **Border Radius**: 8px
- **Hover**: Background #6b5cdb, translate Y(-2px)
- **Active**: Background #4a3cc5, shadow: 0 4px 12px rgba(91, 75, 217, 0.3)

#### Secondary Button
- **Background**: #f5f5f5
- **Text Color**: #1a1a1a
- **Padding**: 16px 24px
- **Border Radius**: 8px
- **Hover**: Background #e5e5e5

#### Danger Button
- **Background**: #d32f2f
- **Text Color**: White
- **Padding**: 16px 24px
- **Border Radius**: 8px
- **Hover**: Background #e53935

### Cards

#### Standard Card
- **Background**: White
- **Border Radius**: 12px
- **Padding**: 20px 24px
- **Shadow**: 0 2px 8px rgba(0, 0, 0, 0.06)
- **Hover Shadow**: 0 4px 16px rgba(0, 0, 0, 0.1)
- **Border**: 1px solid #e5e5e5 (optional)

#### Elevated Card
- **Shadow**: 0 8px 24px rgba(0, 0, 0, 0.12)
- **Used for**: Featured content, modals, dropdowns

### Input Fields

#### Text Input
- **Background**: White
- **Border**: 2px solid #e5e5e5
- **Border Radius**: 8px
- **Padding**: 12px 16px
- **Font Size**: 1rem
- **Focus**: Border color #5b4bd9, shadow 0 0 0 3px rgba(91, 75, 217, 0.1)

#### Label
- **Font Weight**: 600
- **Font Size**: 0.875rem
- **Color**: #1a1a1a
- **Margin Bottom**: 8px

### Navigation

#### Sidebar Navigation
- **Background**: #002060 (dark navy)
- **Text Color**: rgba(255, 255, 255, 0.8)
- **Active Item Background**: #5b4bd9
- **Item Padding**: 14px 16px
- **Border Radius**: 8px

#### Top Navigation
- **Background**: White
- **Border Bottom**: 1px solid #e5e5e5
- **Padding**: 24px 32px
- **Height**: 80px (including margin)

---

## 5. Layout System

### Grid System

#### Desktop (1200px+)
- 12-column grid
- Column gap: 24px
- Max content width: 1200px
- Padding: 32px sides

#### Tablet (768px - 1199px)
- 8-column grid
- Column gap: 16px
- Padding: 24px sides

#### Mobile (< 768px)
- Single column or 2-column layout
- Column gap: 16px
- Padding: 16px sides

### Layout Patterns

#### Two-Column Layout (Sidebar + Content)
- **Sidebar Width**: 280px (fixed), 200px (collapsible)
- **Content**: Flex: 1
- **Gap**: 24px - 32px

#### Three-Column Dashboard
- **Left Sidebar**: 200px (navigation)
- **Center**: Main content area
- **Right Sidebar**: 240px (secondary info)

#### Full-Width Content
- **Max Width**: 1200px
- **Centered**: Margin 0 auto
- **Padding**: 32px horizontal

---

## 6. Shadows & Elevation

### Shadow Levels

\`\`\`css
/* Elevation 1 (Cards, Normal content) */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

/* Elevation 2 (Elevated cards, Hover state) */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

/* Elevation 3 (Dropdowns, Menus) */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Elevation 4 (Modals, Major overlays) */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.16);
\`\`\`

---

## 7. Border Radius

- **xs**: 4px - Small interactive elements
- **sm**: 6px - Input fields
- **md**: 8px - Buttons, small cards
- **lg**: 12px - Cards, popovers
- **xl**: 16px - Large cards, sections
- **full**: 50% or 9999px - Circular elements

---

## 8. Responsive Breakpoints

- **Mobile**: 0px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px - 1440px
- **Large Desktop**: 1441px+

---

## 9. Web-Specific Guidelines

### Desktop Considerations
1. **Mouse Interactions**
   - Hover states on all interactive elements
   - Cursor changes (pointer for buttons, text for inputs)
   - Smooth transitions (300ms average)

2. **Navigation**
   - Fixed sidebar with scroll
   - Top navigation bar at 80px height
   - Breadcrumb trails for deep navigation

3. **Data Visualization**
   - Charts use responsive containers
   - Tooltips on hover for data points
   - Color-coded status indicators

4. **Performance**
   - Lazy loading for images
   - Code splitting for heavy components
   - Efficient re-renders

---

## 10. Desktop App Specific Guidelines

### Desktop Application UI Patterns

1. **Window Controls**
   - Follow platform conventions (Windows, Mac, Linux)
   - Maintain 12px padding from edges
   - Use native file dialogs

2. **Keyboard Navigation**
   - Tab order must be logical
   - Arrow keys for lists and menus
   - Enter/Space for activation
   - Escape to close modals

3. **Context Menus**
   - Right-click support
   - Platform-specific styling
   - Quick action access

4. **System Integration**
   - Notifications via system tray
   - Drag-and-drop file support
   - Clipboard integration
   - Shortcuts support (Cmd/Ctrl + key combinations)

5. **Offline Capability**
   - Works without network
   - Sync when online
   - Persistent local storage
   - Clear offline/online status

---

## 11. Accessibility Standards

### WCAG 2.1 Level AA Compliance

1. **Color Contrast**
   - Normal text: 4.5:1 minimum
   - Large text (18pt+): 3:1 minimum
   - UI components: 3:1 minimum

2. **Focus Management**
   - Visible focus indicators
   - Focus outline: 2px solid #5b4bd9
   - Focus-within for containers

3. **Keyboard Support**
   - All functionality via keyboard
   - No keyboard traps
   - Logical tab order

4. **Screen Readers**
   - Semantic HTML structure
   - ARIA labels for images
   - ARIA live regions for dynamic content

---

## 12. Animations & Transitions

### Timing Functions
- **Fast**: 150ms - Micro-interactions
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Entrance animations
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1) (Material Standard)

### Common Animations
- **Fade**: opacity 300ms
- **Slide**: transform 300ms, translateX/Y
- **Bounce**: cubic-bezier(0.34, 1.56, 0.64, 1)
- **Scale**: transform 300ms, scale

---

## 13. Usage Examples

### Web Implementation
\`\`\`tsx
// Button with proper styling
<button className="btn btn-primary">
  Click Me
</button>

// Card layout
<div className="card">
  <h3 className="card-title">Title</h3>
  <p>Content goes here</p>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
\`\`\`

### Desktop Implementation
\`\`\`tsx
// Sidebar layout
<div className="flex">
  <aside className="sidebar">
    {/* Navigation */}
  </aside>
  <main className="flex-1">
    {/* Content */}
  </main>
</div>

// Native file dialog
const handleFileSelect = async () => {
  const file = await electronAPI.selectFile()
  // Process file
}
\`\`\`

---

## 14. Future Considerations

1. **Dark Mode**: Support planned with CSS variables
2. **RTL Support**: Consider for international expansion
3. **Theming**: Allow brand color customization
4. **Animation Preferences**: Respect prefers-reduced-motion

---

## Maintenance

This design system should be reviewed and updated quarterly to ensure consistency with current platform standards and user feedback.

**Last Updated**: November 27, 2025
**Maintained By**: Design Team
