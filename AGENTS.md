# AGENTS.md

## Verification

```bash
npm run typecheck   # TypeScript check (run after every change)
npm run lint        # ESLint
npm run build       # Full build: tsc + vite
```

There is no test suite. Verify changes by running typecheck and visually confirming in the browser (`npm run dev`, port 5173).

## Things you won't figure out from the code alone

Bootstrap and Chart.js are loaded as CDN globals in `index.html` — don't npm install or import them. Use Bootstrap classes directly in JSX and access Chart.js via `window.Chart`.

There is no backend. All data lives in localStorage through `src/utils/storage.ts`. Every context provider reads and writes through that module.

Component styles use CSS Modules (`*.module.css` imported as `styles`). Don't add global CSS in component files — Bootstrap utility classes are the exception.

`AppProvider` nests providers in a specific order: Household > Inventory > Achievement > Score. `ShoppingProvider` is separate and wraps at the router level. Respect this ordering when adding new contexts.

Preparedness scoring is built around a 21-day supply target (`DAYS_OF_SUPPLY` in `src/types/index.ts`) with weighted categories. Don't change that constant unless explicitly asked to.
