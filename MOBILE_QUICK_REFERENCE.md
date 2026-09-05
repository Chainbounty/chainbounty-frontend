# Mobile Responsive Design - Quick Reference

Quick reference guide for mobile-responsive patterns used in ChainBounty.

## Breakpoints

```tsx
// Tailwind breakpoints (mobile-first)
xs:   480px   /* Custom - phones in landscape */
sm:   640px   /* Small tablets */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large desktops */
```

## Common Patterns

### Responsive Typography
```tsx
{/* Scale up on larger screens */}
<h1 className="text-3xl sm:text-4xl md:text-5xl">Heading</h1>
<h2 className="text-xl sm:text-2xl md:text-3xl">Subheading</h2>
<p className="text-sm sm:text-base">Body text</p>
```

### Stack to Horizontal
```tsx
{/* Vertical on mobile, horizontal on desktop */}
<div className="flex flex-col sm:flex-row gap-3">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

### Responsive Grid
```tsx
{/* 1 column → 2 columns → 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

### Sidebar Layout
```tsx
{/* Stack on mobile, sidebar on desktop */}
<div className="flex flex-col lg:flex-row gap-6">
  <aside className="w-full lg:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

### Show/Hide Based on Screen
```tsx
{/* Hidden on mobile, visible on desktop */}
<span className="hidden md:inline">Desktop Only</span>

{/* Visible on mobile, hidden on desktop */}
<span className="md:hidden">Mobile Only</span>

{/* Use xs breakpoint for fine control */}
<span className="hidden xs:inline">Phones Landscape+</span>
```

### Full Width on Mobile
```tsx
{/* Full width on mobile, constrained on desktop */}
<Button className="w-full sm:w-auto">Action</Button>
```

### Responsive Padding
```tsx
{/* Less padding on mobile, more on desktop */}
<div className="p-4 sm:p-6 lg:p-8">Content</div>
<div className="py-8 sm:py-12 md:py-20">Section</div>
```

### Responsive Spacing
```tsx
{/* Smaller gaps on mobile */}
<div className="flex gap-2 sm:gap-3 md:gap-4">
  <Button />
  <Button />
</div>
```

## Touch Targets

### Minimum Sizes
```tsx
{/* All buttons meet 40px minimum height */}
<Button size="default">40px height</Button>
<Button size="lg">44px height</Button>
<Button size="icon" className="h-10 w-10">40×40px</Button>

{/* Inputs */}
<Input className="h-10" />  {/* 40px height */}
```

### Spacing
```tsx
{/* Minimum 8px between interactive elements */}
<div className="flex gap-2">  {/* gap-2 = 8px */}
  <Button />
  <Button />
</div>
```

## Navigation

### Mobile Menu
```tsx
{/* Desktop nav */}
<nav className="hidden md:flex">
  <NavLink to="/bounties">Bounties</NavLink>
</nav>

{/* Mobile hamburger */}
<Sheet>
  <SheetTrigger className="md:hidden">
    <Menu />
  </SheetTrigger>
  <SheetContent>
    {/* Mobile nav links */}
  </SheetContent>
</Sheet>
```

## Forms

### Prevent Zoom on iOS
```css
/* Already handled in index.css */
/* Inputs use 16px font size on mobile to prevent zoom */
```

### Mobile-Friendly Forms
```tsx
{/* Full width inputs on mobile */}
<Input className="w-full" />

{/* Stack labels and inputs */}
<FormItem>
  <FormLabel>Label</FormLabel>
  <FormControl>
    <Input />
  </FormControl>
</FormItem>
```

## Modals & Drawers

### Mobile Sheets
```tsx
{/* Use Sheet for mobile drawers */}
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="right">
    Content
  </SheetContent>
</Sheet>
```

### Responsive Dialogs
```tsx
{/* Dialogs adapt size automatically */}
<DialogContent className="w-full max-w-lg sm:max-w-xl">
  Content
</DialogContent>
```

## useMediaQuery Hook

```tsx
import { useIsMobile, useIsDesktop, useMediaQuery } from '@/hooks/useMediaQuery'

function Component() {
  const isMobile = useIsMobile()  // < 768px
  const isDesktop = useIsDesktop()  // >= 1024px
  
  // Custom query
  const isSmallPhone = useMediaQuery('(max-width: 400px)')
  
  return isMobile ? <MobileView /> : <DesktopView />
}
```

## CSS Utilities

### Safe Area Insets
```tsx
{/* Respect device notches (iOS) */}
<div className="safe-bottom">Content above home indicator</div>
```

### Smooth Scrolling
```css
/* Already enabled in index.css */
/* Respects user's motion preferences */
```

### No Tap Highlight
```css
/* Already applied globally in index.css */
/* Prevents blue tap flash on mobile */
```

## Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Click device toggle icon (Ctrl+Shift+M)
3. Select device or responsive mode
4. Test at: 375px, 768px, 1024px

### Test Checklist
- [ ] All buttons are easily tappable (44×44px)
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Forms work with virtual keyboard
- [ ] Navigation is accessible
- [ ] Images load correctly

## Common Mistakes to Avoid

❌ **Don't:**
```tsx
{/* Hover-only interactions */}
<button onHover={doSomething}>Hover Me</button>

{/* Small touch targets */}
<button className="h-6 w-6">×</button>

{/* Horizontal scrolling */}
<div className="w-screen overflow-x-scroll">
  <div className="w-[2000px]">Too wide</div>
</div>
```

✅ **Do:**
```tsx
{/* Click/tap interactions */}
<button onClick={doSomething}>Click Me</button>

{/* Proper touch targets */}
<button className="h-10 w-10">×</button>

{/* Responsive width */}
<div className="w-full overflow-x-auto">
  <div className="min-w-[600px] max-w-full">Responsive</div>
</div>
```

## Performance Tips

### Images
```tsx
{/* Lazy load images below fold */}
<img loading="lazy" src="..." alt="..." />

{/* Use responsive images */}
<img 
  srcSet="image-320w.jpg 320w, image-768w.jpg 768w"
  sizes="(max-width: 768px) 100vw, 768px"
/>
```

### Code Splitting
```tsx
{/* Already implemented - lazy load non-critical routes */}
const BountyDetailPage = lazy(() => import('@/pages/BountyDetailPage'))
```

## Resources

- [MOBILE_RESPONSIVE.md](./MOBILE_RESPONSIVE.md) - Full documentation
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Apple HIG - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/inputs)
- [Material Design - Touch Targets](https://m3.material.io/foundations/interaction/touch-targets)
