# Expense & Budget Visualizer

A mobile-friendly, client-side web application for recording and visualizing daily expenses — no sign-up, no backend, no build step required.

---

## Features

### Core
- Add expense transactions with an item name, amount (IDR), and category
- Scrollable transaction history with item name, amount, category badge, and delete button
- Delete individual transactions with a confirmation prompt
- Automatically updated total expenses display
- Doughnut chart showing spending distribution by category (powered by Chart.js via CDN)
- Empty states for both the transaction list and the chart when no data exists
- All data persists in the browser via Local Storage — survives page refreshes

### Optional
- **Dark / Light mode** toggle with theme preference saved to Local Storage
- **Transaction sorting** — Newest First, Highest Amount, Lowest Amount, Category A–Z
- **Spending limit** — set a budget, track progress with a visual progress bar, and get a warning when the limit is reached or exceeded

---

## Categories

| Category  | Color   |
|-----------|---------|
| Food      | #e76f51 |
| Transport | #2a9d8f |
| Fun       | #e9c46a |

---

## Validation

- Item name must not be empty or whitespace-only
- Amount must be a finite number greater than zero
- Category must be one of: Food, Transport, Fun
- Invalid input shows a clear inline error message beneath the relevant field
- Spending limit must be a positive number; invalid entries are rejected without clearing a previously saved limit

---

## Tech Stack

| Layer      | Technology                                 |
|------------|--------------------------------------------|
| Markup     | HTML5 (semantic elements)                  |
| Styles     | CSS3 with custom properties                |
| Logic      | Vanilla JavaScript (ES6+)                  |
| Chart      | [Chart.js](https://www.chartjs.org/) via CDN |
| Storage    | Browser Local Storage API                  |

No frameworks, no npm, no build tools.

---

## Project Structure

```
project-root/
├── index.html        — application entry point
├── css/
│   └── style.css     — all styles (layout, theme, responsiveness)
├── js/
│   └── script.js     — all logic (DOM, state, storage, chart, events)
├── .kiro/            — Kiro AI spec and steering files (keep in repo)
└── README.md
```

---

## Running the App

Open `index.html` directly in a modern browser, or use a local static server:

```bash
# VS Code Live Server (recommended)
# Right-click index.html → "Open with Live Server"

# Python
python -m http.server 8080

# Node.js (no install needed)
npx serve .
```

No compilation or installation step is required.

---

## Browser Support

Tested against current versions of Chrome, Firefox, Edge, and Safari.

---

## Local Storage Keys

| Key                  | Value                          |
|----------------------|--------------------------------|
| `ebv_transactions`   | JSON array of transaction objects |
| `ebv_theme`          | `"light"` or `"dark"`          |
| `ebv_spending_limit` | Positive number (JSON)         |
