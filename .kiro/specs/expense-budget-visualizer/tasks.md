# Implementation Plan: Expense & Budget Visualizer

## Overview

Build the full application across exactly three files: `index.html`, `css/style.css`, and `js/script.js`. Tasks follow the section-based architecture defined in the design document. Each task builds on the previous one, ending with full wiring and integration. No test framework, no npm, no build tools.

## Tasks

- [x] 1. Build the HTML skeleton in `index.html`
  - [x] 1.1 Create the semantic page structure with `<header>`, `<main>`, and `<footer>`
    - Add application title, eyebrow text, description, and theme toggle button in `<header>`
    - Add `aria-pressed="false"` and `aria-label` to the theme toggle button
    - Load Chart.js via CDN (`https://cdn.jsdelivr.net/npm/chart.js`) before `js/script.js`
    - Link `css/style.css` in `<head>`
    - Load `js/script.js` at the end of `<body>`, after the Chart.js CDN tag
    - _Requirements: 9.1, 9.2, 9.5, 9.10, 9.17_

  - [x] 1.2 Add the summary section (total display and spending limit card)
    - Add `<p id="total-display">` inside a total expenses card
    - Add the spending limit card: `<input id="limit-input">`, `<button id="save-limit-btn">`, `<span id="limit-error">`, `<div id="limit-display">` with `id="limit-summary"`, `id="limit-percentage"`, progress track with `role="progressbar"`, `id="limit-progress-bar"`, and `id="limit-warning"`
    - Associate `limit-input` with `aria-describedby="limit-error"` and `<label for="limit-input">`
    - _Requirements: 3.1, 3.4, 8.1, 8.4, 8.9_

  - [x] 1.3 Add the transaction input form
    - Write `<form id="transaction-form" novalidate>` with `<input id="item-name">`, `<input id="amount" type="number" min="1" step="1">`, and `<select id="category">` containing disabled placeholder plus Food, Transport, Fun options
    - Add `<button type="submit" id="add-btn">Add Transaction</button>`
    - Add `<span class="error-message" aria-live="polite">` for each field using `aria-describedby` on the corresponding input
    - Use `<label for="...">` for every input
    - _Requirements: 1.1, 1.6_

  - [x] 1.4 Add the spending chart section and transaction history section
    - Add `<canvas id="spending-chart" role="img" aria-label="Spending distribution by category"></canvas>` inside a chart section
    - Add `<p id="chart-empty-state" hidden>No expense data available for the chart.</p>` adjacent to the canvas
    - Add `<section>` for transaction history containing a heading, `<select id="sort-control">` with Newest First / Highest Amount / Lowest Amount / Category A–Z options, and `<ul id="transaction-list" class="transaction-list"></ul>`
    - _Requirements: 2.1, 2.2, 4.1, 7.1_

- [x] 2. Write the full CSS stylesheet in `css/style.css`
  - [x] 2.1 Define CSS custom properties and base reset
    - Declare all `:root` color variables as specified in the design (`--color-background`, `--color-surface`, `--color-text`, etc.)
    - Declare `body[data-theme="dark"]` overrides for all color variables
    - Add a minimal box-sizing reset
    - _Requirements: 6.5, 9.16_

  - [x] 2.2 Style the layout and header
    - Write `.app-container { width: min(100% - 2rem, 1100px); margin-inline: auto; }`
    - Style `<header>` with flexbox for title block and theme toggle alignment
    - Style the footer
    - _Requirements: 9.7, 9.8_

  - [x] 2.3 Style the summary cards, form, and spending limit section
    - Style the total expenses card with prominent typography
    - Style `.spending-limit-section` card including the progress track and `#limit-progress-bar` (width starts at 0, `max-width: 100%`)
    - Add warning color styles that apply when the warning state is active
    - Style the transaction form, inputs, and select with `min-height: 44px` on interactive controls
    - Add inline error message styles
    - _Requirements: 1.6, 3.4, 8.4, 8.5, 9.9_

  - [x] 2.4 Style the chart section and transaction list
    - Style the chart canvas container to be responsive
    - Write `.transaction-list { max-height: 420px; overflow-y: auto; overscroll-behavior: contain; }`
    - Style each `.transaction-item` as a flex row showing name/category on the left and amount/delete on the right
    - Style `.transaction-category` badges with distinct background colors per category
    - Style the `.delete-btn` with danger color
    - Style the empty-state message
    - _Requirements: 2.1, 2.3, 4.5_

  - [x] 2.5 Add responsive breakpoints, focus styles, and sort control styles
    - Write `@media (min-width: 768px)` rules: two-column dashboard grid for summary cards, optional two-column layout for form and chart
    - Write focus styles: `button:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }`
    - Style `#sort-control` select element
    - _Requirements: 9.7, 9.8, 9.9, 9.11, 9.12_

- [x] 3. Write the JavaScript foundation in `js/script.js` — constants, state, and DOM references
  - [x] 3.1 Add constants, configuration, and application state object
    - Declare `const CATEGORIES = ["Food", "Transport", "Fun"]`
    - Declare `const STORAGE_KEYS = { transactions: "ebv_transactions", theme: "ebv_theme", spendingLimit: "ebv_spending_limit" }`
    - Declare `const CATEGORY_COLORS = { Food: "#e76f51", Transport: "#2a9d8f", Fun: "#e9c46a" }`
    - Declare `const state = { transactions: [], sortOrder: "newest", theme: "light", spendingLimit: null }`
    - Declare `let chartInstance = null`
    - _Requirements: 5.4, 6.1, 9.1_

  - [x] 3.2 Cache all DOM references
    - Select and store references to all interactive elements: `transactionForm`, `itemNameInput`, `amountInput`, `categorySelect`, `transactionList`, `totalDisplay`, `sortControl`, `themeToggle`, `limitInput`, `saveLimitButton`, `limitError`, `limitSummary`, `limitPercentage`, `limitProgressBar`, `limitWarning`, `limitDisplay`, `spendingChart`, `chartEmptyState`
    - Group DOM references in a `cacheDOMElements()` function called during `init()`
    - _Requirements: 9.1, 9.14_

- [x] 4. Implement formatting, Local Storage, and transaction validation utilities
  - [x] 4.1 Implement the IDR formatter and `calculateTotal`
    - Create `const idrFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 })`
    - Write `function formatIDR(amount)` returning `idrFormatter.format(amount)`
    - Write `function calculateTotal(transactions)` returning the arithmetic sum of all `transaction.amount` values; return 0 for an empty array
    - _Requirements: 3.1, 3.5_

  - [x] 4.2 Implement `isValidStoredTransaction` and the three Local Storage read/write pairs
    - Write `function isValidStoredTransaction(transaction)` with the full validation logic from the design (type checks, trim checks, `Number.isFinite`, category check)
    - Write `function loadTransactions()` / `function saveTransactions(transactions)` with `try…catch`, JSON parse guard, array check, deduplication by ID, and record-level filtering
    - Write `function loadTheme()` / `function saveTheme(theme)` returning `"light"` as fallback for invalid values
    - Write `function loadSpendingLimit()` / `function saveSpendingLimit(limit)` returning `null` as fallback
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 6.3, 6.4, 8.2, 8.3_

  - [x] 4.3 Implement transaction form validation and spending limit validation
    - Write `function validateTransactionForm(itemName, amount, category)` that sets/clears inline error spans and returns a boolean
    - Write `function validateSpendingLimit(value)` returning true only for a finite number greater than zero
    - Write `function clearTransactionFormErrors()` and `function clearSpendingLimitError()`
    - _Requirements: 1.4, 1.5, 1.7, 8.8_

- [x] 5. Implement transaction operations
  - [x] 5.1 Implement `generateTransactionId`, `createTransaction`, `addTransaction`, and `deleteTransaction`
    - Write `function generateTransactionId()` using `crypto.randomUUID()` with the timestamp-random fallback
    - Write `function createTransaction(itemName, amount, category)` returning a transaction object with all five required fields
    - Write `function addTransaction(transaction)` pushing to `state.transactions` and calling `saveTransactions`
    - Write `function deleteTransaction(id)` filtering `state.transactions` and calling `saveTransactions`
    - Write `function requestTransactionDeletion(id)` using `window.confirm` before calling `deleteTransaction`
    - _Requirements: 1.2, 2.4, 2.5, 5.4_

- [x] 6. Implement sorting
  - [x] 6.1 Implement `getSortedTransactions`
    - Write `function getSortedTransactions(transactions, sortOrder)` beginning with `const sortedTransactions = [...transactions]`
    - Implement `newest` (timestamp desc), `highest` (amount desc), `lowest` (amount asc), and `category` (alphabetical asc, timestamp desc as tiebreaker) sort rules
    - Never mutate the source array
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 7. Implement rendering functions
  - [x] 7.1 Implement `renderTransactionList`
    - Write `function renderTransactionList()` that calls `getSortedTransactions(state.transactions, state.sortOrder)` to get display order
    - Build each `<li>` programmatically: set `nameElement.textContent = transaction.itemName` (never `innerHTML`)
    - Set `deleteButton.dataset.id` and `deleteButton.setAttribute("aria-label", ...)`
    - Show the empty-state message when the array is empty
    - _Requirements: 2.1, 2.2, 7.4, 7.5, 9.20_

  - [x] 7.2 Implement `renderTotal` and `renderSpendingLimit`
    - Write `function renderTotal(transactions)` updating `totalDisplay.textContent` with `formatIDR(calculateTotal(transactions))`
    - Write `function renderSpendingLimit(transactions, limit)`: if limit is null, show neutral placeholder and hide progress; otherwise calculate percentage, set `limitProgressBar` width to `Math.min(percentage, 100)%`, update `aria-valuenow`, show warning when `total >= limit`
    - Format displayed limit and total as IDR
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 8.4, 8.5, 8.6, 8.7, 8.9_

  - [x] 7.3 Implement `renderAllTransactionData`
    - Write `function renderAllTransactionData()` that calls `renderTransactionList()`, `renderTotal(state.transactions)`, `renderSpendingLimit(state.transactions, state.spendingLimit)`, and `updateChart(state.transactions)`
    - This is the only function used after add/delete operations
    - _Requirements: 3.2, 3.3, 4.3, 8.7, 9.14_

- [ ] 8. Implement Chart.js integration
  - [ ] 8.1 Implement `computeCategoryTotals`, `initChart`, and `updateChart`
    - Write `function computeCategoryTotals(transactions)` summing amounts by Food, Transport, and Fun
    - Write `function initChart()` creating a single `Chart` instance on `#spending-chart` with type `"doughnut"`, using `CATEGORY_COLORS`, and assigning it to `chartInstance`
    - Write `function updateChart(transactions)` that calls `computeCategoryTotals`, checks if all totals are zero (hide canvas, show `chartEmptyState`), otherwise hides empty state, shows canvas, and updates `chartInstance.data.datasets[0].data` then calls `chartInstance.update()`
    - Guard against updating a null `chartInstance`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 9. Implement theme management
  - [ ] 9.1 Implement `applyTheme`, `loadTheme`, and `saveTheme`
    - Write `function applyTheme(theme)` setting `document.body.dataset.theme = theme`, updating `themeToggle.textContent` ("Dark Mode" / "Light Mode"), and updating `themeToggle.setAttribute("aria-pressed", ...)`
    - Ensure `loadTheme()` validates the stored string against `["light", "dark"]` and falls back to `"light"`
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ] 10. Implement event listeners and application initialization
  - [ ] 10.1 Implement all event handler functions
    - Write `function handleFormSubmit(event)`: prevent default, read and trim values, convert amount to number, call `validateTransactionForm`, on valid: create and add transaction, reset form, call `renderAllTransactionData`
    - Write `function handleTransactionListClick(event)`: use event delegation to detect delete button clicks via `event.target.closest(".delete-btn")`, read `dataset.id`, call `requestTransactionDeletion(id)`, then call `renderAllTransactionData` after confirmed deletion
    - Write `function handleSortChange()`: update `state.sortOrder`, call `renderTransactionList()`
    - Write `function handleThemeToggle()`: flip theme, update state, call `saveTheme`, call `applyTheme`
    - Write `function handleSaveSpendingLimit()`: read and parse limit input, validate, on valid: update `state.spendingLimit`, call `saveSpendingLimit`, call `renderSpendingLimit`; on invalid: call `clearSpendingLimitError` then show error
    - _Requirements: 1.2, 1.3, 2.4, 2.5, 6.1, 6.3, 7.2, 7.3, 8.1, 8.2, 8.8_

  - [ ] 10.2 Implement `bindEventListeners` and the `init` function
    - Write `function bindEventListeners()` attaching all listeners: `transactionForm` submit, `transactionList` click (delegation), `sortControl` change, `themeToggle` click, `saveLimitButton` click
    - Write `function init()` calling in order: `cacheDOMElements()`, load and apply theme, load transactions and spending limit, set `state.sortOrder = "newest"`, call `initChart()`, call `bindEventListeners()`, call `renderAllTransactionData()`
    - Register `document.addEventListener("DOMContentLoaded", init)`
    - _Requirements: 5.2, 6.4, 8.3, 9.14, 9.19_

- [ ] 11. Final checkpoint — Verify all features work together
  - Open `index.html` in a browser (or via Live Server) and manually verify:
    - Add transactions, confirm list updates, total updates, chart updates, and spending limit progress updates
    - Delete a transaction and confirm, then cancel a deletion
    - Sort by all four options and confirm stored data order is unchanged
    - Toggle theme and refresh to confirm persistence
    - Save a valid spending limit, refresh, and confirm it is restored
    - Enter invalid form values and confirm inline errors appear
    - Resize the browser to mobile width (375px) and confirm no horizontal overflow
  - Ensure all tasks pass, ask the user if questions arise.

## Notes

- No automated tests, no test framework, no npm, no build step — manual browser verification only
- All user-provided text must be inserted via `textContent`, never `innerHTML`
- Sorting must never mutate `state.transactions` or Local Storage order
- `renderAllTransactionData()` is the single entry point for add/delete side-effects; other updates use focused render calls
- The `.kiro` directory must remain in the repository

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "3.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "3.2"] },
    { "id": 4, "tasks": ["2.5", "4.1", "4.2", "4.3"] },
    { "id": 5, "tasks": ["5.1", "6.1"] },
    { "id": 6, "tasks": ["7.1", "7.2", "8.1", "9.1"] },
    { "id": 7, "tasks": ["7.3"] },
    { "id": 8, "tasks": ["10.1"] },
    { "id": 9, "tasks": ["10.2"] }
  ]
}
```
