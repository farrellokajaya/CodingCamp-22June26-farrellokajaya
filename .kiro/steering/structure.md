# Project Structure

```
project-root/
├── index.html        # Main (and only) HTML entry point
├── css/
│   └── style.css     # All styles — layout, theme, responsiveness
├── js/
│   └── script.js     # All JavaScript — logic, DOM, storage, chart
├── .kiro/            # Kiro AI configuration — keep this in the repo
│   └── steering/
│       ├── product.md
│       ├── tech.md
│       └── structure.md
└── README.md         # Project documentation
```

## Strict File Rules

- **Only one CSS file**: `css/style.css` — do not create additional stylesheets
- **Only one JS file**: `js/script.js` — do not create additional scripts
- **Entry point**: `index.html` at the project root
- Do not introduce any new HTML pages, subdirectories for CSS/JS, or split JS modules
- Keep the `.kiro` folder in the repository

## Recommended Internal Structure for `script.js`

Organize the JavaScript file into clearly commented sections:

```
1. Constants & Config      — category list, Local Storage key, default values
2. State                   — in-memory transactions array, current sort, theme
3. Local Storage           — load() and save() functions
4. Validation              — input validation helpers
5. Transactions            — add, delete, and filter logic
6. Rendering               — render transaction list, totals, spending limit UI
7. Chart                   — initialize and update Chart.js pie chart
8. Event Listeners         — all DOM event bindings (form submit, delete, sort, theme toggle)
9. Init                    — bootstrap call on page load
```

## Visual / UI Requirements

- Clean, modern, minimal design
- Mobile-first responsive layout (works on mobile, tablet, and desktop)
- Clear visual hierarchy and readable typography
- Fast UI interactions — avoid unnecessary animations or transitions
- Support dark and light mode (via CSS class toggle on `<body>` or `<html>`)
