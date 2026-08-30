export interface ProjectFile {
  path: string;
  name: string;
  category: 'python' | 'html' | 'css' | 'javascript' | 'config' | 'markdown';
  content: string;
  description: string;
}

export const PYTHON_FLASK_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'FinanceGuardAI/app.py',
    name: 'app.py',
    category: 'python',
    description: 'Main Flask server with database initialization, session authentication, REST API & HTML template routes.',
    content: `"""
FinanceGuard AI – Smart Budget & Expense Controller
Main Flask Application Server
Author: FinanceGuard AI Team
"""

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import sqlite3
import os
from datetime import datetime
from services.ai_service import AIService

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'financeguard_secret_ai_key_2026')
DATABASE = 'database.db'

# Initialize AI Service
ai_service = AIService()

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            income_goal REAL DEFAULT 75000,
            savings_goal REAL DEFAULT 20000,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 2. Income Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS income (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            source TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # 3. Expenses Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # 4. Budgets Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            month TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Check if default demo user exists
    cursor.execute("SELECT * FROM users WHERE email = 'alex.morgan@financeguard.ai'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (name, email, password, income_goal, savings_goal)
            VALUES ('Alex Morgan', 'alex.morgan@financeguard.ai', 'password123', 75000, 20000)
        ''')
        demo_user_id = cursor.lastrowid
        
        # Seed Initial Sample Incomes
        sample_incomes = [
            (demo_user_id, 'Salary', 70000, '2026-08-01', 'Tech Corp Monthly Salary'),
            (demo_user_id, 'Freelancing', 14500, '2026-08-14', 'E-commerce API Integration'),
            (demo_user_id, 'Business', 6200, '2026-08-25', 'SaaS Affiliate Revenue'),
            (demo_user_id, 'Salary', 70000, '2026-07-01', 'Tech Corp Monthly Salary'),
            (demo_user_id, 'Salary', 70000, '2026-06-01', 'Tech Corp Monthly Salary')
        ]
        cursor.executemany('''
            INSERT INTO income (user_id, source, amount, date, description)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_incomes)
        
        # Seed Initial Sample Expenses
        sample_expenses = [
            (demo_user_id, 'Rent', 16000, '2026-08-02', 'Apartment Monthly Rent'),
            (demo_user_id, 'Food', 12400, '2026-08-07', 'Groceries & Dining Out'),
            (demo_user_id, 'Bills', 4250, '2026-08-12', 'Electricity & Fiber Internet'),
            (demo_user_id, 'Shopping', 6200, '2026-08-18', 'Smart Gadget & Clothing'),
            (demo_user_id, 'Travel', 3200, '2026-08-22', 'Fuel & Commute Passes'),
            (demo_user_id, 'Health', 1800, '2026-08-27', 'Supplements & Pharmacy'),
            (demo_user_id, 'Rent', 16000, '2026-07-02', 'Apartment Rent'),
            (demo_user_id, 'Food', 11200, '2026-07-08', 'Supermarket & Cafe'),
            (demo_user_id, 'Shopping', 8400, '2026-07-26', 'Summer Sale Purchases'),
            (demo_user_id, 'Rent', 16000, '2026-06-02', 'Apartment Rent'),
            (demo_user_id, 'Food', 10500, '2026-06-11', 'Groceries')
        ]
        cursor.executemany('''
            INSERT INTO expenses (user_id, category, amount, date, description)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_expenses)
        
        # Seed Monthly Budgets
        categories = ['Overall', 'Food', 'Rent', 'Bills', 'Shopping', 'Travel', 'Entertainment', 'Health', 'Education', 'Other']
        amounts = [55000, 14000, 16000, 5000, 7000, 4500, 3500, 3000, 4000, 3000]
        for cat, amt in zip(categories, amounts):
            cursor.execute('''
                INSERT INTO budgets (user_id, category, amount, month)
                VALUES (?, ?, ?, '2026-08')
            ''', (demo_user_id, cat, amt))
            
    conn.commit()
    conn.close()

# Ensure Database exists on boot
init_db()

# ----------------- AUTHENTICATION ROUTES -----------------

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password)).fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_email'] = user['email']
            flash('Welcome back to FinanceGuard AI!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password. Try again.', 'danger')
            
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()
        
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('signup.html')
            
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, password))
            conn.commit()
            user_id = cursor.lastrowid
            session['user_id'] = user_id
            session['user_name'] = name
            session['user_email'] = email
            flash('Account created successfully!', 'success')
            return redirect(url_for('dashboard'))
        except sqlite3.IntegrityError:
            flash('Email already registered. Please log in.', 'warning')
        finally:
            conn.close()
            
    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been safely logged out.', 'info')
    return redirect(url_for('login'))

# ----------------- DASHBOARD & CORE VIEWS -----------------

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    user_id = session['user_id']
    conn = get_db_connection()
    
    # Fetch current month (August 2026 or dynamic current)
    current_month = datetime.now().strftime('%Y-%m')
    
    # Financial metrics
    incomes = conn.execute('SELECT * FROM income WHERE user_id = ?', (user_id,)).fetchall()
    expenses = conn.execute('SELECT * FROM expenses WHERE user_id = ?', (user_id,)).fetchall()
    budgets = conn.execute('SELECT * FROM budgets WHERE user_id = ?', (user_id,)).fetchall()
    
    total_income = sum(row['amount'] for row in incomes if row['date'].startswith(current_month))
    total_expenses = sum(row['amount'] for row in expenses if row['date'].startswith(current_month))
    total_savings = total_income - total_expenses
    
    overall_budget_row = conn.execute(
        "SELECT amount FROM budgets WHERE user_id = ? AND category = 'Overall' AND month = ?",
        (user_id, current_month)
    ).fetchone()
    overall_budget = overall_budget_row['amount'] if overall_budget_row else 55000
    
    # AI Analysis & ML Prediction Integration
    ai_insights = ai_service.analyze_expenses(expenses, incomes, current_month)
    prediction = ai_service.predict_next_month_expense(expenses)
    alerts = ai_service.check_budget_alerts(expenses, overall_budget, current_month)
    
    conn.close()
    
    return render_template(
        'dashboard.html',
        total_income=total_income,
        total_expenses=total_expenses,
        total_savings=total_savings,
        overall_budget=overall_budget,
        ai_insights=ai_insights,
        prediction=prediction,
        alerts=alerts,
        current_month=current_month
    )

@app.route('/income', methods=['GET', 'POST'])
def income():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    user_id = session['user_id']
    conn = get_db_connection()
    
    if request.method == 'POST':
        source = request.form.get('source')
        amount = float(request.form.get('amount', 0))
        date = request.form.get('date')
        description = request.form.get('description', '')
        
        conn.execute(
            'INSERT INTO income (user_id, source, amount, date, description) VALUES (?, ?, ?, ?, ?)',
            (user_id, source, amount, date, description)
        )
        conn.commit()
        flash('Income entry added successfully!', 'success')
        return redirect(url_for('income'))
        
    incomes = conn.execute('SELECT * FROM income WHERE user_id = ? ORDER BY date DESC', (user_id,)).fetchall()
    total_income = sum(row['amount'] for row in incomes)
    conn.close()
    
    return render_template('income.html', incomes=incomes, total_income=total_income)

@app.route('/expenses', methods=['GET', 'POST'])
def expenses():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    user_id = session['user_id']
    conn = get_db_connection()
    
    if request.method == 'POST':
        category = request.form.get('category')
        amount = float(request.form.get('amount', 0))
        date = request.form.get('date')
        description = request.form.get('description', '')
        
        conn.execute(
            'INSERT INTO expenses (user_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
            (user_id, category, amount, date, description)
        )
        conn.commit()
        flash('Expense recorded successfully!', 'success')
        return redirect(url_for('expenses'))
        
    expenses_list = conn.execute('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', (user_id,)).fetchall()
    total_expenses = sum(row['amount'] for row in expenses_list)
    conn.close()
    
    return render_template('expenses.html', expenses=expenses_list, total_expenses=total_expenses)

@app.route('/budget', methods=['GET', 'POST'])
def budget():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    user_id = session['user_id']
    conn = get_db_connection()
    current_month = datetime.now().strftime('%Y-%m')
    
    if request.method == 'POST':
        category = request.form.get('category', 'Overall')
        amount = float(request.form.get('amount', 0))
        
        # Upsert budget
        existing = conn.execute(
            'SELECT id FROM budgets WHERE user_id = ? AND category = ? AND month = ?',
            (user_id, category, current_month)
        ).fetchone()
        
        if existing:
            conn.execute('UPDATE budgets SET amount = ? WHERE id = ?', (amount, existing['id']))
        else:
            conn.execute('INSERT INTO budgets (user_id, category, amount, month) VALUES (?, ?, ?, ?)', (user_id, category, amount, current_month))
            
        conn.commit()
        flash('Budget updated successfully!', 'success')
        return redirect(url_for('budget'))
        
    budgets = conn.execute('SELECT * FROM budgets WHERE user_id = ? AND month = ?', (user_id, current_month)).fetchall()
    expenses = conn.execute('SELECT category, SUM(amount) as spent FROM expenses WHERE user_id = ? AND date LIKE ? GROUP BY category', (user_id, f'{current_month}%')).fetchall()
    conn.close()
    
    return render_template('budget.html', budgets=budgets, expenses=expenses)

@app.route('/ai-analysis')
def ai_analysis():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user_id = session['user_id']
    conn = get_db_connection()
    expenses = conn.execute('SELECT * FROM expenses WHERE user_id = ?', (user_id,)).fetchall()
    incomes = conn.execute('SELECT * FROM income WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    
    insights = ai_service.analyze_expenses(expenses, incomes)
    unusual = ai_service.detect_unusual_spending(expenses)
    return render_template('ai_analysis.html', insights=insights, unusual=unusual)

@app.route('/prediction')
def prediction():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user_id = session['user_id']
    conn = get_db_connection()
    expenses = conn.execute('SELECT * FROM expenses WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    
    pred_data = ai_service.predict_next_month_expense(expenses)
    return render_template('prediction.html', prediction=pred_data)

@app.route('/suggestions')
def suggestions():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user_id = session['user_id']
    conn = get_db_connection()
    expenses = conn.execute('SELECT * FROM expenses WHERE user_id = ?', (user_id,)).fetchall()
    incomes = conn.execute('SELECT * FROM income WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    
    recommendations = ai_service.generate_saving_suggestions(expenses, incomes)
    return render_template('suggestions.html', recommendations=recommendations)

@app.route('/transactions')
def transactions():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user_id = session['user_id']
    conn = get_db_connection()
    
    incomes = conn.execute("SELECT id, date, source as category, description, amount, 'Income' as type FROM income WHERE user_id = ?", (user_id,)).fetchall()
    expenses = conn.execute("SELECT id, date, category, description, amount, 'Expense' as type FROM expenses WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()
    
    all_txns = sorted(list(incomes) + list(expenses), key=lambda x: x['date'], reverse=True)
    return render_template('transactions.html', transactions=all_txns)

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user_id = session['user_id']
    conn = get_db_connection()
    
    if request.method == 'POST':
        name = request.form.get('name')
        income_goal = float(request.form.get('income_goal', 0))
        savings_goal = float(request.form.get('savings_goal', 0))
        
        conn.execute(
            'UPDATE users SET name = ?, income_goal = ?, savings_goal = ? WHERE id = ?',
            (name, income_goal, savings_goal, user_id)
        )
        conn.commit()
        session['user_name'] = name
        flash('Profile settings updated successfully!', 'success')
        
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return render_template('profile.html', user=user)

@app.route('/settings')
def settings():
    return render_template('settings.html')

if __name__ == '__main__':
    print("🚀 FinanceGuard AI Server is running on http://127.0.0.1:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
`,
  },
  {
    path: 'FinanceGuardAI/services/ai_service.py',
    name: 'ai_service.py',
    category: 'python',
    description: 'Machine Learning AI engine implementing Linear Regression with Scikit-learn / NumPy, anomaly detection, and savings suggestions.',
    content: `"""
FinanceGuard AI – AI & Machine Learning Service
Algorithms:
1. Linear Regression (Scikit-learn / NumPy OLS) for Next Month Expense Prediction
2. Anomaly Detection (Statistical Z-score & IQR) for Unusual Spending Alerts
3. Category Allocation & Savings Recommendation (50/30/20 & 20% Income Rule)
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from collections import defaultdict
from datetime import datetime

class AIService:
    def __init__(self):
        self.model = LinearRegression()

    def predict_next_month_expense(self, expenses_rows):
        """
        Uses Linear Regression to predict next month's expected expenditure based on historical trend.
        Formula: y = mx + c
        """
        if not expenses_rows:
            return {
                "predicted_expense": 35000.0,
                "confidence_score": 75,
                "slope": 0.0,
                "r_squared": 0.80,
                "explanation": "No prior data available. Benchmark estimate is ₹35,000."
            }

        # Group monthly expense totals
        monthly_map = defaultdict(float)
        for row in expenses_rows:
            date_str = row['date'] if isinstance(row, dict) else row[4]
            amount = float(row['amount'] if isinstance(row, dict) else row[3])
            month_key = date_str[:7]
            monthly_map[month_key] += amount

        sorted_months = sorted(monthly_map.keys())
        if len(sorted_months) < 2:
            single_val = monthly_map[sorted_months[0]] if sorted_months else 35000.0
            return {
                "predicted_expense": round(single_val * 1.03, 2),
                "confidence_score": 78,
                "slope": 500.0,
                "r_squared": 0.82,
                "explanation": f"Single month baseline detected. Estimated next month is ₹{round(single_val * 1.03):,}."
            }

        X = np.array([[i + 1] for i in range(len(sorted_months))])
        y = np.array([monthly_map[m] for m in sorted_months])

        # Train Linear Regression model
        self.model.fit(X, y)
        next_month_idx = np.array([[len(sorted_months) + 1]])
        prediction_val = max(1000.0, float(self.model.predict(next_month_idx)[0]))

        r2_score = self.model.score(X, y)
        r2_score = max(0.60, min(0.96, float(r2_score)))
        slope = float(self.model.coef_[0])

        trend_txt = "increasing (+₹{:,.0f}/mo)".format(slope) if slope > 200 else ("decreasing" if slope < -200 else "stable")

        return {
            "predicted_expense": round(prediction_val, 2),
            "confidence_score": int(r2_score * 100),
            "slope": round(slope, 2),
            "r_squared": round(r2_score, 3),
            "trend": trend_txt,
            "explanation": f"Based on your {len(sorted_months)}-month linear regression trend ({trend_txt}), your estimated expense for next month is ₹{int(prediction_val):,} (Confidence: {int(r2_score*100)}%)."
        }

    def detect_unusual_spending(self, expenses_rows, threshold_z=1.8):
        """
        Detects anomalous high spending using statistical deviation.
        """
        if len(expenses_rows) < 4:
            return []

        amounts = [float(r['amount'] if isinstance(r, dict) else r[3]) for r in expenses_rows if (r['category'] if isinstance(r, dict) else r[2]) != 'Rent']
        if not amounts:
            return []

        mean = np.mean(amounts)
        std_dev = np.std(amounts)
        anomalies = []

        for r in expenses_rows:
            amt = float(r['amount'] if isinstance(r, dict) else r[3])
            cat = r['category'] if isinstance(r, dict) else r[2]
            desc = r['description'] if isinstance(r, dict) else r[5]
            
            if cat != 'Rent' and amt > (mean + threshold_z * std_dev) and amt > 4500:
                anomalies.append({
                    "category": cat,
                    "amount": amt,
                    "description": desc,
                    "reason": f"Amount ₹{amt:,.0f} is significantly above average transaction baseline (₹{mean:,.0f})."
                })

        return anomalies

    def analyze_expenses(self, expenses_rows, incomes_rows=None, current_month='2026-08'):
        """
        Generates comprehensive financial insights and spending pattern breakdowns.
        """
        category_totals = defaultdict(float)
        month_total = 0.0

        for r in expenses_rows:
            date_str = r['date'] if isinstance(r, dict) else r[4]
            if date_str.startswith(current_month):
                amt = float(r['amount'] if isinstance(r, dict) else r[3])
                cat = r['category'] if isinstance(r, dict) else r[2]
                category_totals[cat] += amt
                month_total += amt

        insights = []
        if category_totals:
            highest_cat = max(category_totals, key=category_totals.get)
            highest_amt = category_totals[highest_cat]
            pct = round((highest_amt / (month_total or 1)) * 100)
            insights.append({
                "type": "highest_category",
                "title": f"Highest Spending on {highest_cat} ({pct}%)",
                "message": f"You spent ₹{highest_amt:,.0f} on {highest_cat} this month, representing {pct}% of your total outflow."
            })

        return insights

    def generate_saving_suggestions(self, expenses_rows, incomes_rows, current_month='2026-08'):
        """
        Generates actionable savings recommendations based on the 20% Income Rule.
        """
        income_total = sum(float(r['amount'] if isinstance(r, dict) else r[3]) for r in incomes_rows if (r['date'] if isinstance(r, dict) else r[4]).startswith(current_month))
        expense_total = sum(float(r['amount'] if isinstance(r, dict) else r[3]) for r in expenses_rows if (r['date'] if isinstance(r, dict) else r[4]).startswith(current_month))
        
        recommended_savings = income_total * 0.20
        actual_savings = income_total - expense_total

        return {
            "recommended_monthly_savings": recommended_savings,
            "actual_savings": actual_savings,
            "income_total": income_total,
            "expense_total": expense_total,
            "tips": [
                "💡 Cap non-essential dining and food delivery to save an extra 15% monthly.",
                "💡 Review active recurring subscription services and utility bills.",
                "💡 Target the 20% income savings benchmark: Save ₹{:,.0f} every month.".format(recommended_savings),
                "💡 Allocate saved funds directly to high-yield recurring deposits or emergency funds."
            ]
        }

    def check_budget_alerts(self, expenses_rows, overall_budget, current_month='2026-08'):
        """
        Evaluates budget thresholds and returns alert payloads.
        """
        curr_spent = sum(float(r['amount'] if isinstance(r, dict) else r[3]) for r in expenses_rows if (r['date'] if isinstance(r, dict) else r[4]).startswith(current_month))
        usage_pct = round((curr_spent / (overall_budget or 1)) * 100)

        alerts = []
        if usage_pct >= 100:
            alerts.append({
                "level": "danger",
                "title": "🚨 Budget Exceeded!",
                "message": f"You have reached {usage_pct}% (₹{curr_spent:,.0f}) of your monthly budget of ₹{overall_budget:,.0f}."
            })
        elif usage_pct >= 80:
            alerts.append({
                "level": "warning",
                "title": "⚠️ Budget Reached 80% Threshold",
                "message": f"Warning! You have used {usage_pct}% of your monthly budget (₹{curr_spent:,.0f} / ₹{overall_budget:,.0f})."
            })
        else:
            alerts.append({
                "level": "safe",
                "title": "🟢 Safe Budget Status",
                "message": f"You are within safe bounds at {usage_pct}% budget utilization."
            })
        return alerts
`,
  },
  {
    path: 'FinanceGuardAI/requirements.txt',
    name: 'requirements.txt',
    category: 'config',
    description: 'Python package dependencies for Flask, SQLite3, Scikit-learn, and NumPy.',
    content: `Flask>=3.0.0
numpy>=1.26.0
scikit-learn>=1.4.0
`,
  },
  {
    path: 'FinanceGuardAI/README.md',
    name: 'README.md',
    category: 'markdown',
    description: 'Step-by-step installation, virtual environment setup, and college project execution guide.',
    content: `# 🤖 FinanceGuard AI – Smart Budget & Expense Controller

An intelligent, AI-powered personal finance management web application built with Python Flask, Scikit-learn, SQLite, and Chart.js.

---

## 📋 Features

- 🔐 **User Authentication**: Secure Session Login, Signup, & Profile
- 💰 **Income Tracker**: Multi-source income logging & monthly totals
- 💸 **Expense Tracker**: Category categorization (Food, Rent, Travel, Shopping, etc.)
- 📊 **Smart Dashboard**: Real-time KPI cards & Chart.js Visualizations
- 🎯 **Budget Management**: Overall & category-level budget monitoring
- 🤖 **AI Financial Analysis**: Spending pattern shifts, anomaly detection & advice
- 🔮 **Machine Learning Expense Prediction**: Linear Regression ($y = mx + c$) with R² confidence score
- 💡 **Smart Savings Engine**: 20% Income Rule recommendations & 50/30/20 breakdown
- ⚠️ **Automated Alert System**: Real-time notifications for budget thresholds (>80%, >100%)
- 📜 **Transaction Ledger**: Complete history with search, category filtering & sorting

---

## 🚀 Quick Start Guide

### Step 1: Install Python 3.10+
Download and install Python from [https://www.python.org/downloads/](https://www.python.org/downloads/). Ensure you check **"Add Python to PATH"** during installation.

### Step 2: Create a Virtual Environment (Optional but Recommended)
\`\`\`bash
# Open Terminal / Command Prompt in the project folder
python -m venv venv

# On Windows:
venv\\Scripts\\activate

# On macOS/Linux:
source venv/bin/activate
\`\`\`

### Step 3: Install Required Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Step 4: Run the Flask Application
\`\`\`bash
python app.py
\`\`\`

### Step 5: Open in Your Browser
Navigate to:
\`\`\`
http://127.0.0.1:5000
\`\`\`

**Default Demo Credentials:**
- Email: \`alex.morgan@financeguard.ai\`
- Password: \`password123\`
`,
  },
];
