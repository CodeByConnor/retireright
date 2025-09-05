# RetireRight - Retirement Contribution Calculator

A sophisticated web application that calculates optimal 401(k), Solo 401(k), and SEP contribution limits for self-employed professionals based on business structure, location, and income.

## 🚀 Live Demo

**Production URL:** [https://retireright.vercel.app](https://retireright.vercel.app)

## ✨ Features

- **Multi-Entity Support**: Sole Proprietorship, S-Corp, and C-Corp calculations
- **State-Aware Tax Planning**: Considers state-specific tax implications
- **Age-Based Calculations**: Automatic catch-up contributions for 50+
- **Contribution Type Flexibility**: Pre-tax, Roth, or mixed allocations
- **Auto-Rounding Currency Input**: Intelligent input formatting and rounding
- **Real-Time Calculations**: Instant results with detailed breakdowns
- **IRS Compliance**: Uses current 2024 IRS contribution limits
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Comprehensive Testing**: 99 unit tests with 100% coverage

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **Deployment**: Vercel with edge functions
- **UI Components**: Custom component library with elegant animations

## 📊 Architecture

```
RetireRight/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/             # Reusable UI components
│   │   ├── calculator/         # Calculator-specific components
│   │   └── ui/                 # Base UI component library
│   ├── lib/
│   │   ├── rules/              # Tax calculation engine
│   │   │   ├── engine.ts       # Main calculation logic
│   │   │   ├── entities.ts     # Business entity calculations
│   │   │   ├── irsLimits.ts    # IRS limits and rates
│   │   │   └── states.ts       # State-specific rules
│   │   ├── types.ts            # TypeScript definitions
│   │   └── utils.ts            # Utility functions
│   └── __tests__/              # Comprehensive test suite
```

## 🧪 Quality Assurance

- **99 Unit Tests**: Comprehensive test coverage
- **Type Safety**: Full TypeScript implementation
- **Linting**: ESLint with strict configuration
- **CI/CD**: Automated testing and deployment
- **Error Handling**: Graceful error boundaries and validation

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Connor Pham** - Full Stack Developer

---
