
const transactionForm = document.getElementById('transactionForm');
const categoryForm = document.getElementById('categoryForm');
const budgetForm = document.getElementById('budgetForm');
const ctx = document.getElementById('analyticsChart').getContext('2d');
const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
let chart = null;
let monthlyChart = null;
let allTransactions = [];
let allCategories = [];
let allBudgets = [];

function switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(b => {
        if (b.getAttribute('data-tab') === tabId) {
            b.classList.add('bg-gray-700', 'text-primary-500');
            b.classList.remove('text-customText');
            b.querySelector('i').classList.add('text-primary-500');
            b.querySelector('i').classList.remove('text-gray-400');
        } else {
            b.classList.remove('bg-gray-700', 'text-primary-500');
            b.classList.add('text-customText');
            b.querySelector('i').classList.remove('text-primary-500');
            b.querySelector('i').classList.add('text-gray-400');
        }
    });

    document.querySelectorAll('.nav-btn-mobile').forEach(b => {
        if (b.getAttribute('data-tab') === tabId) {
            b.classList.add('text-primary-500');
            b.classList.remove('text-gray-400');
            b.querySelector('i').classList.add('text-primary-500');
            b.querySelector('span').classList.add('text-primary-500');
        } else {
            b.classList.remove('text-primary-500');
            b.classList.add('text-gray-400');
            b.querySelector('i').classList.remove('text-primary-500');
            b.querySelector('span').classList.remove('text-primary-500');
        }
    });

    document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.add('hidden');
        t.classList.remove('active');
    });

    const content = document.getElementById(tabId);
    if (content) {
        content.classList.remove('hidden');
        content.classList.remove('animate__fadeIn');
        void content.offsetWidth;
        content.classList.add('animate__fadeIn');
    }

    if (tabId === 'dashboard') loadDashboard();
    if (tabId === 'reports') loadReports();
}

document.querySelectorAll('.nav-btn, .nav-btn-mobile').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
    });
});

document.querySelector('.nav-btn[data-tab="dashboard"]').click();

document.getElementById('date').valueAsDate = new Date();

function updateCategoryVisibility() {
    const type = document.getElementById('type').value;
    const catContainer = document.getElementById('categoryContainer');
    const catSelect = document.getElementById('category');

    if (type === 'income') {
        catContainer.style.display = 'none';
        catSelect.removeAttribute('required');
    } else {
        catContainer.style.display = 'block';
        catSelect.setAttribute('required', 'true');
    }
}

document.getElementById('type').addEventListener('change', updateCategoryVisibility);

updateCategoryVisibility();

transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    let category = document.getElementById('category').value;

    if (type === 'income') {
        category = 'Income';
    }

    const data = {
        type,
        amount,
        date: document.getElementById('date').value,
        category,
        description: document.getElementById('description').value,
        recurring: document.getElementById('recurring').checked
    };
    try {
        const res = await fetch('/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        await res.json();
        transactionForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        document.getElementById('type').value = 'expense';
        updateCategoryVisibility();
        await loadTransactions();
        showNotification('Transaction added successfully', 'success');

        if (type === 'expense') {
            const budget = allBudgets.find(b => b.category === category);
            if (budget) {
                const spent = allTransactions
                    .filter(t => t.category === category && t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                if (spent > budget.limit) {
                    showBudgetAlert(category, spent, budget.limit);
                }
            }
        }
    } catch (err) {
        showNotification('Failed to add transaction', 'error');
    }
});

function showBudgetAlert(category, spent, limit) {
    const modal = document.getElementById('budgetAlertModal');
    const message = document.getElementById('budgetAlertMessage');
    const details = document.getElementById('budgetAlertDetails');

    message.textContent = `You've exceeded your ${category} budget!`;
    details.textContent = `Spent: ₹${spent.toFixed(2)} / Limit: ₹${limit.toFixed(2)}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeBudgetAlert() {
    const modal = document.getElementById('budgetAlertModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = { name: document.getElementById('catName').value };
    try {
        const res = await fetch('/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        await res.json();
        categoryForm.reset();
        await loadCategories();
        showNotification('Category added successfully', 'success');
    } catch (err) {
        showNotification('Failed to add category', 'error');
    }
});

budgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        category: document.getElementById('budgetCategory').value,
        limit: parseFloat(document.getElementById('budgetLimit').value),
        period: document.getElementById('budgetPeriod').value
    };
    try {
        const res = await fetch('/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.error || 'Failed to add budget');
        }

        budgetForm.reset();
        await loadBudgets();
        showNotification('Budget added successfully', 'success');
    } catch (err) {
        showNotification(err.message, 'error');
    }
});

async function loadTransactions() {
    try {
        const res = await fetch('/transactions');
        allTransactions = await res.json();
        renderTransactions();
        renderBudgets();
    } catch (err) {
        console.error(err);
    }
}

function renderTransactions() {
    const container = document.getElementById('allTransactions');
    if (allTransactions.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500"><i class="lni lni-empty-file text-4xl mb-2"></i><p>No transactions yet</p></div>';
        return;
    }

    const html = allTransactions.map((t, index) => `
        <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.05}s">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-10 h-10 rounded-full ${t.type === 'income' ? 'bg-secondary-900/50 text-secondary-500' : 'bg-red-900/50 text-red-500'}">
              <i class="lni ${t.type === 'income' ? 'lni-arrow-up' : 'lni-arrow-down'}"></i>
            </div>
            <div>
              <div class="font-semibold text-customText">${t.description || t.category}</div>
              <div class="text-xs text-gray-400">${new Date(t.date).toLocaleDateString()} • ${t.category} ${t.recurring ? '• <i class="lni lni-reload"></i>' : ''}</div>
            </div>
          </div>
          <div class="font-bold ${t.type === 'income' ? 'text-secondary-500' : 'text-red-500'}">
            ${t.type === 'income' ? '+' : '-'}₹${Math.abs(t.amount).toFixed(2)}
          </div>
        </div>
      `).join('');

    container.innerHTML = html;

    const recent = document.getElementById('recentTransactions');
    const recentTrans = allTransactions.slice(-5).reverse();
    if (recentTrans.length === 0) {
        recent.innerHTML = '<div class="text-center py-8 text-gray-500"><p>No recent transactions</p></div>';
        return;
    }
    recent.innerHTML = recentTrans.map((t, index) => `
        <div class="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded transition-colors">
          <div>
            <div class="font-medium text-customText">${t.description || t.category}</div>
            <div class="text-xs text-gray-500">${new Date(t.date).toLocaleDateString()}</div>
          </div>
          <div class="font-bold ${t.type === 'income' ? 'text-secondary-500' : 'text-red-500'}">
            ${t.type === 'income' ? '+' : '-'}₹${Math.abs(t.amount).toFixed(2)}
          </div>
        </div>
      `).join('');
}

async function loadCategories() {
    try {
        const res = await fetch('/categories');
        allCategories = await res.json();
        renderCategories();
    } catch (err) {
        console.error(err);
    }
}

function renderCategories() {
    const container = document.getElementById('allCategories');
    if (allCategories.length === 0) {
        container.innerHTML = '<div class="text-center py-4 text-gray-500"><p>No categories yet</p></div>';
        return;
    }
    container.innerHTML = allCategories.map(c => `
        <div class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
          <span class="text-customText font-medium">${c.name}</span>
          <span class="bg-secondary-900 text-secondary-300 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
        </div>
      `).join('');

    const catSelect = document.getElementById('category');
    const budgetCatSelect = document.getElementById('budgetCategory');
    const options = '<option value="">Select a category</option>' + allCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    catSelect.innerHTML = options;
    budgetCatSelect.innerHTML = options;
}

async function loadBudgets() {
    try {
        const res = await fetch('/budgets');
        allBudgets = await res.json();
        renderBudgets();
    } catch (err) {
        console.error(err);
    }
}

function renderBudgets() {
    const container = document.getElementById('allBudgets');
    if (allBudgets.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500"><p>No budgets set</p></div>';
        return;
    }
    container.innerHTML = allBudgets.map(b => {
        const spent = allTransactions
            .filter(t => t.category === b.category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const percentage = Math.min((spent / b.limit) * 100, 100);
        let colorClass = 'bg-secondary-500';
        if (percentage > 70) colorClass = 'bg-yellow-500';
        if (percentage > 90) colorClass = 'bg-red-500';

        return `
          <div class="p-6 bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-customText">${b.category}</h3>
              <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-700 text-gray-300 uppercase">${b.period}</span>
            </div>
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-400">Spent</span>
              <span class="text-sm font-medium text-customText">₹${spent.toFixed(2)} / ₹${b.limit.toFixed(2)}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2.5">
              <div class="${colorClass} h-2.5 rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
    }).join('');
}

async function loadDashboard() {
    try {
        const res = await fetch('/reports/monthly');
        const data = await res.json();

        document.getElementById('income').textContent = `₹${data.income.toFixed(2)}`;
        document.getElementById('expenses').textContent = `₹${data.expenses.toFixed(2)}`;

        const balance = data.income - data.expenses;
        document.getElementById('balance').textContent = `₹${balance.toFixed(2)}`;

        const arrowEl = document.getElementById('balanceArrow');
        if (balance >= 0) {
            arrowEl.innerHTML = '<i class="lni lni-arrow-up text-secondary-500"></i>';
        } else {
            arrowEl.innerHTML = '<i class="lni lni-arrow-down text-red-500"></i>';
        }

        const labels = Object.keys(data.byCategory);
        const values = Object.values(data.byCategory);
        const colors = ['#BA875C', '#596B5F', '#A67650', '#46554b', '#845638', '#38443c', '#D1CAC2', '#6b7280'];

        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#9ca3af',
                            font: { family: 'Nunito Sans' },
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                cutout: '70%'
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function loadReports() {
    try {
        const res = await fetch('/reports/monthly');
        const data = await res.json();

        if (monthlyChart) monthlyChart.destroy();
        monthlyChart = new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(data.byCategory),
                datasets: [{
                    label: 'Spending by Category',
                    data: Object.values(data.byCategory),
                    backgroundColor: '#BA875C',
                    borderRadius: 4,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: '#374151' },
                        ticks: { color: '#9ca3af' },
                        beginAtZero: true
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#9ca3af' }
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-secondary-600' : 'bg-red-600';
    const icon = type === 'success' ? 'lni-checkmark-circle' : 'lni-close';

    notification.className = `fixed top-5 right-5 flex items-center w-full max-w-xs p-4 space-x-4 text-white ${bgColor} rounded-lg shadow dark:text-gray-400 space-x z-50 animate__animated animate__fadeInRight`;
    notification.innerHTML = `
        <i class="lni ${icon} text-2xl"></i>
        <div class="ps-3 text-sm font-normal">${message}</div>
      `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.remove('animate__fadeInRight');
        notification.classList.add('animate__fadeOutRight');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

loadTransactions();
loadCategories();
loadBudgets();
loadDashboard();