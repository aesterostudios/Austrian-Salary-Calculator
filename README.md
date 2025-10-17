# Austrian Salary Calculator

Austrian Salary Calculator is a web application that helps employees, apprentices, and pensioners estimate their net take-home pay from a given gross salary. The interface walks users through the required inputs step by step and presents a detailed breakdown of deductions, allowances, and credits on the results page. The app supports both English and German and is optimized for use on desktop and mobile devices.

## Features

- Guided two-step input flow for entering gross salary and relevant benefits or allowances
- Support for monthly or annual income, including taxable benefits such as company cars or other allowances
- Optional commuter allowance, family bonus, and single-earner credit configuration
- Detailed results with net and gross totals, social insurance, income tax, and commuter allowance breakdowns
- Built-in FAQ and privacy policy pages, with persistent language selection stored in a cookie

## Tech Stack

- [Next.js 15](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Heroicons](https://heroicons.com/) for iconography

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

```bash
npm run start
```

## Project Structure

```
src/
├─ app/              # Next.js app directory with routes for calculator, results, FAQ, and privacy pages
├─ components/       # Shared UI components such as the header language toggle and footer
└─ lib/              # Calculator logic and internationalization helpers
```

## Contributing

Contributions are welcome. Please open an issue describing the proposed change before submitting a pull request.
