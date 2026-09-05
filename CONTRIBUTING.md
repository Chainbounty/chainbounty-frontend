# Contributing to ChainBounty Frontend

Thank you for your interest in contributing to ChainBounty! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** - Value each other's ideas, styles, and viewpoints
- **Be direct but professional** - Provide constructive feedback
- **Be inclusive** - Welcome newcomers and diverse perspectives
- **Be collaborative** - Work together towards common goals
- **Be patient** - Remember that everyone has different skill levels

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js 18.x or higher
- npm 9.x or higher
- Git
- A code editor (VS Code recommended)
- Freighter wallet extension

### Development Setup

1. **Fork the repository** on GitHub
   
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chainbounty-frontend.git
   cd chainbounty-frontend
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/chainbounty/chainbounty-frontend.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Verify setup**
   - Open http://localhost:5173
   - Check that the app loads correctly
   - Try connecting a wallet

---

## 🤝 How to Contribute

### Types of Contributions

#### 1. Bug Reports
Found a bug? Help us fix it!

**Before submitting:**
- Search existing issues to avoid duplicates
- Verify the bug exists on the latest version

**When reporting:**
- Use a clear, descriptive title
- Describe the expected vs actual behavior
- Provide steps to reproduce
- Include screenshots if applicable
- Note your browser/OS version

**Template:**
```markdown
**Describe the bug**
A clear and concise description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Wallet: [e.g., Freighter 5.0]
```

#### 2. Feature Requests
Have an idea? We'd love to hear it!

**When suggesting:**
- Explain the problem it solves
- Describe the proposed solution
- Consider alternatives
- Explain why it benefits users

**Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other context or screenshots.
```

#### 3. Code Contributions

**Good first issues:**
- Look for issues labeled `good-first-issue`
- Start with small, well-defined tasks
- Ask questions if anything is unclear

**Feature development:**
- Discuss in an issue before starting
- Break large features into smaller PRs
- Update documentation as you go

---

## 💻 Coding Standards

### TypeScript

#### Type Safety
```typescript
// ✅ Good - explicit types
interface User {
  id: string
  name: string
  address: string
}

function getUser(id: string): User {
  // ...
}

// ❌ Bad - implicit any
function getUser(id) {
  // ...
}
```

#### Naming Conventions
```typescript
// Components - PascalCase
export function BountyCard() {}

// Functions - camelCase
function formatReward() {}

// Constants - SCREAMING_SNAKE_CASE
const MAX_REWARD = 10000

// Types/Interfaces - PascalCase
interface BountyData {}
type BountyStatus = 'open' | 'claimed'
```

### React

#### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
interface MyComponentProps {
  title: string
  onSave: () => void
}

// 3. Component
export function MyComponent({ title, onSave }: MyComponentProps) {
  // 4. Hooks
  const [value, setValue] = useState('')

  // 5. Event handlers
  function handleClick() {
    onSave()
  }

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Save</Button>
    </div>
  )
}
```

#### Hooks Best Practices
```typescript
// ✅ Good - descriptive names, proper dependencies
const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
  loadData()
}, [bountyId]) // Include all dependencies

const handleSubmit = useCallback(() => {
  // ...
}, [dependency])

// ❌ Bad - vague names, missing dependencies
const [flag, setFlag] = useState(false)

useEffect(() => {
  loadData()
}, []) // Missing bountyId dependency
```

### Styling with Tailwind

```typescript
// ✅ Good - organized classes
<div className="flex items-center gap-2 p-4 border rounded-md">
  <Button size="sm" variant="outline">Action</Button>
</div>

// ✅ Good - conditional classes with cn()
<div className={cn(
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
)}>

// ❌ Bad - unorganized, hard to read
<div className="p-4 gap-2 items-center rounded-md border flex">
```

### File Organization

```
component-name/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests
├── index.ts                # Exports
└── types.ts                # Types (if complex)
```

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Add/update tests
- `chore`: Maintenance (deps, config)
- `ci`: CI/CD changes

### Examples
```bash
# Simple feature
feat: add bounty expiration filter

# Bug fix with scope
fix(wallet): handle disconnection edge case

# Breaking change
feat!: redesign bounty creation flow

BREAKING CHANGE: The PostBountyPage API has changed.
Users must now provide milestones upfront.

# With body
feat(leaderboard): add pagination

Add infinite scroll pagination to leaderboard page.
Loads 20 entries at a time for better performance.

Closes #123
```

### Commit Best Practices
- Keep subject line under 72 characters
- Use imperative mood ("add" not "added")
- Don't capitalize the first letter
- No period at the end of subject
- Explain "what" and "why", not "how"

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update from main**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run checks**
   ```bash
   npm run lint        # Fix any errors
   npm run type-check  # Fix type errors
   npm run test        # Ensure tests pass
   npm run build       # Verify build works
   ```

3. **Update documentation**
   - Add/update comments in code
   - Update README if needed
   - Add/update tests

### Creating the PR

1. **Push your branch**
   ```bash
   git push origin feature/my-feature
   ```

2. **Open PR on GitHub**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe changes made
   - Add screenshots for UI changes
   - Check "Allow edits from maintainers"

### PR Template
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Works on mobile
```

### Review Process

1. **Automated checks** must pass:
   - ESLint
   - TypeScript
   - Tests
   - Build

2. **Code review** by maintainers:
   - At least 1 approval required
   - Address feedback promptly
   - Be open to suggestions

3. **Merge**:
   - Squash and merge (preferred)
   - Maintainers will merge approved PRs

---

## 🧪 Testing Guidelines

### Writing Tests

#### Unit Tests
```typescript
// src/lib/bounty.test.ts
import { describe, it, expect } from 'vitest'
import { formatReward } from './bounty'

describe('formatReward', () => {
  it('formats XLM correctly', () => {
    expect(formatReward(1000, 'XLM')).toBe('1,000 XLM')
  })

  it('handles edge cases', () => {
    expect(formatReward(0, 'XLM')).toBe('0 XLM')
    expect(formatReward(-100, 'XLM')).toBe('-100 XLM')
  })
})
```

#### Component Tests
```typescript
// src/components/BountyCard.test.tsx
import { render, screen } from '@testing-library/react'
import { BountyCard } from './BountyCard'

describe('BountyCard', () => {
  it('renders bounty title', () => {
    render(<BountyCard bounty={mockBounty} />)
    expect(screen.getByText('Fix bug')).toBeInTheDocument()
  })
})
```

### Test Coverage

- Aim for 70%+ overall coverage
- Critical features need 90%+ coverage
- Add tests for bug fixes
- Test edge cases and error handling

---

## 📖 Documentation

### Code Comments

```typescript
// ✅ Good - explains "why"
// Debounce search to avoid excessive API calls
const debouncedSearch = useMemo(() => 
  debounce(search, 300), [search]
)

// ❌ Bad - explains obvious "what"
// Set loading to true
setIsLoading(true)
```

### JSDoc for Complex Functions

```typescript
/**
 * Builds and signs a Stellar transaction for claiming a bounty
 * 
 * @param bountyId - The bounty contract ID
 * @param claimerAddress - The Stellar address of the claimer
 * @returns Signed transaction envelope XDR string
 * @throws {Error} If wallet is not connected or signing fails
 * 
 * @example
 * const txXdr = await claimBountyTransaction('bounty-123', 'GABC...')
 */
export async function claimBountyTransaction(
  bountyId: string,
  claimerAddress: string
): Promise<string> {
  // ...
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing project structure
- Updating dependencies
- Modifying setup process

---

## 🔍 Code Review Checklist

### For Contributors

Before requesting review:
- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] No console.log or debug code
- [ ] No commented-out code
- [ ] Types are properly defined
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Accessibility considered
- [ ] Mobile responsive
- [ ] Documentation updated

### For Reviewers

When reviewing:
- [ ] Code is readable and maintainable
- [ ] Logic is sound and efficient
- [ ] Tests are adequate
- [ ] No obvious bugs or edge cases
- [ ] Follows project conventions
- [ ] Performance impact is acceptable
- [ ] Security considerations addressed
- [ ] Accessibility requirements met

---

## 🆘 Getting Help

Stuck? Here's how to get help:

### Before Asking
1. Check existing issues and discussions
2. Read the documentation
3. Search Stack Overflow
4. Review similar code in the project

### Where to Ask
- **GitHub Discussions** - General questions
- **GitHub Issues** - Bug reports, features
- **Discord** - Real-time help
- **Stack Overflow** - Technical questions (tag: chainbounty)

### How to Ask Good Questions
1. Describe what you're trying to do
2. Show what you've tried
3. Include error messages
4. Provide minimal reproduction
5. Specify your environment

---

## 📚 Resources

### Learning Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Stellar Documentation](https://developers.stellar.org/)
- [React Testing Library](https://testing-library.com/react)

### Project Resources
- [Architecture Decisions](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Testing Strategy](./TESTING_STRATEGY.md)

---

## 🎉 Recognition

Contributors are recognized in:
- GitHub contributors page
- CONTRIBUTORS.md file
- Release notes
- Project website

Thank you for contributing to ChainBounty! 🚀
