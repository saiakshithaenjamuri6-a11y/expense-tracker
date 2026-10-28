import React from 'react';
import { Plus, WalletCards, Database } from 'lucide-react';

export default function Navbar({ onOpenAddModal, dbConnected }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <WalletCards size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="brand-title">ExpenseTracker</h1>
            <p className="brand-tagline">Personal Finance & Budget Dashboard</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* DB Status indicator */}
          <div
            className={`db-status-pill ${dbConnected ? 'online' : 'offline'}`}
            title={dbConnected ? 'MongoDB Connected' : 'MongoDB Offline / Disconnected'}
          >
            <span className={`status-dot ${dbConnected ? 'online' : 'offline'}`} />
            <span>{dbConnected ? 'Database Connected' : 'DB Disconnected'}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
            id="add-expense-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
}
