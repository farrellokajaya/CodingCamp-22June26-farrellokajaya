# Requirements Document

## Introduction

The Expense & Budget Visualizer is a fully client-side, responsive static website that allows users to record, view, and visualize daily expenses without any backend or sign-up. All data persists in the browser via Local Storage. The application is built with plain HTML, CSS, and Vanilla JavaScript, using Chart.js via CDN for charting. It supports dark/light mode, transaction sorting, and a configurable spending limit — all stored and restored from Local Storage.

## Glossary

- **App**: The Expense & Budget Visualizer static web application.
- **Transaction**: A single expense record consisting of a unique ID, item name, amount (positive number), category, and creation timestamp.
- **Category**: One of the three fixed expense groups: Food, Transport, or Fun.
- **Transaction_Form**: The input form containing the Item Name field, Amount field, Category selector, and Add Transaction button.
- **Transaction_List**: The scrollable UI component that displays all saved transactions.
- **Total_Display**: The UI element that prominently shows the sum of all transaction amounts.
- **Chart**: The Chart.js doughnut/pie chart that visualises spending grouped by Category.
- **Storage**: The browser's Local Storage API used to persist all application data.
- **Theme_Toggle**: The UI control that switches between dark and light visual themes.
- **Sort_Control**: The UI control (dropdown or button group) that selects the active sort order for the Transaction_List.
- **Spending_Limit**: A user-defined positive number representing the maximum intended total expenditure.
- **Spending_Limit_Display**: The UI element that shows current spending progress relative to the Spending_Limit.
- **Validator**: The JavaScript logic responsible for checking form inputs before a Transaction is created.
- **Formatter**: The JavaScript utility that formats numeric amounts as Indonesian Rupiah using `Intl.NumberFormat` with the `id-ID` locale.
- **IDR**: Indonesian Rupiah — the currency format used throughout the App.

---

## Requirements

### Requirement 1: Transaction Input Form

**User Story:** As a user, I want to fill in a form with an item name, amount, and category and submit it to add a new transaction, so that I can quickly record an expense.

#### Acceptance Criteria

1. THE Transaction_Form SHALL contain a required text input labelled "Item Name", a required number input labelled "Amount", a required Category selector containing a disabled placeholder and exactly three selectable categories: Food, Transport, and Fun, and an "Add Transaction" button.
2. WHEN the user submits the Transaction_Form with all fields correctly filled, THE App SHALL create a new Transaction with a unique ID, the entered item name, the entered amount as a positive number, the selected category, and the current timestamp.
3. WHEN the user submits the Transaction_Form with all fields correctly filled, THE App SHALL reset all Transaction_Form fields to their default empty/placeholder state.
4. WHEN the user submits the Transaction_Form and any required field is empty, THE Validator SHALL display a clear inline validation message identifying which field is missing.
5. WHEN the user submits the Transaction_Form and the Amount field contains a value that is not a valid positive number, THE Validator SHALL display a clear inline validation message stating that the amount must be a positive number.
6. THE Transaction_Form SHALL use semantic HTML `<label>` elements associated with each input via `for`/`id` attributes to ensure accessibility.
7. IF the user submits the Transaction_Form with an Amount value of zero or a negative number, THEN THE Validator SHALL treat it as invalid and display a validation message.

---

### Requirement 2: Transaction History

**User Story:** As a user, I want to see a scrollable list of all my saved transactions, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display every saved Transaction showing the item name, the amount formatted as IDR, the category, and a clearly labelled delete button for each entry.
2. WHILE no Transactions are stored, THE Transaction_List SHALL display a non-empty informative empty-state message (e.g., "No transactions yet. Add your first expense above.").
3. WHEN the Transaction_List contains more entries than the visible area, THE Transaction_List SHALL be independently scrollable without affecting the rest of the page layout.
4. WHEN the user activates the delete button of a Transaction, THE App SHALL remove that Transaction from the stored data and from the Transaction_List immediately.
5. WHEN the user activates a Transaction delete button, THE App SHALL request confirmation before permanently deleting the Transaction. IF the user cancels the confirmation, THEN THE App SHALL keep the Transaction unchanged.

---

### Requirement 3: Total Expenses Display

**User Story:** As a user, I want to see my total expenditure prominently displayed and always up to date, so that I always know how much I have spent.

#### Acceptance Criteria

1. THE Total_Display SHALL show the sum of all Transaction amounts formatted as IDR using the Formatter.
2. WHEN a new Transaction is added, THE Total_Display SHALL recalculate and update to reflect the new total without requiring a page reload.
3. WHEN a Transaction is deleted, THE Total_Display SHALL recalculate and update to reflect the reduced total without requiring a page reload.
4. THE Total_Display SHALL be positioned prominently at or near the top of the page so it is immediately visible without scrolling on typical screen sizes.
5. WHILE no Transactions are stored, THE Total_Display SHALL show IDR 0 (zero formatted as IDR).

---

### Requirement 4: Spending Chart

**User Story:** As a user, I want to see a visual breakdown of my spending by category, so that I can understand where my money is going.

#### Acceptance Criteria

1. THE Chart SHALL be rendered as a doughnut or pie chart using Chart.js loaded exclusively via CDN (`https://cdn.jsdelivr.net/npm/chart.js`).
2. THE Chart SHALL group and display total Transaction amounts separately for each Category (Food, Transport, Fun).
3. WHEN a Transaction is added or deleted, THE Chart SHALL update automatically to reflect the new category totals without requiring a page reload.
4. WHILE no Transactions are stored, THE Chart SHALL render in a valid, error-free state (e.g., showing an empty chart placeholder or hiding the chart gracefully) without throwing JavaScript errors.
5. THE Chart SHALL assign a distinct, visually distinguishable colour to each Category so users can identify categories at a glance.

---

### Requirement 5: Local Storage Persistence

**User Story:** As a user, I want my transaction data to persist between browser sessions, so that I do not have to re-enter my expenses after refreshing the page.

#### Acceptance Criteria

1. THE Storage SHALL save all Transactions in JSON format under a defined Local Storage key whenever a Transaction is added or deleted.
2. WHEN the App initialises on page load, THE App SHALL read the stored JSON from Storage and restore all previously saved Transactions into the in-memory state.
3. WHEN the App initialises and the Storage key is missing or contains data that cannot be parsed as valid JSON, THE App SHALL default to an empty Transaction array and continue loading without errors.
4. EACH Transaction stored in Storage SHALL contain at minimum: a unique string ID, item name string, amount number, category string, and creation timestamp.
5. WHEN the App reads Transaction data from Storage that is missing one or more required Transaction fields, THE App SHALL discard the invalid record and continue loading remaining valid records.
6. WHEN the App reads a Transaction from Storage, THE App SHALL only accept the record when its ID is a non-empty string, item name is a non-empty string, amount is a finite number greater than zero, category is Food, Transport, or Fun, and creation timestamp is valid.
7. WHEN multiple stored Transactions contain the same ID, THE App SHALL prevent duplicate Transaction IDs from causing incorrect deletion or rendering behaviour.

---

### Requirement 6: Dark and Light Mode

**User Story:** As a user, I want to toggle between dark and light themes and have my preference remembered, so that I can use the App comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Theme_Toggle SHALL allow the user to switch between a dark theme and a light theme with a single interaction.
2. WHEN the user activates the Theme_Toggle, THE App SHALL apply the selected theme to all visible UI elements immediately without a page reload.
3. WHEN the user activates the Theme_Toggle, THE App SHALL save the selected theme preference to Storage under a defined key.
4. WHEN the App initialises, THE App SHALL read the stored theme preference and apply it as early as possible during initialisation so that the previously selected theme is restored without requiring user interaction.
5. THE dark theme and the light theme SHALL both provide sufficient colour contrast and consistent visual styling across all UI components so that all text and interactive elements are clearly readable in both themes.

---

### Requirement 7: Transaction Sorting

**User Story:** As a user, I want to sort my transaction history by different criteria, so that I can find and review transactions more easily.

#### Acceptance Criteria

1. THE Sort_Control SHALL provide at least four sort options: newest first (by creation timestamp descending), highest amount first, lowest amount first, and by category (alphabetical).
2. WHEN the user selects a sort option, THE Transaction_List SHALL re-render in the chosen order immediately without a page reload.
3. WHEN the user selects a sort option, THE App SHALL only change the display order of Transactions and SHALL NOT modify, reorder, or otherwise alter the Transaction data persisted in Storage.
4. WHEN a new Transaction is added while a sort option other than "newest first" is active, THE Transaction_List SHALL re-render applying the currently active sort order to include the new Transaction.
5. WHEN a Transaction is deleted while a sort option is active, THE Transaction_List SHALL re-render applying the currently active sort order to the remaining Transactions.

---

### Requirement 8: Spending Limit

**User Story:** As a user, I want to set a spending limit and see a visual warning when I reach or exceed it, so that I can stay aware of my budget.

#### Acceptance Criteria

1. THE App SHALL provide a Spending_Limit input that allows the user to enter and save a positive numeric spending limit.
2. WHEN the user saves a Spending_Limit, THE App SHALL persist the value to Storage under a defined key.
3. WHEN the App initialises, THE App SHALL read the stored Spending_Limit from Storage and restore it so that the previously entered limit is available after a page refresh.
4. THE Spending_Limit_Display SHALL show the user's current total spending and the saved Spending_Limit in a progress format (e.g., progress bar or text ratio) so the user can see how much of the limit has been consumed.
5. WHEN the total Transaction amount equals or exceeds the saved Spending_Limit, THE Spending_Limit_Display SHALL apply a visible visual warning state (e.g., a warning colour, icon, or message) to alert the user that the limit has been reached or exceeded.
6. WHILE no Spending_Limit has been saved, THE Spending_Limit_Display SHALL either be hidden or show a neutral placeholder state without displaying a false warning.
7. THE Spending_Limit_Display SHALL update automatically whenever a Transaction is added or deleted, without requiring a page reload.
8. WHEN the user attempts to save an empty, non-numeric, zero, or negative Spending_Limit, THE App SHALL reject the value and display a clear validation message.
9. WHEN the user saves a valid Spending_Limit, THE App SHALL format the displayed value as IDR while storing it internally as a number.

### Requirement 9: Responsive Design, Accessibility, and Technical Compliance

**User Story:** As a user, I want the application to work smoothly and remain easy to use across common devices and modern browsers, so that I can manage my expenses without a complicated setup.

#### Acceptance Criteria

1. THE App SHALL be implemented using only HTML, CSS, and Vanilla JavaScript for its application code.
2. THE App SHALL NOT require React, Vue, Angular, jQuery, TypeScript, Node.js, npm, a build tool, a backend server, or a database.
3. THE project SHALL contain exactly one application CSS file inside `css/`, named `style.css`.
4. THE project SHALL contain exactly one application JavaScript file inside `js/`, named `script.js`.
5. THE App SHALL use `index.html` as the main application page.
6. THE App SHALL store all persistent application data client-side using the browser Local Storage API.
7. THE App SHALL display a responsive layout that remains usable on mobile, tablet, and desktop screen sizes.
8. THE App SHALL NOT produce horizontal page overflow on supported mobile screen sizes.
9. THE Transaction_Form inputs, controls, and buttons SHALL remain readable and operable on touch-screen devices.
10. THE App SHALL use semantic HTML elements and accessible labels for form controls.
11. THE App SHALL provide visible keyboard focus styles for interactive elements.
12. THE App SHALL use native buttons or appropriate form controls for interactive actions.
13. THE App SHALL remain functional in current versions of Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari.
14. WHEN Transactions, themes, sorting, or spending limits are updated, THE App SHALL update the affected interface without a full page reload.
15. THE App SHALL perform normal add, delete, sort, theme, spending-limit, total, and chart updates without noticeable interface lag.
16. THE App SHALL provide a clean, minimal interface with clear visual hierarchy and readable typography.
17. THE App SHALL load Chart.js exclusively through a CDN and SHALL NOT install Chart.js using npm or another package manager.
18. THE project SHALL retain its `.kiro` directory, including steering and specification documents, for repository submission.
19. THE App SHALL run by opening `index.html` in a browser or by using a simple static development server such as Live Server, without installation or compilation
20. THE App SHALL avoid inserting user-provided transaction names directly through unsafe HTML rendering and SHALL render user text safely.

