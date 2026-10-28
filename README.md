# Expense Tracker — Personal Finance Dashboard

A clean, modern, full-stack Expense Tracker web application built with **React**, **Node.js**, **Express.js**, and **MongoDB**. Developed as a Week 1 Internship Project adhering to clean code standards, modular architecture, responsive design, and robust API validation.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture & Structure](#project-architecture--structure)
- [Prerequisites](#prerequisites)
- [Getting Started & Installation](#getting-started--installation)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. MongoDB Setup (Local or Atlas)](#3-mongodb-setup-local-or-atlas)
  - [4. Install Dependencies](#4-install-dependencies)
  - [5. Seed Sample Data (Optional)](#5-seed-sample-data-optional)
  - [6. Start Backend & Frontend](#6-start-backend--frontend)
- [API Documentation](#api-documentation)
- [Automated Testing](#automated-testing)
- [Submission Screenshots Guide](#submission-screenshots-guide)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Overview

Managing personal expenses should be fast, reliable, and intuitive. This Expense Tracker provides a real-time financial dashboard where users can record, track, categorize, search, edit, and delete their daily expenditures. All calculations (total expenses, transaction counts, category distributions, and highest-spending categories) are computed directly from database records and formatted in Indian Rupees (**₹ INR**).

---

## Key Features

- **Executive Metric Cards**: Real-time display of:
  - **Total Expenses** formatted in Indian Rupees (`₹`).
  - **Transaction Count** with automatic updates on additions or deletions.
  - **Top Spending Category** with amount and percentage share.
  - **Average Expense per Transaction**.
- **Category-Wise Breakdown & Visual Chart**:
  - Multi-color segmented distribution bar.
  - Percentage progress bars and totals for each category: *Food, Travel, Shopping, Bills, Education, Healthcare, Entertainment, Other*.
- **Full CRUD Management**:
  - **Add Expense**: Modal form with strict frontend and backend validation.
  - **Edit Expense**: Prefilled modal enabling seamless record updates.
  - **Delete Expense**: Modal confirmation preventing accidental loss of data.
- **Search & Category Filtering**:
  - Real-time search filter by expense title.
  - Category dropdown filter.
  - Dedicated **Filtered Total** badge so filtering does not confuse overall database totals.
- **Resilient Error & Connection Handling**:
  - Live MongoDB connection health monitoring pill in header.
  - Informative banner when the database or server is offline with instant retry.
  - Toast notification system with auto-dismissal.

---

## Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18 + Vite | Blazing fast client with modern functional components & hooks |
| **Styling** | Modern CSS (CSS Variables) | Clean, accessible design system responsive on desktop, tablet & mobile |
| **Icons** | Lucide React | Minimal, crisp SVG iconography |
| **Backend** | Node.js + Express.js | Scalable REST API with centralized error handling & validation |
| **Database** | MongoDB + Mongoose | Schema validation, indexed queries, and aggregation pipelines |
| **Testing** | Node.js Test Runner + Supertest | Native unit and API integration test suite |

---

## Project Architecture & Structure

```
expense-tracker/
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── components/          # Modular React Components
│   │   │   ├── CategoryChart.jsx     # Category breakdown & progress bars
│   │   │   ├── DeleteModal.jsx       # Confirmation dialog for deletions
│   │   │   ├── ExpenseModal.jsx      # Add & Edit expense form dialog
│   │   │   ├── ExpenseTable.jsx      # Responsive table with actions
│   │   │   ├── FilterBar.jsx         # Search and category filters
│   │   │   ├── Navbar.jsx            # Header & live DB health indicator
│   │   │   ├── SummaryCards.jsx      # Top 4 analytical metric cards
│   │   │   └── Toast.jsx             # Notification toasts
│   │   ├── services/
│   │   │   └── api.js                # Fetch API client wrapper
│   │   ├── utils/
│   │   │   └── formatters.js         # Indian Rupee (₹) & date utilities
│   │   ├── App.jsx                   # Central state management
│   │   ├── index.css                 # CSS Design System
│   │   └── main.jsx                  # React DOM mount point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express REST API Backend
│   ├── config/
│   │   └── db.js                     # Mongoose connection & event listeners
│   ├── controllers/
│   │   └── expenseController.js      # CRUD handlers & aggregation pipelines
│   ├── middleware/
│   │   ├── errorHandler.js           # 404 & centralized error interceptors
│   │   └── validateExpense.js        # Input validation & sanitization
│   ├── models/
│   │   └── Expense.js                # Mongoose schema & category definitions
│   ├── routes/
│   │   └── expenseRoutes.js          # REST routing table
│   ├── tests/
│   │   ├── controller.test.js        # Controller calculation unit tests
│   │   └── expense.test.js           # Middleware & routing tests
│   ├── seed.js                       # Sample data generation script
│   ├── server.js                     # Express app setup & listener
│   └── package.json
├── screenshots/                 # Application screenshots for HR submission
│   └── README.md
├── .env.example                 # Environment variables blueprint
├── .gitignore                   # Ignores node_modules, env files, dist
├── package.json                 # Monorepo convenience scripts
└── README.md                    # Comprehensive documentation
```

---

## Prerequisites

Before running the application locally, ensure you have:

- **Node.js**: v18.0.0 or later (`node -v`)
- **npm**: v9.0.0 or later (`npm -v`)
- **MongoDB**: Either a local MongoDB Community instance (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

---

## Getting Started & Installation

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd "expense tracker"
```

### 2. Environment Configuration

Copy the `.env.example` file to create your `.env` in the root and in `server/`:

```bash
# On Windows PowerShell:
cp .env.example .env
cp .env.example server/.env
```

Your `server/.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/expense-tracker
```

### 3. MongoDB Setup (Local or Atlas)

#### Option A: Local MongoDB Community Server
If you have MongoDB installed locally:
```powershell
# Start MongoDB service on Windows
net start MongoDB
# Or run mongod directly
mongod --dbpath="C:\data\db"
```
The connection string will be: `mongodb://127.0.0.1:27017/expense-tracker`.

#### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Cluster**.
3. Under **Security > Database Access**, create a user with a password.
4. Under **Security > Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect > Drivers > Node.js** and copy your connection string.
6. Paste it into `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

### 4. Install Dependencies

You can install all dependencies from the root directory:
```bash
npm run install:all
```

Or install them separately:
```bash
cd server && npm install
cd ../client && npm install
```

### 5. Seed Sample Data (Optional)

To populate the database with realistic sample records for demonstration or screenshots:
```bash
# From root:
npm run seed

# To wipe the sample data anytime:
npm run seed:clear
```

### 6. Start Backend & Frontend

Open two terminal windows:

**Terminal 1 — Backend API Server:**
```bash
cd server
npm run dev
```
*Backend will start on `http://localhost:5000`.*

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
```
*Frontend will start on `http://localhost:5173`.*

Open `http://localhost:5173` in your browser.

---

## API Documentation

All API responses follow a uniform JSON structure.

### Base URL
`http://localhost:5000/api`

### Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/health` | Server and database connection diagnostics | `200`, `503` |
| `GET` | `/expenses` | Retrieve all expenses (supports `?category=...&search=...`) | `200`, `500` |
| `GET` | `/expenses/summary` | Aggregate totals, count, top category & category breakdown | `200`, `500` |
| `GET` | `/expenses/categories` | List predefined categories | `200` |
| `GET` | `/expenses/:id` | Retrieve single expense by ID | `200`, `400`, `404` |
| `POST` | `/expenses` | Create a new expense | `201`, `400`, `500` |
| `PUT` | `/expenses/:id` | Update an existing expense by ID | `200`, `400`, `404` |
| `DELETE`| `/expenses/:id` | Delete an expense by ID | `200`, `400`, `404` |

### Sample Payload for `POST /api/expenses`
```json
{
  "title": "Grocery shopping at DMart",
  "amount": 3450.50,
  "category": "Food",
  "date": "2026-10-24"
}
```

### Sample Response from `GET /api/expenses/summary`
```json
{
  "success": true,
  "data": {
    "totalAmount": 12568.5,
    "transactionCount": 8,
    "highestCategory": {
      "category": "Food",
      "total": 3450.5,
      "count": 1,
      "percentage": 27.5
    },
    "categorySummary": [
      {
        "category": "Food",
        "total": 3450.5,
        "count": 1,
        "percentage": 27.5
      },
      {
        "category": "Shopping",
        "total": 2899.0,
        "count": 1,
        "percentage": 23.1
      }
    ]
  }
}
```

---

## Automated Testing

The project includes unit and integration tests using Node's native test runner (`node:test`) and `supertest`:

```bash
# Run tests from root:
npm test

# Or inside server directory:
cd server
npm test
```

### Test Coverage Highlights:
- **Middleware & Routing**: Health diagnostics, 404 interceptors, root API info.
- **Input Validation**: Required fields, negative amounts, string sanitization, category enums, invalid date formats.
- **Calculations & Aggregations**: Empty database handling (zeros), highest-spending category logic, category percentage calculations, floating-point safety.

---

## Submission Screenshots Guide

Capture the following 6 screenshots for your Week 1 internship report:

1. **Main Dashboard**: Open `http://localhost:5173`. Shows the 4 summary cards (Total Expenses in ₹, Transactions, Top Category, Avg Expense).
2. **Expense Table**: Scroll to the transaction list showing dates, category badges, amounts, and actions.
3. **Add Expense Modal**: Click **+ Add Expense** to capture the input form.
4. **Edit Expense Modal**: Click the pencil icon on any item to show the prefilled values.
5. **Category Summary Chart**: Capture the **Category Breakdown** card showing the proportional multi-color segmented bar and category progress bars.
6. **Post-Delete Dashboard**: Delete an expense and capture the updated dashboard with automatically recalculated totals.

---

## Troubleshooting & FAQ

#### 1. "Database is not connected" or red "DB Disconnected" badge
- **Cause**: MongoDB is not running or the connection string is incorrect.
- **Fix**: Check `server/.env`. If using local MongoDB, ensure `net start MongoDB` or `mongod` is running. If using MongoDB Atlas, check your network whitelist (allow `0.0.0.0/0`).

#### 2. Port 5000 is already in use
- **Fix**: Change `PORT=5001` in `server/.env` and update `VITE_API_BASE_URL=http://localhost:5001/api` in `client/.env`.

#### 3. Frontend cannot communicate with Backend
- **Fix**: Verify Vite proxy settings in `client/vite.config.js` or check that both servers are running.

---

## License

This project is submitted for the Week 1 Internship Assessment. Created with clean code principles for educational and professional evaluation.
