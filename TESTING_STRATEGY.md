# Testing Strategy

This document outlines the testing strategy for the ChainBounty frontend application.

## Table of Contents
- [Testing Philosophy](#testing-philosophy)
- [Testing Pyramid](#testing-pyramid)
- [Testing Tools](#testing-tools)
- [Test Categories](#test-categories)
- [Manual Testing](#manual-testing)
- [Continuous Integration](#continuous-integration)
- [Test Coverage Goals](#test-coverage-goals)
- [Testing Checklist](#testing-checklist)

---

## Testing Philosophy

### Principles
1. **Write tests that provide value** - Focus on critical user flows and business logic
2. **Test behavior, not implementation** - Tests should survive refactoring
3. **Fail fast** - Tests should catch bugs before production
4. **Maintainable tests** - Tests should be easy to understand and update
5. **Confidence over coverage** - 100% coverage doesn't guarantee quality

### When to Write Tests
- **Critical user flows**: Wallet connection, bounty posting, claiming, submission
- **Complex logic**: Filtering, sorting, form validation
- **Edge cases**: Error handling, loading states, empty states
- **Accessibility**: Keyboard navigation, screen reader support
- **Regression prevention**: Bugs that have occurred in production

### When NOT to Write Tests
- Trivial components with no logic (pure presentational)
- Third-party library behavior (trust the library's tests)
- Obvious implementation details
- Code that's about to be deleted or heavily refactored

---

## Testing Pyramid

```
        ┌─────────────┐
        │   E2E (5%)  │  Full user flows, critical paths
        ├─────────────┤
        │             │
        │ Integration │  Component interactions, API calls
        │    (25%)    │
        │             │
        ├─────────────┤
        │             │
        │    Unit     │  Business logic, utilities, hooks
        │    (70%)    │
        │             │
        └─────────────┘
```

### Unit Tests (70%)
- **Scope**: Individual functions, hooks, utilities
- **Speed**: Very fast (<1ms per test)
- **Tools**: Vitest
- **Examples**:
  - `formatReward()` formatting logic
  - `shortAddress()` address truncation
  - `useBountyFilters` filtering and sorting logic
  - Form validation schemas (Zod)

### Integration Tests (25%)
- **Scope**: Component interactions, API integration
- **Speed**: Fast (~100ms per test)
- **Tools**: Vitest + React Testing Library
- **Examples**:
  - `BountyCard` renders with correct data
  - `BountyFilterSidebar` updates filters correctly
  - `PostBountyPage` form submission flow
  - Wallet connection state management

### End-to-End Tests (5%)
- **Scope**: Critical user journeys
- **Speed**: Slow (~5-30s per test)
- **Tools**: Playwright or Cypress
- **Examples**:
  - Complete bounty posting flow
  - Claim bounty → submit work → approve flow
  - User registration and profile setup
  - Dispute creation and resolution

---

## Testing Tools

### Recommended Stack

#### Unit & Integration Testing
```json
{
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@testing-library/user-event": "^14.5.0",
  "@vitest/ui": "^1.0.0"
}
```

**Why Vitest?**
- Native ESM support
- Compatible with Vite config
- Fast (10x faster than Jest)
- Jest-compatible API
- Built-in watch mode and UI

#### E2E Testing
```json
{
  "@playwright/test": "^1.40.0"
}
```

**Why Playwright?**
- Tests across Chrome, Firefox, Safari
- Mobile device emulation
- Network interception
- Screenshots and video recording
- Parallel execution

#### Visual Regression Testing (Optional)
```json
{
  "@storybook/react": "^7.6.0",
  "chromatic": "^10.0.0"
}
```

---

## Test Categories

### 1. Unit Tests

#### Utilities (`src/lib/*.ts`)
```typescript
// src/lib/bounty.test.ts
import { describe, it, expect } from 'vitest'
import { formatReward, shortAddress, timeAgo } from './bounty'

describe('formatReward', () => {
  it('formats XLM rewards correctly', () => {
    expect(formatReward(1000, 'XLM')).toBe('1,000 XLM')
  })

  it('formats USDC rewards with 2 decimals', () => {
    expect(formatReward(1234.56, 'USDC')).toBe('1,234.56 USDC')
  })

  it('handles zero reward', () => {
    expect(formatReward(0, 'XLM')).toBe('0 XLM')
  })
})

describe('shortAddress', () => {
  it('truncates long Stellar addresses', () => {
    const addr = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H'
    expect(shortAddress(addr)).toBe('GBRPY...C7OX2H')
  })

  it('returns short addresses unchanged', () => {
    expect(shortAddress('ABC123')).toBe('ABC123')
  })
})

describe('timeAgo', () => {
  it('formats recent timestamps', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(timeAgo(fiveMinutesAgo.toISOString())).toBe('5m ago')
  })

  it('formats old timestamps', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    expect(timeAgo(twoDaysAgo.toISOString())).toBe('2d ago')
  })
})
```

#### Hooks (`src/hooks/*.ts`)
```typescript
// src/hooks/useBountyFilters.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useBountyFilters } from './useBountyFilters'

const mockBounties = [
  { id: '1', title: 'Fix bug', status: 'open', token: 'XLM', reward: 100, tags: ['bug'] },
  { id: '2', title: 'Add feature', status: 'claimed', token: 'USDC', reward: 500, tags: ['feature'] },
]

describe('useBountyFilters', () => {
  it('filters by search query', () => {
    const { result } = renderHook(() => useBountyFilters(mockBounties))
    
    act(() => {
      result.current.updateFilter('search', 'bug')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('1')
  })

  it('filters by status', () => {
    const { result } = renderHook(() => useBountyFilters(mockBounties))
    
    act(() => {
      result.current.updateFilter('status', 'claimed')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].status).toBe('claimed')
  })

  it('counts active filters correctly', () => {
    const { result } = renderHook(() => useBountyFilters(mockBounties))
    
    expect(result.current.activeFilterCount).toBe(0)
    
    act(() => {
      result.current.updateFilter('search', 'bug')
      result.current.updateFilter('status', 'open')
    })

    expect(result.current.activeFilterCount).toBe(2)
  })

  it('resets all filters', () => {
    const { result } = renderHook(() => useBountyFilters(mockBounties))
    
    act(() => {
      result.current.updateFilter('search', 'test')
      result.current.resetFilters()
    })

    expect(result.current.filters.search).toBe('')
    expect(result.current.activeFilterCount).toBe(0)
  })
})
```

#### Form Validation (`src/lib/schemas.ts`)
```typescript
// src/lib/schemas.test.ts
import { describe, it, expect } from 'vitest'
import { postBountySchema, submitWorkSchema } from './schemas'

describe('postBountySchema', () => {
  it('validates valid bounty data', () => {
    const validData = {
      title: 'Fix authentication bug',
      description: 'User login fails with 2FA enabled',
      issueUrl: 'https://github.com/org/repo/issues/123',
      reward: 500,
      token: 'XLM',
      milestonesTotal: 3,
    }

    expect(() => postBountySchema.parse(validData)).not.toThrow()
  })

  it('rejects invalid GitHub URL', () => {
    const invalidData = {
      title: 'Fix bug',
      description: 'Description',
      issueUrl: 'https://example.com/not-github',
      reward: 100,
      token: 'XLM',
    }

    expect(() => postBountySchema.parse(invalidData)).toThrow()
  })

  it('requires minimum reward', () => {
    const invalidData = {
      title: 'Fix bug',
      description: 'Description',
      issueUrl: 'https://github.com/org/repo/issues/1',
      reward: 0,
      token: 'XLM',
    }

    expect(() => postBountySchema.parse(invalidData)).toThrow()
  })
})
```

### 2. Integration Tests

#### Component Rendering
```typescript
// src/components/bounty/BountyCard.test.tsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { BountyCard } from './BountyCard'

const mockBounty = {
  id: '1',
  title: 'Fix authentication bug',
  description: 'User login fails',
  repoName: 'org/repo',
  issueUrl: 'https://github.com/org/repo/issues/123',
  issueNumber: 123,
  status: 'open',
  reward: 500,
  token: 'XLM',
  tags: ['bug', 'security'],
  postedBy: 'GABC...XYZ',
  createdAt: new Date().toISOString(),
  milestonesTotal: 3,
  milestonesCompleted: 1,
}

function renderBountyCard(props = {}) {
  return render(
    <BrowserRouter>
      <BountyCard bounty={mockBounty} {...props} />
    </BrowserRouter>
  )
}

describe('BountyCard', () => {
  it('renders bounty title', () => {
    renderBountyCard()
    expect(screen.getByText('Fix authentication bug')).toBeInTheDocument()
  })

  it('displays reward correctly', () => {
    renderBountyCard()
    expect(screen.getByText(/500 XLM/i)).toBeInTheDocument()
  })

  it('shows milestone progress', () => {
    renderBountyCard()
    expect(screen.getByText('1/3 (33%)')).toBeInTheDocument()
  })

  it('renders tags', () => {
    renderBountyCard()
    expect(screen.getByText('bug')).toBeInTheDocument()
    expect(screen.getByText('security')).toBeInTheDocument()
  })

  it('links to bounty detail page', () => {
    renderBountyCard()
    const link = screen.getByRole('link', { name: /Fix authentication bug/i })
    expect(link).toHaveAttribute('href', '/bounties/1')
  })

  it('shows Claim button for open bounties', () => {
    renderBountyCard()
    expect(screen.getByRole('button', { name: /Claim/i })).toBeInTheDocument()
  })

  it('shows View button for claimed bounties', () => {
    renderBountyCard({ bounty: { ...mockBounty, status: 'claimed' } })
    expect(screen.getByRole('button', { name: /View/i })).toBeInTheDocument()
  })
})
```

#### User Interactions
```typescript
// src/components/bounty/BountyFilterSidebar.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BountyFilterSidebar } from './BountyFilterSidebar'

describe('BountyFilterSidebar', () => {
  const mockFilters = {
    search: '',
    status: 'all',
    token: 'all',
    tags: [],
    minReward: 0,
    maxReward: 10000,
    sort: 'newest',
  }

  const mockProps = {
    filters: mockFilters,
    allTags: ['bug', 'feature', 'docs'],
    maxRewardInList: 10000,
    activeFilterCount: 0,
    updateFilter: vi.fn(),
    toggleTag: vi.fn(),
    resetFilters: vi.fn(),
  }

  it('calls updateFilter when status changes', async () => {
    const user = userEvent.setup()
    render(<BountyFilterSidebar {...mockProps} />)

    // Find and click status filter
    const statusSelect = screen.getByRole('combobox', { name: /status/i })
    await user.click(statusSelect)
    
    const openOption = screen.getByRole('option', { name: /open/i })
    await user.click(openOption)

    expect(mockProps.updateFilter).toHaveBeenCalledWith('status', 'open')
  })

  it('calls toggleTag when tag is clicked', async () => {
    const user = userEvent.setup()
    render(<BountyFilterSidebar {...mockProps} />)

    const bugTag = screen.getByRole('button', { name: /bug/i })
    await user.click(bugTag)

    expect(mockProps.toggleTag).toHaveBeenCalledWith('bug')
  })

  it('calls resetFilters when reset button clicked', async () => {
    const user = userEvent.setup()
    render(<BountyFilterSidebar {...mockProps} activeFilterCount={3} />)

    const resetButton = screen.getByRole('button', { name: /reset/i })
    await user.click(resetButton)

    expect(mockProps.resetFilters).toHaveBeenCalled()
  })
})
```

#### Context & State Management
```typescript
// src/contexts/WalletContext.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WalletProvider, useWallet } from './WalletContext'

// Mock Freighter API
vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn(),
  getPublicKey: vi.fn(),
  getNetwork: vi.fn(),
}))

function TestComponent() {
  const { isConnected, address, connect, disconnect } = useWallet()

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {address && <div>Address: {address}</div>}
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}

describe('WalletContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('starts in disconnected state', () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    )

    expect(screen.getByText('Status: Disconnected')).toBeInTheDocument()
  })

  it('connects wallet successfully', async () => {
    const { isConnected, getPublicKey, getNetwork } = await import('@stellar/freighter-api')
    
    vi.mocked(isConnected).mockResolvedValue(true)
    vi.mocked(getPublicKey).mockResolvedValue('GABC123...XYZ')
    vi.mocked(getNetwork).mockResolvedValue('PUBLIC')

    const user = userEvent.setup()
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    )

    const connectButton = screen.getByRole('button', { name: /connect/i })
    await user.click(connectButton)

    await waitFor(() => {
      expect(screen.getByText('Status: Connected')).toBeInTheDocument()
      expect(screen.getByText(/Address: GABC123/)).toBeInTheDocument()
    })
  })

  it('disconnects wallet', async () => {
    const user = userEvent.setup()
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    )

    // Assuming already connected
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i })
    await user.click(disconnectButton)

    await waitFor(() => {
      expect(screen.getByText('Status: Disconnected')).toBeInTheDocument()
    })
  })
})
```

### 3. End-to-End Tests

#### Critical User Flows
```typescript
// e2e/post-bounty.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Post Bounty Flow', () => {
  test('complete bounty posting journey', async ({ page }) => {
    // Navigate to post bounty page
    await page.goto('http://localhost:5173/post-bounty')

    // Should prompt wallet connection
    await expect(page.getByText('Wallet required')).toBeVisible()
    
    // Connect wallet
    await page.click('button:has-text("Connect Wallet")')
    
    // Wait for Freighter extension popup (in real test, you'd handle this)
    // For demo purposes, we'll mock the wallet connection state
    
    // Fill bounty form
    await page.fill('input[name="issueUrl"]', 'https://github.com/stellar/js-stellar-sdk/issues/123')
    await page.fill('input[name="title"]', 'Fix XDR parsing bug')
    await page.fill('textarea[name="description"]', 'The XDR parser fails when encountering certain memo types')
    
    // Select token
    await page.click('button:has-text("XLM")')
    
    // Set reward
    await page.fill('input[name="reward"]', '500')
    
    // Set milestones
    await page.click('button[aria-label="Increase milestones"]')
    await page.click('button[aria-label="Increase milestones"]') // 3 milestones
    
    // Add tags
    await page.fill('input[placeholder*="tag"]', 'bug')
    await page.press('input[placeholder*="tag"]', 'Enter')
    await page.fill('input[placeholder*="tag"]', 'typescript')
    await page.press('input[placeholder*="tag"]', 'Enter')
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Post Bounty")')
    
    // Wait for transaction signing
    await expect(page.getByText('Posting...')).toBeVisible()
    
    // Should redirect to bounty list
    await expect(page).toHaveURL(/\/bounties/)
    
    // Should show success toast
    await expect(page.getByText('Bounty posted!')).toBeVisible()
  })

  test('validates form inputs', async ({ page }) => {
    await page.goto('http://localhost:5173/post-bounty')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.getByText(/required/i)).toBeVisible()
  })
})
```

```typescript
// e2e/claim-bounty.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Claim Bounty Flow', () => {
  test('claim bounty successfully', async ({ page }) => {
    // Navigate to bounty detail
    await page.goto('http://localhost:5173/bounties/1')
    
    // Verify bounty is open
    await expect(page.getByText('Open')).toBeVisible()
    
    // Click claim button
    await page.click('button:has-text("Claim Bounty")')
    
    // Modal should open
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Confirm Bounty Claim')).toBeVisible()
    
    // Review bounty details in modal
    await expect(page.getByText(/500 XLM/i)).toBeVisible()
    
    // Confirm claim
    await page.click('button:has-text("Confirm & Sign")')
    
    // Wait for transaction signing
    await expect(page.getByText('Signing transaction...')).toBeVisible()
    
    // Success state
    await expect(page.getByText('Bounty Claimed!')).toBeVisible()
    
    // Close modal
    await page.click('button:has-text("Close")')
    
    // Status should update to Claimed
    await expect(page.getByText('Claimed')).toBeVisible()
  })
})
```

---

## Manual Testing

### Pre-Release Checklist

#### Functional Testing
- [ ] **Wallet Integration**
  - [ ] Connect Freighter wallet
  - [ ] Connect on testnet and mainnet
  - [ ] Disconnect wallet
  - [ ] Wallet state persists across page refresh
  - [ ] Error handling for Freighter not installed

- [ ] **Bounty Lifecycle**
  - [ ] Post a new bounty
  - [ ] Browse and filter bounties
  - [ ] View bounty details
  - [ ] Claim a bounty
  - [ ] Submit work
  - [ ] Approve submission (poster)
  - [ ] Reject submission (poster)
  - [ ] Raise dispute

- [ ] **User Profile & Dashboard**
  - [ ] View contributor profile
  - [ ] View dashboard with stats
  - [ ] See active bounties
  - [ ] See completed bounties
  - [ ] View earnings history

- [ ] **Leaderboard**
  - [ ] View ranking
  - [ ] Sort by different metrics
  - [ ] Navigate to user profiles

#### Cross-Browser Testing
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Testing
Test on:
- [ ] iOS Safari
- [ ] Chrome Android
- [ ] Responsive design mode (320px, 375px, 768px, 1024px)

#### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces content properly
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on images
- [ ] Form labels are associated

#### Performance Testing
- [ ] Lighthouse score > 90
- [ ] Page load < 3s on 3G
- [ ] No layout shift (CLS < 0.1)
- [ ] Images are optimized
- [ ] Code splitting works

---

## Continuous Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Build application
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:unit"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## Test Coverage Goals

### Target Coverage
- **Overall**: 70%+
- **Critical paths**: 90%+
- **Utilities**: 80%+
- **Components**: 60%+

### Coverage Reports
```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/main.tsx',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
})
```

---

## Testing Checklist

### Before Each Release
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Critical E2E flows pass
- [ ] No console errors or warnings
- [ ] Lighthouse score > 90
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Accessibility audit passed
- [ ] Security audit passed
- [ ] Performance benchmarks met

### New Feature Checklist
- [ ] Unit tests for business logic
- [ ] Integration tests for user interactions
- [ ] E2E test for critical path (if applicable)
- [ ] Accessibility review
- [ ] Mobile responsiveness verified
- [ ] Documentation updated
- [ ] Error handling tested
- [ ] Loading states tested
- [ ] Empty states tested

---

## Next Steps

1. **Install Testing Dependencies**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui jsdom
npm install -D @playwright/test
```

2. **Create Test Configuration**
- `vitest.config.ts`
- `playwright.config.ts`
- `setupTests.ts`

3. **Write First Tests**
- Start with utility functions (easy wins)
- Add component tests for critical features
- Create E2E tests for user flows

4. **Set Up CI/CD**
- Configure GitHub Actions
- Set up pre-commit hooks
- Enable coverage reporting

5. **Establish Testing Culture**
- Write tests with new features
- Review test coverage in PRs
- Refactor tests as code evolves

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://www.a11yproject.com/checklist/)
