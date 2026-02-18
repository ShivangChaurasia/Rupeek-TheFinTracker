import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '../components/Button';
import AddTransactionModal from '../components/AddTransactionModal';
import { format } from 'date-fns';

import SalaryPrompt from '../components/SalaryPrompt';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth(); // We might need user preferences like currency later
  const { transactions, totalBalance, loading } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addTransaction } = useTransactions();

  // Calculate totals
  const summary = transactions.reduce((acc, curr) => {
    const amount = parseFloat(curr.amount);
    if (curr.type === 'income') {
      acc.income += amount;
      acc.balance += amount;
    } else {
      acc.expense += amount;
      acc.balance -= amount;
    }
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {userProfile?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your finances for this month
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Balance</h3>
            <div className="bg-primary/10 p-2 rounded-full">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {totalBalance >= 0 ? '+' : '-'}{'₹'}{Math.abs(totalBalance).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All-time balance
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Income</h3>
            <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/30">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            +{'₹'}{summary.income.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total earnings this month
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Expenses</h3>
            <div className="bg-red-100 p-2 rounded-full dark:bg-red-900/30">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            -{'₹'}{summary.expense.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total spending this month
          </p>
        </div>
      </div>

      {/* Budget Overview */}
      {userProfile?.monthlyIncome && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Budget Overview</h3>
            <span className="text-sm text-muted-foreground">
              Monthly Income: {userProfile.currency}{userProfile.monthlyIncome.toLocaleString()}
            </span>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Expenses</span>
                <span className="font-medium">{Math.round((summary.expense / userProfile.monthlyIncome) * 100)}% Used</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${Math.min((summary.expense / userProfile.monthlyIncome) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Remaining Budget</span>
              <span className={`font-bold ${(userProfile.monthlyIncome - summary.expense) < 0 ? 'text-red-500' : 'text-green-600'
                }`}>
                {userProfile.currency}{(userProfile.monthlyIncome - summary.expense).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Transactions</h2>
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <div className="bg-muted p-3 rounded-full">
                <Wallet className="w-6 h-6 text-muted-foreground" />
              </div>
              <p>No transactions found for this month.</p>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                Add your first transaction
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'income'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {transaction.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{transaction.category}</p>
                      <p className="text-xs text-muted-foreground">{format(transaction.date, 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                    }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
      />
      <SalaryPrompt />
    </div>
  );
}