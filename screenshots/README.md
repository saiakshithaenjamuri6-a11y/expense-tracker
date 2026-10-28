# Application Screenshots for Internship Submission

This directory is prepared for your Week 1 internship submission screenshots.

## Required Screenshots Checklist

| File Name | Description | Step to Capture |
|---|---|---|
| `01-dashboard-summary.png` | Main dashboard with summary cards | Open `http://localhost:5173` after adding expenses or running `npm run seed`. Capture the top metric cards. |
| `02-expense-table.png` | Expense table containing multiple saved transactions | Scroll to the **Transactions & Records** table showing titles, category badges, dates, amounts in ₹, and action buttons. |
| `03-add-expense-modal.png` | Add expense form modal | Click the **+ Add Expense** button in the header. Capture the modal with the Title, Amount, Category, and Date fields. |
| `04-edit-expense-modal.png` | Edit expense form prefilled | Click the pencil (edit) icon next to any transaction. Capture the modal prefilled with the transaction's existing data. |
| `05-category-summary.png` | Category-wise expense summary & charts | Focus on the **Category Breakdown** card showing the multi-color proportional bar and category progress rows with percentages and totals in ₹. |
| `06-post-delete-dashboard.png` | Updated dashboard after expense deletion | Click the trash icon on an expense, confirm deletion in the confirmation modal, and capture the recalculated totals and table. |

## Quick Seed Data for Screenshots

To instantly populate the database with realistic sample transactions for your screenshots:
```bash
npm run seed
```

To reset the database after capturing screenshots:
```bash
npm run seed:clear
```
