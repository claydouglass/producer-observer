# Producer Intelligence Dashboard

Oregrown × Miracle Greens partnership dashboard built with React + Recharts.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
```

Output in `dist/` folder - deploy anywhere (Vercel, Netlify, S3, etc.)

## Features

- **Forecast Tab**: 6-month demand forecast with history, range bands (conservative/upside), type/category filters
- **Market Gaps Tab**: Opportunity analysis for missing product categories
- **Simulate Tab**: Toggle strategic decisions and see real-time forecast impact
- **Partnership Tab**: Health metrics and mutual commitments

## Tech Stack

- React 18
- Recharts (charts)
- Tailwind CSS (styling)
- Vite (build)
- Lucide React (icons)

## Project Structure

```
├── src/
│   ├── App.jsx          # Main dashboard component
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports
├── index.html           # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Data

Currently uses static data. To connect to live database:

1. Replace `baseData` array with API fetch
2. Update `gapData` from database query
3. Add authentication as needed

## Customization

- **Colors**: Edit Tailwind classes or add to `tailwind.config.js`
- **Branding**: Replace `VervanaLogo` component and partner names
- **Metrics**: Modify KPI cards and calculations in `App.jsx`
