# Design Document: Expense & Budget Visualizer

## Overview

The Expense & Budget Visualizer is a fully client-side static web application that allows users to record, review, sort, and visualize daily expenses without sign-up, installation, a backend server, or a database.

The application code is contained in exactly three files:

* `index.html`
* `css/style.css`
* `js/script.js`

All persistent application data is stored in the browser using the Local Storage API. Persistent data includes:

* Expense transactions
* Theme preference
* Spending limit

The active transaction sort order is stored only in memory and resets to `newest` whenever the application reloads.

The application covers the following core functional areas:

1. Transaction creation with form validation
2. Scrollable transaction history
3. Transaction deletion with confirmation
4. Automatic total expense calculation
5. Spending distribution chart
6. Local Storage persistence
7. Dark and light theme
8. Transaction sorting
9. Spending limit tracking
10. Responsive and accessible user interface

The application uses Chart.js through a CDN to render the spending chart. No package manager, build tool, framework, backend, automated testing framework, or database is required.

---

## Goals

The design must ensure that the application:

* Is simple and easy to understand
* Works well on mobile, tablet, and desktop screens
* Loads quickly without a build process
* Stores user data locally in the browser
* Updates the interface immediately after user actions
* Uses readable and maintainable Vanilla JavaScript
* Remains functional in modern browsers
* Meets all mandatory features and three selected optional challenges

---

## Selected Optional Challenges

The application implements the following optional features:

1. Dark and light mode toggle
2. Transaction sorting
3. Spending limit warning

---

## Key Design Decisions

### 1. No framework and no build process

The application uses only:

* HTML5
* CSS3
* Vanilla JavaScript
* Chart.js through CDN
* Local Storage

The project does not use:

* React
* Vue
* Angular
* jQuery
* TypeScript
* Node.js
* npm
* Vite
* Webpack
* Backend server
* Database
* Automated test framework

The application can be opened directly through `index.html` or run using a static preview tool such as Live Server.

### 2. Exactly one CSS file and one JavaScript file

All application styling is contained in:

```text
css/style.css
```

All application logic is contained in:

```text
js/script.js
```

No additional application CSS or JavaScript files may be created.

### 3. Section-based JavaScript organization

Because JavaScript modules and build tools are not used, `script.js` is divided into clearly labelled sections:

1. Constants and configuration
2. DOM references
3. Application state
4. Formatting utilities
5. Local Storage utilities
6. Validation
7. Transaction operations
8. Sorting
9. Rendering
10. Chart management
11. Theme management
12. Spending limit management
13. Event listeners
14. Application initialization

### 4. Separate Local Storage operations

Persistent data is stored using separate functions and separate keys.

Transactions, themes, and spending limits must not be saved through one ambiguous general function.

The application uses:

```javascript
loadTransactions();
saveTransactions();

loadTheme();
saveTheme();

loadSpendingLimit();
saveSpendingLimit();
```

### 5. Safe user text rendering

Transaction item names come from user input and must be treated as untrusted text.

User-provided values are inserted into the interface using:

```javascript
element.textContent
```

User-provided transaction names must never be inserted directly through `innerHTML`.

### 6. Display-only transaction sorting

Sorting only changes the order shown in the transaction list.

Sorting must:

* Return a new array
* Leave the original state array unchanged
* Never reorder data stored in Local Storage

### 7. Focused rendering updates

Transaction changes affect several interface components, while theme and sorting changes affect only specific components.

The application uses:

```javascript
renderAllTransactionData();
```

for adding and deleting transactions.

Other actions use focused updates:

* Sort change → `renderTransactionList()`
* Theme change → `applyTheme()`
* Spending limit change → `renderSpendingLimit()`

---

## Architecture

### Application Architecture

The application follows a single-page, event-driven architecture.

```text
┌──────────────────────────────────────────────────────────┐
│                         Browser                          │
│                                                          │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  index.html  │  │ css/style.css  │  │ js/script.js │  │
│  └──────────────┘  └────────────────┘  └──────┬───────┘  │
│                                               │          │
│  ┌────────────────────────────────────────────▼───────┐  │
│  │                Application Logic                  │  │
│  │                                                    │  │
│  │  Constants and configuration                      │  │
│  │  DOM references                                   │  │
│  │  In-memory application state                      │  │
│  │  Validation                                       │  │
│  │  Transaction operations                           │  │
│  │  Sorting                                          │  │
│  │  Rendering                                        │  │
│  │  Chart.js management                              │  │
│  │  Theme management                                 │  │
│  │  Spending limit management                        │  │
│  │  Event listeners                                  │  │
│  │  Initialization                                   │  │
│  └───────────────────────────┬────────────────────────┘  │
│                              │                           │
│  ┌───────────────────────────▼────────────────────────┐  │
│  │               Browser Local Storage               │  │
│  │                                                    │  │
│  │  ebv_transactions   → JSON array                  │  │
│  │  ebv_theme          → "light" or "dark"           │  │
│  │  ebv_spending_limit → positive number or absent   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                    Chart.js                        │  │
│  │      Loaded through jsDelivr CDN in index.html    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Adding a transaction

```text
User submits form
        ↓
Submit event listener
        ↓
Read and normalize form values
        ↓
Validate item name, amount, and category
        ↓
Invalid?
├── Yes → Display inline validation messages
└── No
     ↓
Create transaction object
     ↓
Add transaction to state.transactions
     ↓
saveTransactions()
     ↓
Reset form
     ↓
renderAllTransactionData()
```

### Deleting a transaction

```text
User clicks Delete
        ↓
Read transaction ID from data attribute
        ↓
Request confirmation
        ↓
Cancelled?
├── Yes → Keep transaction unchanged
└── No
     ↓
deleteTransaction(id)
     ↓
saveTransactions()
     ↓
renderAllTransactionData()
```

### Changing sort order

```text
User selects sort option
        ↓
Update state.sortOrder
        ↓
Create sorted display copy
        ↓
renderTransactionList()
```

The original transaction array and Local Storage order remain unchanged.

### Changing theme

```text
User clicks theme toggle
        ↓
Determine new theme
        ↓
Update state.theme
        ↓
saveTheme()
        ↓
applyTheme()
```

### Saving a spending limit

```text
User enters spending limit
        ↓
Validate input
        ↓
Invalid?
├── Yes → Display validation message
└── No
     ↓
Update state.spendingLimit
     ↓
saveSpendingLimit()
     ↓
renderSpendingLimit()
```

---

## Project Structure

```text
project-root/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── .kiro/
│   ├── steering/
│   │   ├── product.md
│   │   ├── tech.md
│   │   └── structure.md
│   └── specs/
│       └── expense-budget-visualizer/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── README.md
└── .gitignore
```

The `.kiro` directory must remain in the repository and must not be added to `.gitignore`.

---

## HTML Design

### Main Page Structure

The `index.html` page uses semantic HTML elements.

```text
body
├── header
│   ├── application title
│   ├── application description
│   └── theme toggle
│
├── main
│   ├── summary section
│   │   ├── total expenses card
│   │   └── spending limit card
│   │
│   ├── transaction form section
│   │   └── transaction form
│   │
│   ├── chart section
│   │   └── spending chart
│   │
│   └── transaction history section
│       ├── section heading
│       ├── sort control
│       └── scrollable transaction list
│
└── footer
```

---

### Chart.js Loading

Chart.js is loaded using the CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

The application JavaScript file is loaded after Chart.js and before the closing `</body>` tag:

```html
<script src="js/script.js"></script>
```

No npm installation is used.

---

## Components and Interfaces

### 1. Header

The header contains:

* Application title
* Short description
* Theme toggle button

Suggested structure:

```html
<header class="app-header">
    <div>
        <p class="eyebrow">Personal Finance</p>
        <h1>Expense & Budget Visualizer</h1>
        <p>Track and understand your daily spending.</p>
    </div>

    <button
        type="button"
        id="theme-toggle"
        aria-pressed="false"
        aria-label="Switch to dark mode"
    >
        Dark Mode
    </button>
</header>
```

The theme toggle must update:

* Button label
* `aria-label`
* `aria-pressed`

---

### 2. Total Expenses Display

The total expense is displayed prominently near the top of the page.

Suggested element:

```html
<p id="total-display">Rp0</p>
```

Rendering interface:

```javascript
function renderTotal(transactions) {
    // Calculate and display the sum of transaction amounts.
}
```

The displayed value uses Indonesian Rupiah formatting.

---

### 3. Transaction Input Form

HTML element:

```html
<form id="transaction-form" novalidate>
```

### Form fields

| Field     | Element                  | Main attributes                      |
| --------- | ------------------------ | ------------------------------------ |
| Item Name | `<input type="text">`    | `id="item-name"`                     |
| Amount    | `<input type="number">`  | `id="amount"`, `min="1"`, `step="1"` |
| Category  | `<select>`               | `id="category"`                      |
| Submit    | `<button type="submit">` | `id="add-btn"`                       |

### Category selector

The category selector contains a disabled placeholder and exactly three valid categories:

```html
<select
    id="category"
    name="category"
    required
    aria-describedby="category-error"
>
    <option value="" selected disabled>Select category</option>
    <option value="Food">Food</option>
    <option value="Transport">Transport</option>
    <option value="Fun">Fun</option>
</select>
```

The placeholder is not considered a valid category.

### Validation message elements

Each field has an associated validation message:

```html
<span
    id="item-name-error"
    class="error-message"
    aria-live="polite"
></span>
```

Validation messages are associated with fields using `aria-describedby`.

### Validation interface

```javascript
function validateTransactionForm(itemName, amount, category) {
    // Return true when all values are valid.
    // Display inline messages for invalid values.
}
```

Validation rules:

* Item name must not be empty or whitespace-only
* Amount must be a finite number greater than zero
* Category must be Food, Transport, or Fun

After a successful submission:

* Form fields are reset
* Category returns to its disabled placeholder
* Validation messages are cleared
* Focus may return to the item name field

---

### 4. Transaction History

The history section contains:

* Section heading
* Sort control
* Scrollable transaction list
* Empty state

Suggested list structure:

```html
<ul id="transaction-list" class="transaction-list"></ul>
```

Each transaction is rendered as an `<li>`.

Each list item contains:

* Item name
* IDR-formatted amount
* Category badge
* Delete button

Suggested generated structure:

```html
<li class="transaction-item">
    <div class="transaction-info">
        <p class="transaction-name"></p>
        <span class="transaction-category"></span>
    </div>

    <div class="transaction-actions">
        <strong class="transaction-amount"></strong>
        <button type="button" class="delete-btn">
            Delete
        </button>
    </div>
</li>
```

Transaction names must be assigned through:

```javascript
nameElement.textContent = transaction.itemName;
```

They must not be inserted through `innerHTML`.

### Delete button

Each delete button receives the transaction ID through a data attribute:

```javascript
deleteButton.dataset.id = transaction.id;
```

The delete button also receives an accessible label:

```javascript
deleteButton.setAttribute(
    "aria-label",
    `Delete transaction ${transaction.itemName}`
);
```

### Empty state

When there are no transactions, the list displays:

```text
No transactions yet. Add your first expense above.
```

### Scroll behavior

The list receives a maximum height and vertical scrolling:

```css
.transaction-list {
    max-height: 420px;
    overflow-y: auto;
}
```

---

### 5. Delete Confirmation

Deleting a transaction requires confirmation.

Interface:

```javascript
function requestTransactionDeletion(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (confirmed) {
        deleteTransaction(id);
    }
}
```

If the user cancels:

* No state changes occur
* Local Storage remains unchanged
* The transaction stays visible

If the user confirms:

* The matching transaction is removed
* Transactions are saved
* Total is recalculated
* Spending limit is updated
* Chart is updated
* Transaction list is re-rendered

---

### 6. Sort Control

HTML element:

```html
<select id="sort-control">
    <option value="newest">Newest First</option>
    <option value="highest">Highest Amount</option>
    <option value="lowest">Lowest Amount</option>
    <option value="category">Category A–Z</option>
</select>
```

The default sort order is:

```javascript
"newest"
```

Sorting interface:

```javascript
function getSortedTransactions(transactions, sortOrder) {
    // Return a new sorted array.
    // Never mutate the source array.
}
```

Sorting rules:

* `newest`: timestamp descending
* `highest`: amount descending
* `lowest`: amount ascending
* `category`: category alphabetically ascending

When categories are equal, the application may use timestamp descending as a secondary order.

Implementation must begin with a copy:

```javascript
const sortedTransactions = [...transactions];
```

The source state array must not be sorted directly.

---

### 7. Spending Chart

HTML element:

```html
<canvas
    id="spending-chart"
    role="img"
    aria-label="Spending distribution by category"
></canvas>
```

A text-based chart empty-state element is also provided:

```html
<p id="chart-empty-state" hidden>
    No expense data available for the chart.
</p>
```

### Chart instance

Only one Chart.js instance is created.

```javascript
let chartInstance = null;
```

Interfaces:

```javascript
function initChart() {
    // Create the Chart.js doughnut chart once.
}

function updateChart(transactions) {
    // Update the existing chart instance.
}

function computeCategoryTotals(transactions) {
    // Return totals for Food, Transport, and Fun.
}
```

### Category colors

```javascript
const CATEGORY_COLORS = {
    Food: "#e76f51",
    Transport: "#2a9d8f",
    Fun: "#e9c46a"
};
```

The colors must remain visually distinguishable in both themes.

### Chart data format

```javascript
{
    labels: ["Food", "Transport", "Fun"],
    datasets: [
        {
            data: [foodTotal, transportTotal, funTotal],
            backgroundColor: [
                CATEGORY_COLORS.Food,
                CATEGORY_COLORS.Transport,
                CATEGORY_COLORS.Fun
            ]
        }
    ]
}
```

### Empty chart behavior

When all category totals are zero:

* The chart canvas is hidden
* The chart empty-state message is shown
* No chart error is thrown

When transaction data becomes available:

* The empty-state message is hidden
* The canvas is shown
* The chart is updated

The application must not depend on `[0, 0, 0]` automatically producing a placeholder ring.

---

### 8. Theme Toggle

The application supports:

```text
light
dark
```

The active theme is applied using a body data attribute:

```html
<body data-theme="light">
```

Theme interface:

```javascript
function applyTheme(theme) {
    // Apply the theme and update button accessibility.
}

function loadTheme() {
    // Load a valid stored theme or return "light".
}

function saveTheme(theme) {
    // Persist the theme.
}
```

Applying the theme:

```javascript
document.body.dataset.theme = theme;
```

The toggle button updates:

```javascript
themeToggle.setAttribute(
    "aria-pressed",
    theme === "dark" ? "true" : "false"
);
```

It also updates its label:

* Current light theme → button says `Dark Mode`
* Current dark theme → button says `Light Mode`

Invalid stored theme values fall back to:

```javascript
"light"
```

---

### 9. Spending Limit

The spending limit section contains:

* Numeric limit input
* Save button
* Validation message
* Current spending and limit text
* Percentage text
* Progress bar
* Warning message

Suggested structure:

```html
<section id="spending-limit-section">
    <label for="limit-input">Spending Limit</label>

    <div class="limit-form-row">
        <input
            type="number"
            id="limit-input"
            min="1"
            step="1"
            aria-describedby="limit-error"
        >

        <button type="button" id="save-limit-btn">
            Save Limit
        </button>
    </div>

    <span
        id="limit-error"
        class="error-message"
        aria-live="polite"
    ></span>

    <div id="limit-display">
        <p id="limit-summary"></p>
        <p id="limit-percentage"></p>

        <div
            class="progress-track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <div id="limit-progress-bar"></div>
        </div>

        <p id="limit-warning" aria-live="polite"></p>
    </div>
</section>
```

Interfaces:

```javascript
function validateSpendingLimit(value) {
    // Return true only for a finite number greater than zero.
}

function loadSpendingLimit() {
    // Return a valid positive number or null.
}

function saveSpendingLimit(limit) {
    // Persist the valid numeric limit.
}

function renderSpendingLimit(transactions, limit) {
    // Update summary, percentage, progress, and warning.
}
```

### Spending calculation

```javascript
const total = calculateTotal(transactions);
const percentage = (total / limit) * 100;
const progressWidth = Math.min(percentage, 100);
```

The interface may display the true percentage, including values above 100%.

The progress bar width must not exceed 100%.

### Warning behavior

A warning is displayed when:

```javascript
total >= limit
```

Example warning:

```text
You have reached or exceeded your spending limit.
```

### Neutral state

When no valid limit is saved:

* The progress bar is hidden
* No warning style is applied
* A neutral message is displayed:

```text
Set a spending limit to track your budget.
```

### Invalid limit input

The following values are rejected:

* Empty
* Non-numeric
* Zero
* Negative
* Infinite value

Invalid values do not replace the previously stored valid limit.

---

## Data Models

### Transaction Object

```javascript
{
    id: string,
    itemName: string,
    amount: number,
    category: string,
    timestamp: number
}
```

### Transaction field rules

| Field       | Rule                            |
| ----------- | ------------------------------- |
| `id`        | Non-empty unique string         |
| `itemName`  | Non-empty string after trimming |
| `amount`    | Finite number greater than zero |
| `category`  | `Food`, `Transport`, or `Fun`   |
| `timestamp` | Positive finite number          |

Example:

```javascript
{
    id: "transaction-1782478800000-a8f3c2",
    itemName: "Lunch",
    amount: 50000,
    category: "Food",
    timestamp: 1782478800000
}
```

---

## Transaction ID Generation

The application uses `crypto.randomUUID()` when available.

Fallback:

```javascript
function generateTransactionId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return `transaction-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
}
```

The fallback reduces the risk of duplicate IDs.

---

## Application State

```javascript
const state = {
    transactions: [],
    sortOrder: "newest",
    theme: "light",
    spendingLimit: null
};
```

### State behavior

* `transactions` is loaded from Local Storage
* `sortOrder` starts as `newest` after every reload
* `theme` is restored from Local Storage
* `spendingLimit` is restored from Local Storage

---

## Local Storage Design

### Storage Keys

```javascript
const STORAGE_KEYS = {
    transactions: "ebv_transactions",
    theme: "ebv_theme",
    spendingLimit: "ebv_spending_limit"
};
```

## Storage Schema

| Key                  | Stored value                             |
| -------------------- | ---------------------------------------- |
| `ebv_transactions`   | JSON string containing transaction array |
| `ebv_theme`          | String containing `light` or `dark`      |
| `ebv_spending_limit` | JSON string containing positive number   |

The sort order is not stored.

---

### Transaction Storage Functions

```javascript
function loadTransactions() {
    // Parse, validate, and return saved transactions.
}

function saveTransactions(transactions) {
    // Serialize and save transaction array.
}
```

### Defensive loading behavior

`loadTransactions()` must safely handle:

* Missing storage key
* Invalid JSON
* JSON `null`
* JSON object instead of an array
* Mixed valid and invalid transaction records
* Missing fields
* Wrong field types
* Invalid categories
* Zero or negative amounts
* Invalid timestamps
* Duplicate IDs

Only valid records are returned.

For duplicate IDs:

* Keep the first valid occurrence
* Ignore later duplicates

If no valid records exist:

```javascript
[]
```

is returned.

---

## Transaction Record Validation

```javascript
function isValidStoredTransaction(transaction) {
    return (
        transaction !== null &&
        typeof transaction === "object" &&
        typeof transaction.id === "string" &&
        transaction.id.trim().length > 0 &&
        typeof transaction.itemName === "string" &&
        transaction.itemName.trim().length > 0 &&
        Number.isFinite(transaction.amount) &&
        transaction.amount > 0 &&
        ["Food", "Transport", "Fun"].includes(
            transaction.category
        ) &&
        Number.isFinite(transaction.timestamp) &&
        transaction.timestamp > 0
    );
}
```

---

## Storage Write Failure

Local Storage writes are wrapped in `try...catch`.

```javascript
function saveTransactions(transactions) {
    try {
        localStorage.setItem(
            STORAGE_KEYS.transactions,
            JSON.stringify(transactions)
        );

        return true;
    } catch (error) {
        console.error("Unable to save transactions:", error);
        return false;
    }
}
```

The same defensive approach is used for theme and spending limit storage.

No additional notification library is introduced.

---

## Formatting Utilities

### IDR Formatter

All monetary values are stored as numbers and formatted only for display.

```javascript
const idrFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

function formatIDR(amount) {
    return idrFormatter.format(amount);
}
```

Examples:

```text
50000  → Rp50.000
150000 → Rp150.000
0      → Rp0
```

The application must not store formatted currency strings in the transaction data.

---

## JavaScript Interfaces

### Constants and Configuration

```javascript
const CATEGORIES = ["Food", "Transport", "Fun"];

const STORAGE_KEYS = {
    transactions: "ebv_transactions",
    theme: "ebv_theme",
    spendingLimit: "ebv_spending_limit"
};

const CATEGORY_COLORS = {
    Food: "#e76f51",
    Transport: "#2a9d8f",
    Fun: "#e9c46a"
};
```

---

## Transaction Functions

```javascript
function createTransaction(itemName, amount, category) {
    // Return a valid transaction object.
}

function addTransaction(transaction) {
    // Add transaction to state and persist data.
}

function requestTransactionDeletion(id) {
    // Ask the user for confirmation.
}

function deleteTransaction(id) {
    // Remove exactly the matching transaction.
}

function calculateTotal(transactions) {
    // Return the sum of all valid transaction amounts.
}
```

---

## Sorting Function

```javascript
function getSortedTransactions(transactions, sortOrder) {
    // Return a sorted copy without mutating transactions.
}
```

---

## Rendering Functions

```javascript
function renderTransactionList() {
    // Render sorted transactions or the empty state.
}

function renderTotal(transactions) {
    // Display the exact formatted total.
}

function renderSpendingLimit(transactions, limit) {
    // Display budget progress and warning state.
}

function renderAllTransactionData() {
    renderTransactionList();
    renderTotal(state.transactions);
    renderSpendingLimit(
        state.transactions,
        state.spendingLimit
    );
    updateChart(state.transactions);
}
```

---

## Validation Functions

```javascript
function validateTransactionForm(
    itemName,
    amount,
    category
) {
    // Validate form values and display field messages.
}

function validateSpendingLimit(value) {
    // Validate the spending limit.
}

function clearTransactionFormErrors() {
    // Clear form validation messages.
}

function clearSpendingLimitError() {
    // Clear spending limit validation message.
}
```

---

## Event Handling Design

### Form submit

```javascript
transactionForm.addEventListener("submit", handleFormSubmit);
```

Responsibilities:

1. Prevent default submission
2. Read values
3. Trim item name
4. Convert amount to number
5. Validate fields
6. Create transaction
7. Update state
8. Save transactions
9. Reset the form
10. Render transaction-dependent components

---

## Transaction deletion

Use event delegation on the transaction list:

```javascript
transactionList.addEventListener(
    "click",
    handleTransactionListClick
);
```

The event handler checks whether the clicked element is a delete button.

Event delegation avoids adding a separate listener to every transaction after every render.

---

## Sorting

```javascript
sortControl.addEventListener("change", handleSortChange);
```

Responsibilities:

1. Update `state.sortOrder`
2. Re-render only the transaction list

---

## Theme toggle

```javascript
themeToggle.addEventListener("click", handleThemeToggle);
```

Responsibilities:

1. Determine the next theme
2. Update state
3. Save theme
4. Apply theme

---

## Spending limit

```javascript
saveLimitButton.addEventListener(
    "click",
    handleSaveSpendingLimit
);
```

Responsibilities:

1. Read input
2. Convert input to number
3. Validate value
4. Save valid limit
5. Update state
6. Re-render spending limit display

---

## Application Initialization

The application starts after the DOM is ready.

```javascript
document.addEventListener("DOMContentLoaded", init);
```

Initialization order:

```javascript
function init() {
    cacheDOMElements();

    state.theme = loadTheme();
    applyTheme(state.theme);

    state.transactions = loadTransactions();
    state.spendingLimit = loadSpendingLimit();
    state.sortOrder = "newest";

    initChart();
    bindEventListeners();
    renderAllTransactionData();
}
```

The theme is loaded and applied before the main transaction interface is rendered.

This reduces visible theme switching during initial page load.

---

## CSS Design

### CSS Variables

The design uses CSS custom properties for theme consistency.

```css
:root {
    --color-background: #f5f5f2;
    --color-surface: #ffffff;
    --color-surface-muted: #f0f0ec;
    --color-text: #1f2933;
    --color-text-muted: #667085;
    --color-border: #d9ddd7;
    --color-accent: #2a9d8f;
    --color-accent-hover: #21867a;
    --color-danger: #c2413b;
    --color-warning: #d97706;
    --color-success: #2f855a;
    --shadow-card: 0 10px 30px rgba(31, 41, 51, 0.08);
    --radius-small: 8px;
    --radius-medium: 14px;
    --radius-large: 20px;
}
```

Dark theme overrides variables:

```css
body[data-theme="dark"] {
    --color-background: #121614;
    --color-surface: #1b211e;
    --color-surface-muted: #242c28;
    --color-text: #f4f7f5;
    --color-text-muted: #b4beb8;
    --color-border: #35403a;
}
```

The final colors may be adjusted while maintaining readable contrast.

---

### Responsive Layout

The application uses a mobile-first layout.

### Mobile

* Single-column layout
* Full-width form controls
* Summary cards stacked vertically
* Chart and form stacked
* Transaction actions remain readable
* No horizontal page overflow

### Tablet and desktop

* Summary cards may appear side by side
* Form and chart may use a two-column layout
* Transaction history spans the main content width
* Content width is constrained for readability

Suggested main container:

```css
.app-container {
    width: min(100% - 2rem, 1100px);
    margin-inline: auto;
}
```

Suggested breakpoint:

```css
@media (min-width: 768px) {
    .dashboard-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
```

---

### Touch and Interaction Design

Interactive controls must:

* Have sufficient spacing
* Remain easy to tap
* Use visible hover styles where supported
* Use visible keyboard focus styles
* Avoid depending only on color to communicate meaning

Suggested minimum control height:

```css
button,
input,
select {
    min-height: 44px;
}
```

---

### Focus Styles

```css
button:focus-visible,
input:focus-visible,
select:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
}
```

---

### Transaction List Scrolling

```css
.transaction-list {
    max-height: 420px;
    overflow-y: auto;
    overscroll-behavior: contain;
}
```

---

### Progress Bar

```css
.progress-track {
    width: 100%;
    overflow: hidden;
}

#limit-progress-bar {
    width: 0;
    max-width: 100%;
}
```

The JavaScript implementation ensures progress width never exceeds 100%.

---

## Accessibility Design

The application follows these accessibility rules:

1. Every input has a visible `<label>`
2. Labels use matching `for` and `id` values
3. Validation messages are connected through `aria-describedby`
4. Validation messages use `aria-live="polite"`
5. Interactive actions use native buttons and form controls
6. Every button explicitly defines its `type`
7. Keyboard users receive visible focus styles
8. The theme toggle updates `aria-pressed`
9. Delete buttons include transaction-specific accessible labels
10. The chart canvas includes an accessible purpose label
11. Light and dark themes maintain readable contrast
12. Important warnings are communicated using text, not color alone
13. Page structure uses semantic elements such as `header`, `main`, `section`, and `footer`

---

## Browser Compatibility

The application is designed for current versions of:

* Google Chrome
* Mozilla Firefox
* Microsoft Edge
* Apple Safari

It uses standard browser functionality:

* DOM APIs
* Local Storage
* `Intl.NumberFormat`
* CSS custom properties
* Flexbox
* CSS Grid
* Chart.js through CDN

The implementation avoids:

* Browser-specific APIs
* JavaScript modules requiring a server
* Compilation
* Transpilation
* Package installation
* Experimental APIs without fallbacks

`crypto.randomUUID()` has a timestamp-and-random fallback.

---

## Error Handling

### Transaction Form Errors

Validation messages are shown for:

* Empty item name
* Empty amount
* Non-numeric amount
* Zero amount
* Negative amount
* Missing category

Submission is blocked while input remains invalid.

---

### Spending Limit Errors

Validation messages are shown for:

* Empty input
* Non-numeric input
* Zero
* Negative number
* Non-finite number

Invalid input does not overwrite a previously saved valid spending limit.

---

### Local Storage Errors

| Scenario                                 | Handling                                                    |
| ---------------------------------------- | ----------------------------------------------------------- |
| Key is missing                           | Use default value                                           |
| Transaction JSON cannot be parsed        | Use empty transaction array                                 |
| Stored transaction value is not an array | Use empty transaction array                                 |
| Individual record is invalid             | Discard that record                                         |
| Duplicate transaction ID                 | Keep first valid record                                     |
| Theme value is invalid                   | Use light theme                                             |
| Spending limit is invalid                | Use `null`                                                  |
| Storage write fails                      | Log a clear console error and keep the interface functional |

The application must not crash because of invalid Local Storage data.

---

### Chart Errors

* `updateChart()` checks whether the Chart instance exists
* Empty transaction data shows an empty-state message
* Only one Chart instance is created
* The Chart instance is updated instead of recreated repeatedly
* Chart failure must not prevent transactions, totals, or Local Storage from functioning

---

## Correctness Properties

### Property 1: Valid transaction creation

For any valid item name, positive finite amount, and supported category, creating a transaction must produce an object containing:

* Matching item name
* Matching numeric amount
* Matching category
* Non-empty unique string ID
* Positive finite timestamp

Validates:

* Transaction creation
* Transaction data model
* Local Storage schema

---

### Property 2: Invalid form input rejection

For any form submission where at least one field is invalid:

* Validation returns false
* A relevant inline error is shown
* No transaction is added
* Stored transaction data remains unchanged

Invalid cases include:

* Empty or whitespace-only item name
* Empty amount
* Non-numeric amount
* Zero or negative amount
* Missing category

---

### Property 3: Correct total calculation

For any transaction array, including an empty array:

```javascript
calculateTotal(transactions)
```

must equal the arithmetic sum of every transaction amount.

The displayed total must equal:

```javascript
formatIDR(calculateTotal(transactions))
```

For an empty array, the displayed total is IDR zero.

---

### Property 4: Confirmed deletion removes only the target

For any confirmed deletion:

* The target transaction is removed
* Exactly one matching transaction is removed
* All other transactions remain unchanged
* The updated data is saved
* The total, limit display, chart, and list are updated

For a cancelled deletion:

* The transaction array remains unchanged
* Local Storage remains unchanged

---

### Property 5: Sorting is correct and non-mutating

For each supported sort order:

* A new array is returned
* All original transactions remain present
* The source array remains unchanged
* The display order follows the selected rule

---

### Property 6: Transaction Storage round-trip

For any array of valid transactions:

```javascript
saveTransactions(transactions);
loadTransactions();
```

must preserve:

* ID
* Item name
* Amount
* Category
* Timestamp

The array order stored in Local Storage must also be preserved.

---

### Property 7: Defensive transaction loading

For any value stored under `ebv_transactions`:

* Invalid JSON must not throw
* Non-array JSON must produce an empty result
* Invalid records must be discarded
* Valid records must remain
* Duplicate IDs must be removed after the first occurrence

---

### Property 8: Spending limit correctness

For any valid positive spending limit:

* The same numeric value is stored
* The displayed limit is formatted as IDR
* Progress is calculated from total divided by limit
* Progress-bar width never exceeds 100%
* Warning is active if and only if total is greater than or equal to the limit

For invalid limit input:

* The value is rejected
* An error message is shown
* Existing stored limit remains unchanged

---

### Property 9: Chart category totals

For any transaction array, chart data must equal:

* Sum of Food transaction amounts
* Sum of Transport transaction amounts
* Sum of Fun transaction amounts

When all totals are zero:

* The chart is hidden
* Empty state is displayed
* No JavaScript error occurs

---

### Property 10: Safe rendering

For any transaction item name containing HTML-like or JavaScript-like text:

* The literal text is displayed
* No HTML element is created from the input
* No script or event handler is executed
* The name is inserted using `textContent`

---

## Testing Strategy

All project testing is performed manually in the browser.

No test framework, automated test file, package manager, or testing dependency may be added.

## Form testing

Test:

* Valid item name, amount, and category
* Empty item name
* Whitespace-only item name
* Empty amount
* Amount equal to zero
* Negative amount
* Missing category
* Successful form reset

## Transaction testing

Test:

* Add one transaction
* Add multiple transactions
* Delete and confirm
* Delete and cancel
* Empty-state visibility
* Scroll behavior with many transactions
* Special characters in transaction names

## Total testing

Example:

```text
Food: Rp50.000
Transport: Rp20.000
Fun: Rp100.000
Expected total: Rp170.000
```

After deleting Transport:

```text
Expected total: Rp150.000
```

## Local Storage testing

1. Add transactions
2. Refresh the page
3. Confirm transactions remain
4. Edit Local Storage with invalid JSON
5. Refresh and confirm the application still loads
6. Add a mixed array containing valid and invalid records
7. Confirm only valid records remain

## Sorting testing

Use amounts:

```text
Rp10.000
Rp50.000
Rp25.000
```

Expected highest order:

```text
Rp50.000
Rp25.000
Rp10.000
```

Expected lowest order:

```text
Rp10.000
Rp25.000
Rp50.000
```

Confirm the stored transaction order is not modified by sorting.

## Chart testing

Test:

* Empty list
* One Food transaction
* Food and Transport transactions
* All three categories
* Delete one category
* Delete all transactions

Confirm there are no console errors.

## Theme testing

1. Select dark theme
2. Refresh
3. Confirm dark theme remains
4. Select light theme
5. Refresh
6. Confirm light theme remains

## Spending limit testing

1. Save a valid limit
2. Refresh and confirm persistence
3. Spend below the limit
4. Reach the exact limit
5. Exceed the limit
6. Enter zero
7. Enter a negative number
8. Clear the input and save
9. Confirm invalid values do not overwrite the valid limit

## Responsive testing

Test at:

```text
375 × 667
390 × 844
768 × 1024
Desktop width
```

Confirm:

* No horizontal overflow
* Form controls remain usable
* Chart remains responsive
* Buttons remain easy to tap
* Transaction content does not overlap
* Transaction list remains scrollable

## Browser testing

Perform a final check in available modern browsers:

* Chrome
* Firefox
* Edge
* Safari when available

---

### Testing Scope

The correctness properties in this document are implementation and manual-review guidance only.

The project must not add:

* Jest
* Vitest
* Mocha
* Cypress
* Playwright
* fast-check
* npm configuration
* Package files
* Automated test scripts
* Test directories

Manual verification is sufficient for this project.

---

### Final Implementation Constraints

The implementation must follow these rules:

1. Use only HTML, CSS, and Vanilla JavaScript
2. Use Chart.js only through CDN
3. Use Local Storage for persistent data
4. Do not use a backend
5. Do not use a database
6. Do not use a framework
7. Do not use Node.js or npm
8. Do not add a build process
9. Do not add a testing framework
10. Keep exactly one application CSS file
11. Keep exactly one application JavaScript file
12. Keep `.kiro` in the repository
13. Use `index.html` as the application entry point
14. Keep transaction text rendering safe
15. Maintain responsive mobile behavior
16. Maintain current-browser compatibility
17. Do not add features outside the approved requirements
