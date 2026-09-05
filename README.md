# ChainBounty Frontend

> Decentralized bounty board for open source contributors on the Stellar blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

ChainBounty is a decentralized bounty platform that connects open source maintainers with contributors. Maintainers can post bounties for GitHub issues, and contributors can claim, complete, and earn rewards held in escrow on the Stellar blockchain.

### Why ChainBounty?

- **Decentralized**: No middleman, funds locked in smart contracts
- **Transparent**: All transactions on-chain and auditable
- **Trustless**: Automatic escrow and payout system
- **Milestone-based**: Break work into verifiable milestones
- **Dispute resolution**: Community-driven arbitration
- **Multi-token**: Support for XLM, USDC, and AQUA

---

## ✨ Features

### For Maintainers
- 🎯 Post bounties for GitHub issues
- 💰 Set rewards in XLM, USDC, or AQUA
- 📊 Track milestone progress
- ✅ Approve or reject submissions
- 🔒 Automatic escrow protection

### For Contributors
- 🔍 Browse and filter available bounties
- 🏆 Claim bounties and submit work
- 💸 Receive payments on completion
- 📈 Build reputation via leaderboard
- 🗣️ Raise disputes if needed

### Platform Features
- 🔐 Freighter wallet integration
- 📱 Fully responsive mobile design
- ♿ WCAG 2.1 Level AA accessible
- 🚀 Optimized performance (Lighthouse 90+)
- 🌓 Dark mode support
- 🔔 Real-time status updates
- 📊 Comprehensive dashboard

---

## 🛠️ Tech Stack

### Core
- **Framework**: [React 18.3](https://react.dev/) - UI library
- **Language**: [TypeScript 5.5](https://www.typescriptlang.org/) - Type safety
- **Build Tool**: [Vite 5.4](https://vitejs.dev/) - Fast dev & build
- **Router**: [React Router 6](https://reactrouter.com/) - Client-side routing

### Styling
- **CSS Framework**: [Tailwind CSS 3.4](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Accessible components
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons

### Blockchain
- **Wallet**: [Freighter API](https://www.freighter.app/) - Stellar wallet
- **SDK**: [Stellar SDK 12.3](https://stellar.github.io/js-stellar-sdk/) - Blockchain interaction

### Forms & Validation
- **Forms**: [React Hook Form 7.53](https://react-hook-form.com/) - Form management
- **Validation**: [Zod 3.23](https://zod.dev/) - Schema validation

### Development
- **Linting**: [ESLint 9](https://eslint.org/) - Code linting
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/) - Static types

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Freighter Wallet** browser extension ([Install](https://www.freighter.app/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/chainbounty-frontend.git
cd chainbounty-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Environment Setup

The app works out of the box with mock data. For production, create a `.env` file:

```env
# Stellar Network
VITE_STELLAR_NETWORK=TESTNET  # or PUBLIC for mainnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Smart Contract
VITE_CONTRACT_ID=CBOUNTY_CONTRACT_ID_HERE

# Optional: IPFS for file uploads
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud
```

---

## 📁 Project Structure

```
chainbounty-frontend/
├── public/                # Static assets
│   └── vite.svg          # Favicon
├── src/
│   ├── components/       # React components
│   │   ├── accessibility/ # A11y components (LiveRegion, SkipToContent)
│   │   ├── bounty/       # Bounty-related components
│   │   ├── dispute/      # Dispute components
│   │   ├── error/        # Error boundaries & states
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   ├── ui/           # shadcn/ui components
│   │   └── wallet/       # Wallet integration
│   ├── contexts/         # React contexts
│   │   └── WalletContext.tsx  # Wallet state management
│   ├── hooks/            # Custom React hooks
│   │   ├── useBountyFilters.ts
│   │   ├── useBountyPolling.ts
│   │   ├── useFocusTrap.ts
│   │   ├── useMediaQuery.ts
│   │   └── useToast.ts
│   ├── lib/              # Utilities & helpers
│   │   ├── accessibility.ts  # A11y helpers
│   │   ├── bounty.ts     # Bounty utilities
│   │   ├── dispute.ts    # Dispute config
│   │   ├── ipfs.ts       # IPFS integration
│   │   ├── mockData.ts   # Mock data for development
│   │   ├── performance.ts # Performance monitoring
│   │   ├── schemas.ts    # Zod validation schemas
│   │   ├── stellar.ts    # Stellar SDK helpers
│   │   ├── transaction.ts # Transaction utilities
│   │   └── utils.ts      # General utilities
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── BountyListPage.tsx
│   │   ├── BountyDetailPage.tsx
│   │   ├── PostBountyPage.tsx
│   │   ├── ClaimBountyPage.tsx
│   │   ├── SubmitWorkPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LeaderboardPage.tsx
│   │   ├── ContributorProfilePage.tsx
│   │   ├── DisputeCenterPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/            # TypeScript type definitions
│   │   ├── bounty.ts
│   │   ├── dispute.ts
│   │   ├── profile.ts
│   │   └── timeline.ts
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   ├── index.css         # Global styles
│   └── vite-env.d.ts     # Vite type definitions
├── .gitignore
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── package.json          # Dependencies & scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # This file
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:5173)

# Build
npm run build            # Build for production (dist/)
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors

# Type Checking
npm run type-check       # Run TypeScript type check
```

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: Edit files in `src/`
3. **See updates**: Vite hot-reloads automatically
4. **Check types**: `npm run type-check`
5. **Lint code**: `npm run lint`
6. **Build**: `npm run build`

### Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Tailwind** for styling (utility-first)
- **shadcn/ui** for components
- **React Hook Form** for forms
- **Zod** for validation

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `test:` Add/update tests
- `chore:` Maintenance

---

## 🧪 Testing

### Test Strategy

We follow the testing pyramid:
- **70% Unit Tests**: Functions, hooks, utilities
- **25% Integration Tests**: Component interactions
- **5% E2E Tests**: Critical user flows

### Running Tests

```bash
# Unit & Integration Tests
npm run test              # Run all tests
npm run test:unit         # Run unit tests only
npm run test:watch        # Watch mode
npm run test:ui           # Vitest UI
npm run test:coverage     # Coverage report

# E2E Tests
npm run test:e2e          # Run E2E tests (Playwright)
npm run test:e2e:ui       # Playwright UI mode
```

### Writing Tests

```typescript
// src/lib/bounty.test.ts
import { describe, it, expect } from 'vitest'
import { formatReward } from './bounty'

describe('formatReward', () => {
  it('formats XLM rewards correctly', () => {
    expect(formatReward(1000, 'XLM')).toBe('1,000 XLM')
  })
})
```

See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for detailed testing guide.

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in `dist/`.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/chainbounty-frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-org/chainbounty-frontend)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

Set these in your deployment platform:

```env
VITE_STELLAR_NETWORK=PUBLIC
VITE_STELLAR_HORIZON_URL=https://horizon.stellar.org
VITE_CONTRACT_ID=<your-contract-id>
```

---

## 📚 Documentation

Comprehensive documentation is available in the following files:

### Core Documentation
- **[README.md](./README.md)** - This file (overview & getting started)
- **[TESTING_STRATEGY.md](./TESTING_STRATEGY.md)** - Testing philosophy & examples

### Feature Documentation
- **[STELLAR_INTEGRATION.md](./STELLAR_INTEGRATION.md)** - Stellar SDK integration
- **[TOAST_IMPLEMENTATION.md](./TOAST_IMPLEMENTATION.md)** - Toast notification system
- **[LOADING_STATES.md](./LOADING_STATES.md)** - Loading patterns
- **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** - Error handling strategy
- **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** - Accessibility guidelines

### Performance & Mobile
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance optimization guide
- **[MOBILE_RESPONSIVE.md](./MOBILE_RESPONSIVE.md)** - Mobile design documentation
- **[MOBILE_QUICK_REFERENCE.md](./MOBILE_QUICK_REFERENCE.md)** - Mobile patterns quick ref

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **Report bugs**: Open an issue with reproduction steps
2. **Suggest features**: Describe the feature and use case
3. **Submit PRs**: Fork, create branch, make changes, submit PR
4. **Improve docs**: Help us make documentation better
5. **Write tests**: Increase test coverage

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Write code**: Follow our code style
4. **Add tests**: Ensure tests pass
5. **Commit changes**: Use conventional commits
6. **Push to branch**: `git push origin feature/my-feature`
7. **Open PR**: Describe your changes

### Code Review Process

1. All PRs require review before merging
2. CI checks must pass (linting, type check, tests)
3. Maintain test coverage above 70%
4. Update documentation as needed

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stellar Development Foundation** - Blockchain infrastructure
- **shadcn/ui** - Beautiful component library
- **Tailwind Labs** - Amazing CSS framework
- **Vercel** - Hosting & deployment
- **The open source community** - For all the amazing tools

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/chainbounty-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/chainbounty-frontend/discussions)
- **Discord**: [Join our server](https://discord.gg/chainbounty)
- **Twitter**: [@ChainBounty](https://twitter.com/chainbounty)

---

## 🗺️ Roadmap

### Current Version: v0.1.0 (Beta)

### Upcoming Features
- [ ] Push notifications for bounty updates
- [ ] Email notifications
- [ ] GitHub OAuth integration
- [ ] Multi-signature approval for large bounties
- [ ] Recurring bounties
- [ ] Bounty templates
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

### Future Vision
- Cross-chain support (beyond Stellar)
- Integration with more git platforms (GitLab, Bitbucket)
- AI-powered bounty matching
- Decentralized reputation system
- DAO governance for platform decisions

---

<div align="center">

**Built with ❤️ by the ChainBounty team**

[Website](https://chainbounty.com) • [Docs](https://docs.chainbounty.com) • [Blog](https://blog.chainbounty.com)

</div>
