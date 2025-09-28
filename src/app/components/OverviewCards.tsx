"use client";

import { useMemo } from "react";
import { useData } from "../context/DataContext";

export default function OverviewCards() {
  const { transactions, categories } = useData();

  // Calculate stats for the CURRENT month
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const relevantTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.transactionDate);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const txn of relevantTransactions) {
      const category = categories.find((c) => c.id === txn.categoryId);
      if (category?.type === "income") {
        totalIncome += txn.amount;
      } else if (category?.type === "expense") {
        totalExpenses += txn.amount;
      }
    }

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }, [transactions, categories]);

  const formatCurrency = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Income Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">
          This Month's Income
        </h3>
        <p className="mt-2 text-3xl font-bold text-green-600">
          {formatCurrency(monthlyStats.totalIncome)}
        </p>
      </div>
      {/* Expenses Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">
          This Month's Expenses
        </h3>
        <p className="mt-2 text-3xl font-bold text-red-600">
          {formatCurrency(monthlyStats.totalExpenses)}
        </p>
      </div>
      {/* Balance Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Net Balance</h3>
        <p
          className={`mt-2 text-3xl font-bold ${
            monthlyStats.netBalance >= 0 ? "text-gray-800" : "text-red-600"
          }`}
        >
          {formatCurrency(monthlyStats.netBalance)}
        </p>
      </div>
    </div>
  );
}
