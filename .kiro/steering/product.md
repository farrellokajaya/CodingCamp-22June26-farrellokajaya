# Product Overview

**Expense & Budget Visualizer** — a mobile-friendly web application for recording and visualizing daily expenses.

## Core Features

- Add expense transactions with item name, amount, and category
- View a scrollable transaction history
- Delete individual transactions
- Automatically calculated total expenses
- Pie chart showing spending distribution by category (powered by Chart.js via CDN)
- Persistent data via browser Local Storage
- Total expenses and chart update automatically whenever a transaction is added or deleted
- Display a clear empty state when no transactions are available

## Optional Features

- Dark / light mode toggle with the selected theme saved in Local Storage
- Sort transactions by newest, highest amount, lowest amount, or category
- Spending limit with a visual warning when the limit is reached or exceeded
- Spending limit is saved in Local Storage and restored after refresh

## Default Categories

Food, Transport, Fun

## Validation Rules

- Item name, amount, and category fields must not be empty
- Amount must be a valid number greater than zero
- Category must be one of the available categories
- Invalid input must display a clear validation message
- The form must reset after a transaction is added successfully

## Target Users

Anyone who wants a quick, no-signup way to track daily spending directly in their browser.
