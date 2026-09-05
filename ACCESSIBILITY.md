# Accessibility (A11y) Implementation Guide

## Overview
ChainBounty frontend is built with accessibility as a core principle, following WCAG 2.1 Level AA guidelines. This document outlines accessibility features, testing strategies, and best practices.

## Accessibility Features Implemented

### 1. Keyboard Navigation

#### Skip to Content Link
- **Component**: `SkipToContent.tsx`
- **Location**: Top of every page (visually hidden until focused)
- **Purpose**: Allows keyboard users to skip repetitive navigation
- **Shortcut**: Tab on page load → Press Enter to jump to main content
- **Implementation**: `<a href="#main-content">` link with focus styles

#### Focus Management
- All interactive elements are keyboard accessible
- Logical tab order throughout application
- Visible focus indicators on all focusable elements
- Focus trap in modals/dialogs (prevents focus from escaping)

#### Keyboard Shortcuts
- `Tab` - Move to next focusable element
- `Shift + Tab` - Move to previous focusable element
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and dropdowns
- Arrow keys - Navigate within dropdown menus and select components

### 2. Screen Reader Support

#### Semantic HTML
- `<header>` - Page header with navigation
- `<nav>` - Navigation sections with `aria-label`
- `<main>` - Main content area with `id="main-content"`
- `<footer>` - Page footer with `role="contentinfo"`
- `<article>` - Individual bounty cards
- `<section>` - Major page sections
- Proper heading hierarchy (h1 → h2 → h3, no skipping)

#### ARIA Attributes
- `aria-label` - Descriptive labels for links and buttons
- `aria-labelledby` - Connect labels to form fields
- `aria-describedby` - Additional descriptions for context
- `aria-current="page"` - Indicate current navigation item
- `aria-live` - Announce dynamic content updates
- `aria-hidden="true"` - Hide decorative icons from screen readers
- `aria-expanded` - Indicate expandable/collapsible state
- `aria-controls` - Connect controls to their targets

#### Live Regions
- **Component**: `LiveRegion.tsx`
- **Purpose**: Announce dynamic updates without moving focus
- **Use Cases**:
  - Form submission success/error
  - Data refresh notifications
  - Filter updates
  - Search result counts
  - Toast notifications

```typescript
import { useAnnouncement } from '@/components/accessibility/LiveRegion'

const { announce } = useAnnouncement()

// Announce to screen readers
announce('3 bounties found matching your search')
```

### 3. Visual Accessibility

#### Color Contrast
- **Minimum**: 4.5:1 for normal text
- **Large Text**: 3:1 for text 18px+ or 14px+ bold
- **Non-text**: 3:1 for UI components and graphics
- All text meets WCAG AA contrast requirements
- Primary actions have high contrast focus indicators

#### Focus Indicators
- Visible focus ring on all interactive elements
- 2px outline with high contrast color
- Ring offset for clarity
- Never removed (`:focus-visible` used instead of `:focus:outline-none`)

#### Text Sizing
- Base font size: 16px (browser default)
- Relative units (rem, em) used throughout
- Text can be resized up to 200% without breaking layout
- No horizontal scrolling at zoom levels up to 200%

#### Color is Not the Only Indicator
- Icons accompany color-coded statuses
- Patterns/shapes used in addition to colors
- Text labels on all important indicators
- Form errors shown with icons + text

### 4. Form Accessibility

#### Labels
- All inputs have associated `<label>` elements
- Labels use `htmlFor` to connect to inputs
- Placeholder text is not used as the only label
- Required fields are marked with `*` and `aria-required="true"`

#### Error Messages
- Errors shown immediately after field
- Connected via `aria-describedby`
- Clear, actionable error text
- Focus moved to first error on submit

#### Validation
- Real-time validation feedback
- Success states for completed fields
- Clear instructions before form fields
- Error summary at top of form for multi-field errors

### 5. Responsive and Mobile Accessibility

#### Touch Targets
- Minimum size: 44x44px (iOS) / 48x48px (Android)
- Adequate spacing between interactive elements
- No overlapping touch areas
- Buttons enlarged on mobile devices

#### Responsive Text
- Text reflows at all viewport sizes
- No horizontal scrolling
- Line length optimized for readability (45-75 characters)
- Sufficient line height (1.5 for body text)

### 6. Images and Media

#### Alternative Text
- All images have descriptive `alt` attributes
- Decorative images use `alt=""` or `aria-hidden="true"`
- Icons have descriptive text or `aria-label`
- Complex images have extended descriptions

#### SVG Icons
```typescript
// Decorative icon
<IconComponent aria-hidden="true" />

// Meaningful icon
<IconComponent aria-label="Close dialog" />

// Icon with text
<IconComponent aria-hidden="true" />
<span>Close</span>
```

## Components with Built-in Accessibility

### UI Components (shadcn/ui)
All shadcn/ui components come with accessibility features:
- ✅ Button - keyboard support, focus management
- ✅ Dialog - focus trap, ESC to close, ARIA roles
- ✅ Dropdown Menu - keyboard navigation, ARIA attributes
- ✅ Select - keyboard support, ARIA combobox pattern
- ✅ Tabs - arrow key navigation, ARIA tablist pattern
- ✅ Tooltip - hover and focus triggers, describedby
- ✅ Alert - ARIA role, live region support
- ✅ Form - proper label associations, error handling

### Custom Accessible Components
- `SkipToContent` - Skip navigation link
- `LiveRegion` - Screen reader announcements
- `VisuallyHidden` - Hide content visually but keep for SR
- `ErrorState` - Accessible error displays
- `BountyCard` - Semantic article structure
- `BountyStatusBadge` - Icon + text + color

## Testing Accessibility

### Automated Testing Tools

#### Browser Extensions
1. **axe DevTools** (Chrome/Firefox/Edge)
   - Comprehensive WCAG testing
   - Highlights violations with severity
   - Provides fix suggestions

2. **WAVE** (Web Accessibility Evaluation Tool)
   - Visual feedback for accessibility
   - Shows ARIA attributes
   - Identifies structural elements

3. **Lighthouse** (Chrome DevTools)
   - Accessibility score (0-100)
   - Performance + A11y combined
   - Best practices audit

#### Command Line
```bash
# Run axe-core accessibility tests
npm install --save-dev @axe-core/cli
npx axe <url> --save results.json

# Run Pa11y
npm install --save-dev pa11y
pa11y http://localhost:5173
```

### Manual Testing

#### Keyboard Navigation Test
1. Disconnect mouse
2. Navigate entire site using only keyboard
3. Check all interactive elements are reachable
4. Verify visible focus indicators
5. Test modal focus trapping
6. Verify logical tab order

#### Screen Reader Test
1. **NVDA** (Windows) - Free, open source
2. **JAWS** (Windows) - Industry standard
3. **VoiceOver** (macOS/iOS) - Built-in
4. **TalkBack** (Android) - Built-in

**Test Checklist**:
- [ ] All text is read correctly
- [ ] Images have appropriate alt text
- [ ] Form labels are announced
- [ ] Error messages are announced
- [ ] Dynamic updates are announced
- [ ] Navigation structure is clear
- [ ] Landmark regions are identified

#### Visual Testing
- [ ] Zoom to 200% - layout intact
- [ ] Use browser zoom - no horizontal scroll
- [ ] Color contrast - all text readable
- [ ] Focus indicators - always visible
- [ ] Text sizing - increase to 200%

#### Color Blindness Simulation
Tools:
- Chrome: DevTools > Rendering > Emulate vision deficiencies
- Firefox: Accessibility Inspector
- Colorblind Web Page Filter extension

Test with:
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Achromatopsia (no color)

### Testing Checklist by Page

#### BountyListPage
- [ ] Skip link works
- [ ] Search input labeled
- [ ] Filter controls keyboard accessible
- [ ] Bounty cards are articles with headings
- [ ] Status badges have text + icon
- [ ] View mode toggle buttons labeled
- [ ] Pagination keyboard accessible
- [ ] Screen reader announces result count

#### BountyDetailPage
- [ ] Back button labeled
- [ ] Bounty title is h1
- [ ] Timeline is ordered list
- [ ] Action buttons clearly labeled
- [ ] Modal dialogs trap focus
- [ ] External links indicate they open new tab

#### PostBountyPage
- [ ] All form fields have labels
- [ ] Required fields marked
- [ ] Error messages descriptive
- [ ] Success confirmation announced
- [ ] File uploader keyboard accessible

## Common A11y Patterns

### 1. Accessible Modal Dialog

```typescript
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogTitle>Claim Bounty</DialogTitle>
    {/* Content - focus automatically trapped */}
  </DialogContent>
</Dialog>
```

### 2. Accessible Button

```typescript
// Good - clear label
<Button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" aria-hidden="true" />
</Button>

// Good - text + icon
<Button onClick={onSave}>
  <Save className="h-4 w-4" aria-hidden="true" />
  <span>Save Changes</span>
</Button>

// Bad - icon only, no label
<Button onClick={onClose}>
  <X className="h-4 w-4" />
</Button>
```

### 3. Accessible Link

```typescript
// External link
<a 
  href="https://stellar.expert/tx/..."
  target="_blank"
  rel="noopener noreferrer"
  aria-label="View transaction on Stellar Expert (opens in new tab)"
>
  View Transaction
  <ExternalLink className="h-3 w-3" aria-hidden="true" />
</a>

// Navigation link
<NavLink 
  to="/bounties"
  aria-current={({ isActive }) => isActive ? 'page' : undefined}
>
  Bounties
</NavLink>
```

### 4. Accessible Form Field

```typescript
<FormField>
  <FormLabel htmlFor="bounty-title">
    Bounty Title <span aria-label="required">*</span>
  </FormLabel>
  <FormControl>
    <Input
      id="bounty-title"
      aria-required="true"
      aria-invalid={!!errors.title}
      aria-describedby={errors.title ? "title-error" : undefined}
    />
  </FormControl>
  {errors.title && (
    <FormMessage id="title-error" role="alert">
      {errors.title.message}
    </FormMessage>
  )}
</FormField>
```

### 5. Accessible Status Badge

```typescript
<Badge variant="success">
  <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
  <span>Completed</span>
</Badge>
```

## WCAG 2.1 Level AA Compliance

### Principle 1: Perceivable

✅ **1.1 Text Alternatives**
- All images have alt text
- Decorative images hidden from SR

✅ **1.2 Time-based Media**
- N/A - no video/audio content

✅ **1.3 Adaptable**
- Semantic HTML throughout
- Logical reading order
- Clear relationships via ARIA

✅ **1.4 Distinguishable**
- 4.5:1 contrast ratio for text
- Text resizable to 200%
- No images of text (except logos)

### Principle 2: Operable

✅ **2.1 Keyboard Accessible**
- All functionality keyboard accessible
- No keyboard traps
- Skip navigation link

✅ **2.2 Enough Time**
- No time limits on actions
- Users can pause/extend timeouts

✅ **2.3 Seizures**
- No flashing content

✅ **2.4 Navigable**
- Skip links provided
- Page titles descriptive
- Focus order logical
- Link purpose clear
- Multiple navigation methods
- Headings and labels descriptive
- Visible focus indicator

✅ **2.5 Input Modalities**
- 44x44px touch targets
- No path-based gestures required
- Click/tap targets adequately spaced

### Principle 3: Understandable

✅ **3.1 Readable**
- Page language declared (`<html lang="en">`)
- Simple, clear language

✅ **3.2 Predictable**
- Consistent navigation
- Consistent identification
- No unexpected context changes

✅ **3.3 Input Assistance**
- Error identification
- Labels and instructions
- Error suggestions
- Error prevention for critical actions

### Principle 4: Robust

✅ **4.1 Compatible**
- Valid HTML
- ARIA used correctly
- Status messages announced

## Known Limitations

### Current Gaps
1. **No captions for future video content** (not yet implemented)
2. **Limited multi-language support** (English only currently)
3. **No high contrast mode** (planned for future)

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (some ARIA differences)
- Mobile browsers: Full support

## Future Improvements

### Phase 1 (Priority)
- [ ] Add high contrast mode toggle
- [ ] Implement keyboard shortcut reference (? key)
- [ ] Add focus-visible polyfill for older browsers
- [ ] User preference for reduced motion

### Phase 2
- [ ] Multi-language support (i18n)
- [ ] Voice control optimization
- [ ] Enhanced screen reader testing
- [ ] Accessibility statement page

### Phase 3
- [ ] WCAG 2.2 AAA compliance
- [ ] Dyslexia-friendly font option
- [ ] Reading mode for long content
- [ ] Customizable color themes for visual impairments

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Screen Reader Reference](https://dequeuniversity.com/screenreaders/)

### Learning
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

## Reporting Accessibility Issues

If you discover an accessibility issue:
1. Document the issue with screenshots
2. Specify assistive technology used (if applicable)
3. Provide steps to reproduce
4. Open an issue labeled `accessibility`
5. We aim to address critical A11y issues within 48 hours

## Commitment

We are committed to making ChainBounty accessible to all users. Accessibility is an ongoing process, and we continuously work to improve the experience for users of all abilities.
