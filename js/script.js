// ============================================================
// 1. CONSTANTS & CONFIGURATION
// ============================================================

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

const state = {
    transactions: [],
    sortOrder: "newest",
    theme: "light",
    spendingLimit: null
};

let chartInstance = null;

// ============================================================
// 2. DOM REFERENCES
// ============================================================

let transactionForm;
let itemNameInput;
let amountInput;
let categorySelect;
let transactionList;
let totalDisplay;
let sortControl;
let themeToggle;
let limitInput;
let saveLimitButton;
let limitError;
let limitSummary;
let limitPercentage;
let limitProgressBar;
let limitWarning;
let limitDisplay;
let limitProgressTrack;
let spendingChart;
let chartEmptyState;
let spendingLimitSection;

function cacheDOMElements() {
    transactionForm    = document.getElementById("transaction-form");
    itemNameInput      = document.getElementById("item-name");
    amountInput        = document.getElementById("amount");
    categorySelect     = document.getElementById("category");
    transactionList    = document.getElementById("transaction-list");
    totalDisplay       = document.getElementById("total-display");
    sortControl        = document.getElementById("sort-control");
    themeToggle        = document.getElementById("theme-toggle");
    limitInput         = document.getElementById("limit-input");
    saveLimitButton    = document.getElementById("save-limit-btn");
    limitError         = document.getElementById("limit-error");
    limitSummary       = document.getElementById("limit-summary");
    limitPercentage    = document.getElementById("limit-percentage");
    limitProgressBar   = document.getElementById("limit-progress-bar");
    limitWarning       = document.getElementById("limit-warning");
    limitDisplay       = document.getElementById("limit-display");
    limitProgressTrack = document.querySelector(".progress-track");
    spendingChart      = document.getElementById("spending-chart");
    chartEmptyState    = document.getElementById("chart-empty-state");
    spendingLimitSection = document.getElementById("spending-limit-section");
}

// ============================================================
// 3. FORMATTING UTILITIES
// ============================================================

const idrFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

function formatIDR(amount) {
    return idrFormatter.format(amount);
}

function calculateTotal(transactions) {
    return transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );
}

// ============================================================
// 4. LOCAL STORAGE UTILITIES
// ============================================================

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
        ["Food", "Transport", "Fun"].includes(transaction.category) &&
        Number.isFinite(transaction.timestamp) &&
        transaction.timestamp > 0
    );
}

function loadTransactions() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.transactions);

        if (raw === null) {
            return [];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        const seenIds = new Set();
        const result = [];

        for (const item of parsed) {
            if (!isValidStoredTransaction(item)) {
                continue;
            }
            if (seenIds.has(item.id)) {
                continue;
            }
            seenIds.add(item.id);
            result.push(item);
        }

        return result;
    } catch (error) {
        console.error("Unable to load transactions:", error);
        return [];
    }
}

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

function loadTheme() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.theme);
        if (stored === "light" || stored === "dark") {
            return stored;
        }
        return "light";
    } catch (error) {
        console.error("Unable to load theme:", error);
        return "light";
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch (error) {
        console.error("Unable to save theme:", error);
    }
}

function loadSpendingLimit() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.spendingLimit);

        if (raw === null) {
            return null;
        }

        const parsed = JSON.parse(raw);

        if (Number.isFinite(parsed) && parsed > 0) {
            return parsed;
        }

        return null;
    } catch (error) {
        console.error("Unable to load spending limit:", error);
        return null;
    }
}

function saveSpendingLimit(limit) {
    try {
        localStorage.setItem(
            STORAGE_KEYS.spendingLimit,
            JSON.stringify(limit)
        );
    } catch (error) {
        console.error("Unable to save spending limit:", error);
    }
}

// ============================================================
// 5. VALIDATION
// ============================================================

function clearTransactionFormErrors() {
    document.getElementById("item-name-error").textContent = "";
    document.getElementById("amount-error").textContent = "";
    document.getElementById("category-error").textContent = "";
}

function clearSpendingLimitError() {
    limitError.textContent = "";
}

function validateTransactionForm(itemName, amount, category) {
    clearTransactionFormErrors();

    let isValid = true;

    if (typeof itemName !== "string" || itemName.trim().length === 0) {
        document.getElementById("item-name-error").textContent =
            "Item name is required.";
        isValid = false;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        document.getElementById("amount-error").textContent =
            "Amount must be a positive number.";
        isValid = false;
    }

    if (!CATEGORIES.includes(category)) {
        document.getElementById("category-error").textContent =
            "Please select a category.";
        isValid = false;
    }

    return isValid;
}

function validateSpendingLimit(value) {
    return Number.isFinite(value) && value > 0;
}

// ============================================================
// 6. TRANSACTION OPERATIONS
// ============================================================

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

function createTransaction(itemName, amount, category) {
    return {
        id: generateTransactionId(),
        itemName,
        amount,
        category,
        timestamp: Date.now()
    };
}

function addTransaction(transaction) {
    state.transactions.push(transaction);
    saveTransactions(state.transactions);
}

function deleteTransaction(id) {
    state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== id
    );
    saveTransactions(state.transactions);
}

function requestTransactionDeletion(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (confirmed) {
        deleteTransaction(id);
        return true;
    }

    return false;
}

// ============================================================
// 7. SORTING
// ============================================================

function getSortedTransactions(transactions, sortOrder) {
    const sortedTransactions = [...transactions];

    switch (sortOrder) {
        case "newest":
            sortedTransactions.sort(
                (a, b) => b.timestamp - a.timestamp
            );
            break;
        case "highest":
            sortedTransactions.sort(
                (a, b) => b.amount - a.amount
            );
            break;
        case "lowest":
            sortedTransactions.sort(
                (a, b) => a.amount - b.amount
            );
            break;
        case "category":
            sortedTransactions.sort((a, b) => {
                const categoryComparison = a.category.localeCompare(b.category);
                if (categoryComparison !== 0) {
                    return categoryComparison;
                }
                return b.timestamp - a.timestamp;
            });
            break;
    }

    return sortedTransactions;
}

// ============================================================
// 8. RENDERING
// ============================================================

function renderTransactionList() {
    transactionList.innerHTML = "";

    if (state.transactions.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "transaction-empty-state";
        emptyItem.textContent = "No transactions yet. Add your first expense above.";
        transactionList.appendChild(emptyItem);
        return;
    }

    const sorted = getSortedTransactions(state.transactions, state.sortOrder);

    for (const transaction of sorted) {
        // <li class="transaction-item">
        const listItem = document.createElement("li");
        listItem.className = "transaction-item";

        // <div class="transaction-info">
        const infoDiv = document.createElement("div");
        infoDiv.className = "transaction-info";

        const nameElement = document.createElement("p");
        nameElement.className = "transaction-name";
        nameElement.textContent = transaction.itemName;

        const categoryElement = document.createElement("span");
        categoryElement.className = "transaction-category";
        categoryElement.dataset.category = transaction.category;
        categoryElement.textContent = transaction.category;

        infoDiv.appendChild(nameElement);
        infoDiv.appendChild(categoryElement);

        // <div class="transaction-actions">
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "transaction-actions";

        const amountElement = document.createElement("strong");
        amountElement.className = "transaction-amount";
        amountElement.textContent = formatIDR(transaction.amount);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = transaction.id;
        deleteButton.setAttribute("aria-label", `Delete transaction ${transaction.itemName}`);

        actionsDiv.appendChild(amountElement);
        actionsDiv.appendChild(deleteButton);

        listItem.appendChild(infoDiv);
        listItem.appendChild(actionsDiv);

        transactionList.appendChild(listItem);
    }
}

function renderTotal(transactions) {
    totalDisplay.textContent = formatIDR(calculateTotal(transactions));
}

function renderSpendingLimit(transactions, limit) {
    if (limit === null) {
        limitSummary.textContent = "Set a spending limit to track your budget.";
        limitPercentage.textContent = "";
        limitProgressBar.style.width = "0%";
        limitProgressTrack.setAttribute("aria-valuenow", "0");
        limitWarning.textContent = "";
        spendingLimitSection.classList.remove("is-warning");
        return;
    }

    const total = calculateTotal(transactions);
    const percentage = (total / limit) * 100;
    const progressWidth = Math.min(percentage, 100);

    limitSummary.textContent = `Spent: ${formatIDR(total)} of ${formatIDR(limit)}`;
    limitPercentage.textContent = `${Math.round(percentage)}% used`;
    limitProgressBar.style.width = `${progressWidth}%`;
    limitProgressTrack.setAttribute("aria-valuenow", String(Math.round(percentage)));

    if (total >= limit) {
        limitWarning.textContent = "You have reached or exceeded your spending limit.";
        spendingLimitSection.classList.add("is-warning");
    } else {
        limitWarning.textContent = "";
        spendingLimitSection.classList.remove("is-warning");
    }
}

function renderAllTransactionData() {
    renderTransactionList();
    renderTotal(state.transactions);
    renderSpendingLimit(state.transactions, state.spendingLimit);
    updateChart(state.transactions);
}

// ============================================================
// 9. CHART MANAGEMENT
// ============================================================

function computeCategoryTotals(transactions) {
    const totals = { Food: 0, Transport: 0, Fun: 0 };

    for (const transaction of transactions) {
        if (Object.prototype.hasOwnProperty.call(totals, transaction.category)) {
            totals[transaction.category] += transaction.amount;
        }
    }

    return totals;
}

function initChart() {
    const ctx = spendingChart.getContext("2d");

    chartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Food", "Transport", "Fun"],
            datasets: [
                {
                    data: [0, 0, 0],
                    backgroundColor: [
                        CATEGORY_COLORS.Food,
                        CATEGORY_COLORS.Transport,
                        CATEGORY_COLORS.Fun
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

function updateChart(transactions) {
    if (chartInstance === null) {
        return;
    }

    const totals = computeCategoryTotals(transactions);
    const allZero =
        totals.Food === 0 && totals.Transport === 0 && totals.Fun === 0;

    if (allZero) {
        spendingChart.style.display = "none";
        chartEmptyState.removeAttribute("hidden");
        return;
    }

    chartEmptyState.setAttribute("hidden", "");
    spendingChart.style.display = "";

    chartInstance.data.datasets[0].data = [
        totals.Food,
        totals.Transport,
        totals.Fun
    ];

    chartInstance.update();
}

// ============================================================
// 10. THEME MANAGEMENT
// ============================================================

function applyTheme(theme) {
    document.body.dataset.theme = theme;

    if (theme === "dark") {
        themeToggle.textContent = "Light Mode";
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
        themeToggle.textContent = "Dark Mode";
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
}

// ============================================================
// 11. EVENT HANDLERS
// ============================================================

function handleFormSubmit(event) {
    event.preventDefault();

    const itemName = itemNameInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categorySelect.value;

    const isValid = validateTransactionForm(itemName, amount, category);

    if (!isValid) {
        return;
    }

    const transaction = createTransaction(itemName, amount, category);
    addTransaction(transaction);

    transactionForm.reset();
    clearTransactionFormErrors();

    renderAllTransactionData();
}

function handleTransactionListClick(event) {
    const deleteBtn = event.target.closest(".delete-btn");

    if (!deleteBtn) {
        return;
    }

    const id = deleteBtn.dataset.id;
    const wasDeleted = requestTransactionDeletion(id);

    if (wasDeleted) {
        renderAllTransactionData();
    }
}

function handleSortChange() {
    state.sortOrder = sortControl.value;
    renderTransactionList();
}

function handleThemeToggle() {
    const newTheme = state.theme === "light" ? "dark" : "light";
    state.theme = newTheme;
    saveTheme(newTheme);
    applyTheme(newTheme);
}

function handleSaveSpendingLimit() {
    const rawValue = limitInput.value;
    const parsedValue = Number(rawValue);

    if (!validateSpendingLimit(parsedValue)) {
        clearSpendingLimitError();
        limitError.textContent = "Please enter a valid spending limit greater than zero.";
        return;
    }

    clearSpendingLimitError();
    state.spendingLimit = parsedValue;
    saveSpendingLimit(parsedValue);
    renderSpendingLimit(state.transactions, state.spendingLimit);
}

// ============================================================
// 12. EVENT LISTENER BINDING
// ============================================================

function bindEventListeners() {
    transactionForm.addEventListener("submit", handleFormSubmit);
    transactionList.addEventListener("click", handleTransactionListClick);
    sortControl.addEventListener("change", handleSortChange);
    themeToggle.addEventListener("click", handleThemeToggle);
    saveLimitButton.addEventListener("click", handleSaveSpendingLimit);
}

// ============================================================
// 13. APPLICATION INITIALIZATION
// ============================================================

function init() {
    cacheDOMElements();

    const storedTheme = loadTheme();
    state.theme = storedTheme;
    applyTheme(storedTheme);

    state.transactions = loadTransactions();
    state.spendingLimit = loadSpendingLimit();

    state.sortOrder = "newest";

    initChart();
    bindEventListeners();
    renderAllTransactionData();
}

document.addEventListener("DOMContentLoaded", init);
