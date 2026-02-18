import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { Calendar as CalendarIcon, ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react';
import Input from '../components/Input';

export default function History() {
    const { transactions, loading } = useTransactions();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [searchTerm, setSearchTerm] = useState('');

    // Filter transactions by selected month and search term
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesMonth = isSameMonth(new Date(t.date), new Date(selectedMonth));
            const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.note?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesMonth && matchesSearch;
        });
    }, [transactions, selectedMonth, searchTerm]);

    // Calculate monthly stats
    const stats = useMemo(() => {
        return filteredTransactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount);
            if (curr.type === 'income') {
                acc.income += amount;
            } else {
                acc.expense += amount;
            }
            return acc;
        }, { income: 0, expense: 0 });
    }, [filteredTransactions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">History</h1>
                    <p className="text-muted-foreground mt-1">
                        View your transaction history by month
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                            +₹{stats.income.toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/30">
                        <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Expense</p>
                        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                            -₹{stats.expense.toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-red-100 p-2 rounded-full dark:bg-red-900/30">
                        <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No transactions found for this month.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${transaction.type === 'income'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {transaction.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{transaction.category}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(transaction.date, 'MMM dd')} • {transaction.note || 'No note'}
                                        </p>
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
    );
}
