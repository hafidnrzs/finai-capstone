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
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Income Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="text-sm font-medium text-gray-500">
          Pemasukan Bulan Ini
        </h3>
        <p className="mt-2 text-3xl font-bold text-green-600">
          {formatCurrency(monthlyStats.totalIncome)}
        </p>
      </div>
      {/* Expenses Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="text-sm font-medium text-gray-500">
          Pengeluaran Bulan Ini
        </h3>
        <p className="mt-2 text-3xl font-bold text-red-600">
          {formatCurrency(monthlyStats.totalExpenses)}
        </p>
      </div>
      {/* Balance Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Saldo Bersih</h3>
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
