# Austrian Salary Calculator

A bilingual web application for calculating Austrian net salaries (Nettogehalt) from gross income (Bruttogehalt) and vice versa, with **accurate 2026 tax rates** and social insurance contributions.

🔗 **Live at:** [austriansalary.xyz](https://austriansalary.xyz)

## Overview

Austrian Salary Calculator helps employees, apprentices, and pensioners in Austria understand their take-home pay. The calculator provides detailed breakdowns of social insurance contributions, income tax, and various tax credits, supporting both gross-to-net and net-to-gross calculations.

The application is fully bilingual (English/German) and optimized for desktop and mobile use.

✅ **Updated for 2026:** All tax brackets, credits, and regulations reflect the official 2026 Austrian tax law.

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
- Different rates for employees (18.07%/17.07%), apprentices (15.50%/14.45%), and pensioners (5.10%)
- **Minor employment threshold:** No SV below €518.44/month (Geringfügigkeitsgrenze)
- **SV exemption for special payments:** First €560.65 of 13th/14th salaries are SV-free
- **Company car 20% rule:** Only 20% of company car benefits count for SV calculation (§49 Abs 3 Z 11 ASVG)

**Income Tax:**
- Progressive Austrian tax brackets (2026 indexed rates per BGBl II 191/2025)
  - 0% up to €13,539
  - 20% €13,539 - €21,992
  - 30% €21,992 - €36,458
  - 40% €36,458 - €70,365
  - 48% €70,365 - €104,859
  - 50% €104,859 - €1,000,000
  - 55% over €1,000,000 (extended through 2029)
- Automatic employee tax credits (Verkehrsabsetzbetrag) with income-based phase-outs:
  - Base: €496
  - Erhöhter: up to €853 for low incomes
  - Zuschlag: up to €804 additional for low incomes
- Pensioner-specific tax credits (Pensionistenabsetzbetrag):
  - Normal: €1,020
  - Erhöhter: €1,502 for lower pensions
- SV-Rückerstattung (negative tax refund) for low-income earners:
  - Standard cap: €496
  - With commuter allowance: €750
  - Pensioners: €723

**Family Benefits:**
- Family Bonus Plus (Familienbonus Plus) - frozen at 2025 levels through 2027
  - €2,000/year per child under 18 (€166.67/month)
  - €700/year per child over 18 with Familienbeihilfe (€58.33/month)
- Single earner/parent tax credits (Alleinverdiener-/Alleinerzieherabsetzbetrag) - 2026 values:
  - 1 child: €601/year
  - 2 children: €813/year
  - 3+ children: €1,081 + €268 per additional child

**Commuter Allowance (Pendlerpauschale):**
- Small commuter allowance (Kleines Pendlerpauschale) - public transport available
- Large commuter allowance (Großes Pendlerpauschale) - no public transport
- Distance-based tiers from 20km to 60km+
- **Pendlereuro:** €6 per km per year (tripled from €2 in 2026)
- **Optional distance input field:** Enter one-way commute distance for accurate Pendlereuro calculation

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
- Interactive visual breakdown with donut/bar charts
- **PDF Export**: Professional print-optimized layout for saving/printing results
- Shareable URLs: Share calculation results via compressed URL parameters
- Comprehensive FAQ page (bilingual) answering common tax questions
- **Changelog page**: Track all updates and improvements
- Session storage for form state persistence
- Privacy policy page
- Mobile-responsive design
- Social media preview images (Open Graph/Twitter Cards)

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
│   │   ├── changelog/            # Changelog page route
│   │   │   ├── page.tsx          # Updates and improvements
│   │   │   └── layout.tsx        # Changelog page metadata
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

1. **Social Insurance**:
   - Different contribution rates for employees (18.07%/17.07%), apprentices (15.50%/14.45%), and pensioners (5.10%)
   - Minor employment threshold: No SV below €518.44/month
   - Company car benefit: Only 20% counts towards SV basis (§49 Abs 3 Z 11 ASVG)
   - SV exemption for special payments: First €560.65 is SV-free
2. **Income Tax**: Progressive tax brackets with automatic credits including:
   - Verkehrsabsetzbetrag with three-tier system (base, erhöhter, zuschlag)
   - Pensionistenabsetzbetrag with dual phase-out logic
   - Pendlereuro: €6 per km (accurate calculation if distance provided, fallback estimate otherwise)
   - Family Bonus Plus deduction
   - Single earner/parent credits
   - SV-Rückerstattung (negative tax) for low-income earners
3. **Special Payments**: Separate tax calculation for 13th and 14th salaries with:
   - €620 tax-free allowance
   - 6% rate on up to 1/6 of annual income
   - Progressive surcharge brackets (27.5%, 35.75%, 50%)
4. **Net-to-Gross**: Binary search algorithm to reverse-calculate required gross salary
5. **Validation**: Comprehensive input validation and edge case handling

### Calculation Accuracy

All calculations are **(almost) 100% accurate** and comply with:
- **Inflationsanpassungsverordnung 2026** (BGBl II 191/2025) - automatic indexation of tax brackets by +1.733%
- **§33 EStG** - 2026 tax credits and allowances
- **§67 EStG** - special payment (13th/14th salary) taxation rules
- Austrian social insurance contribution rates for 2026

The calculator handles edge cases including:
- Zero income (no refund)
- Very low incomes (negative tax refunds with caps)
- Very high incomes (55% top bracket over €1M)
- Income exactly at bracket boundaries
- Pensioners with varying income levels
- Complex family situations

## Recent Updates

### November 22, 2025 - Critical Calculation Fixes
- ✅ **Fixed SV for special payments:** Added €560.65 SV exemption for 13th/14th salaries
- ✅ **Fixed company car calculation:** Implemented 20% rule for SV (§49 Abs 3 Z 11 ASVG)
- ✅ **Fixed low-income SV:** Added minor employment threshold (€518.44)
- ✅ **Added Pendlereuro calculation:** €6 per km (tripled from €2)
- ✅ **Added commute distance input:** Optional field for accurate Pendlereuro calculation
- ✅ **Corrected Verkehrsabsetzbetrag limits:** Updated income phase-out thresholds
- ✅ **Created Changelog page:** Track all updates and improvements
- ✅ **User-reported test cases:** Validated calculations with real user examples

### 2026 Tax Year Update (October 2025)
- ✅ Updated all tax brackets to 2026 indexed values
- ✅ Completely rewrote employee credit system (Verkehrsabsetzbetrag)
- ✅ Implemented proper pensioner credits with dual phase-out logic
- ✅ Added SV-Rückerstattung (negative tax refund) with 2026 caps
- ✅ Updated single earner credits to 2026 values
- ✅ Updated Family Bonus Plus for children over 18 (€700/year)
- ✅ Fixed critical bug in pensioner credit calculation
- ✅ Updated FAQs for 2026 (both languages)

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
- Sitemap with 4 pages (home, FAQ, changelog, privacy)
- Robots.txt allowing all crawlers including AI bots

---

Built with ❤️ by [Aestero Studios](mailto:aesterostudios@icloud.com)
