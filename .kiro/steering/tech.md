# Tech Stack

## Stack

- **HTML5** — semantic markup in `index.html`
- **CSS3** — styles in `css/style.css`
- **Vanilla JavaScript (ES6+)** — logic in `js/script.js`
- **Chart.js** — loaded via CDN for the pie chart (no npm, no download)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## Explicitly Forbidden

Do NOT use any of the following:
- React, Vue, Angular, or any other frontend framework
- jQuery or any third-party DOM library (except Chart.js via CDN)
- TypeScript
- Node.js, npm, Vite, Webpack, or any build tool
- A backend, server-side logic, or external database
- Additional JS or CSS files beyond the ones defined in the structure

## Data Persistence

All transaction data is stored and retrieved using the browser's **Local Storage API**. There is no backend or database.

## Code Style

- Use semantic HTML elements (`<header>`, `<main>`, `<section>`, `<footer>`, etc.)
- CSS: use class selectors over IDs for styling; no inline styles
- JavaScript: use `const`/`let` (no `var`); use `addEventListener` over inline event handlers
- Keep code clean, readable, and separated by responsibility:
  - DOM manipulation and event binding in one section
  - Local Storage read/write in dedicated functions
  - Chart rendering/updating in dedicated functions
  - Validation logic in dedicated functions

## Running the Project

Open `index.html` directly in a browser, or use a local static server:

```bash
# VS Code Live Server (recommended)
# Right-click index.html → "Open with Live Server"

# Python
python -m http.server 8080

# Node.js (npx, no install needed)
npx serve .
```

No build or compile step is required. Do not add a test framework or build process.
