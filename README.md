# Austrian Salary Calculator

A bilingual web application for calculating Austrian net salaries (Nettogehalt) from gross income (Bruttogehalt) and vice versa, with accurate 2026 tax rates and social insurance contributions.

🔗 **Live at:** [austriansalary.xyz](https://austriansalary.xyz)

## Overview

Austrian Salary Calculator helps employees, apprentices, and pensioners in Austria understand their take-home pay. The calculator provides detailed breakdowns of social insurance contributions, income tax, and various tax credits, supporting both gross-to-net and net-to-gross calculations.

The application is fully bilingual (English/German) and optimized for desktop and mobile use.

## Features

### Calculation Modes
- **Gross-to-Net**: Calculate net salary from gross income
- **Net-to-Gross**: Calculate required gross salary to achieve desired net income

### Employment Types
- Employees (Angestellte/Arbeiter)
- Apprentices (Lehrlinge) with reduced social insurance rates
- Pensioners (Pensionisten) with specific tax credits

### What's Included in Calculations

**Social Insurance Contributions:**
- Health insurance (Krankenversicherung)
- Pension insurance (Pensionsversicherung)
- Unemployment insurance (Arbeitslosenversicherung)
- Accident insurance (Unfallversicherung)
- Different rates for employees, apprentices, and pensioners

**Income Tax:**
- Progressive Austrian tax brackets (2026 rates)
- Automatic tax credits (Verkehrsabsetzbetrag, Arbeitnehmerabsetzbetrag, etc.)
- Pensioner-specific tax credits (Pensionistenabsetzbetrag)

**Family Benefits:**
- Family Bonus Plus (Familienbonus Plus)
  - €2,000/year per child under 18
  - €700/year per child over 18 (with Familienbeihilfe)
- Single earner/parent tax credits (Alleinverdiener-/Alleinerzieherabsetzbetrag)
  - Scales based on number of children

**Commuter Allowance (Pendlerpauschale):**
- Small commuter allowance (Kleines Pendlerpauschale) - public transport available
- Large commuter allowance (Großes Pendlerpauschale) - no public transport
- Distance-based tiers from 20km to 60km+
- Additional commuter euro (Pendlereuro) supplement

**Special Payments:**
- 13th salary (vacation bonus / Urlaubsgeld)
- 14th salary (Christmas bonus / Weihnachtsgeld)
- Preferential tax treatment calculation

**Additional Income:**
- Company car benefit (Sachbezug Firmenauto)
  - 2% or 1.5% of purchase price (based on CO₂ emissions)
  - €0 for electric/hydrogen vehicles
- Other taxable benefits (Sonstige Bezüge)

### User Interface Features
- Clean, guided input flow with collapsible sections
- Real-time form validation
- Print-optimized results page with shareable URL
- Comprehensive FAQ page with 8 common questions
- Session storage for form state persistence
- Privacy policy page

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Heroicons](https://heroicons.com/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)
- **Deployment:** [Vercel](https://vercel.com/)

## Project Structure

```
Austrian-Salary-Calculator/
├── src/
│   ├── app/                      # Next.js app directory (routes)
│   │   ├── page.tsx              # Home page with calculator form
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── globals.css           # Global styles and print styles
│   │   ├── result/               # Results page route
│   │   │   ├── page.tsx          # Calculation results display
│   │   │   └── layout.tsx        # Results page metadata
│   │   ├── faq/                  # FAQ page route
│   │   │   ├── page.tsx          # FAQ questions and answers
│   │   │   └── layout.tsx        # FAQ page metadata
│   │   ├── privacy/              # Privacy policy route
│   │   │   ├── page.tsx          # Privacy policy content
│   │   │   └── layout.tsx        # Privacy page metadata
│   │   ├── icon.png              # Favicon (800x800)
│   │   ├── apple-icon.png        # Apple touch icon
│   │   └── opengraph-image.png   # Social sharing image (1200x630)
│   │
│   ├── components/               # Reusable React components
│   │   ├── button.tsx            # Primary action button
│   │   ├── toggle-group.tsx      # Toggle button group (radio alternative)
│   │   ├── language-toggle.tsx   # EN/DE language switcher
│   │   ├── language-provider.tsx # Language context provider
│   │   ├── site-footer.tsx       # Footer with links
│   │   └── header-link.tsx       # Styled navigation links
│   │
│   └── lib/                      # Business logic and utilities
│       ├── calculator.ts         # Core salary calculation engine
│       │                         # - Social insurance calculations
│       │                         # - Income tax with progressive brackets
│       │                         # - Family bonus and tax credits
│       │                         # - Commuter allowance
│       │                         # - Special payments (13th/14th salary)
│       │
│       ├── i18n.ts               # Internationalization
│       │                         # - Translation dictionaries (EN/DE)
│       │                         # - Language switching logic
│       │                         # - Cookie-based persistence
│       │
│       └── url-utils.ts          # URL encoding/decoding
│                                 # - Compress calculation inputs to URL
│                                 # - Enable shareable result links
│
├── public/                       # Static assets
│   ├── sitemap.xml               # SEO sitemap
│   ├── robots.txt                # Search engine directives
│   └── *.svg                     # Next.js default SVG assets
│
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
└── eslint.config.mjs             # ESLint rules
```

## Calculation Engine

The core calculation logic (`src/lib/calculator.ts`) implements:

1. **Social Insurance**: Different contribution rates for employees, apprentices, and pensioners
2. **Income Tax**: Progressive tax brackets with automatic credits
3. **Special Payments**: Separate tax calculation for 13th and 14th salaries
4. **Net-to-Gross**: Iterative solver to reverse-calculate required gross salary
5. **Validation**: Input validation and edge case handling

## Internationalization

The app uses a custom i18n solution with:
- Complete English and German translations
- Cookie-based language persistence
- React Context for language state
- Type-safe translation keys

## SEO & Metadata

- Comprehensive meta tags (Open Graph, Twitter Cards)
- Structured data (JSON-LD) for WebApplication and FAQPage
- Canonical URLs on all pages
- Bilingual hreflang tags
- Sitemap with 3 pages (home, FAQ, privacy)
- Robots.txt allowing all crawlers including AI bots

## License

This project is open source and available for educational purposes.

---

Built with ❤️ by [Aestero Studios](mailto:aesterostudios@icloud.com)
