"use client";

import { useState, useMemo } from "react";
import { useData } from "../context/DataContext";

export default function TransactionList() {
  const { transactions, accounts, categories } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Memoize filtered transactions for performance
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.transactionDate);
        return (
          transactionDate.getMonth() === currentMonth.getMonth() &&
          transactionDate.getFullYear() === currentMonth.getFullYear()
        );
      })
      .sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      );
  }, [transactions, currentMonth]);

  // --- Helper Functions ---
  const getAccountName = (id: string) =>
    accounts.find((a) => a.id === id)?.name || "N/A";
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "N/A";

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      {/* --- Month Navigation --- */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          &lt; Prev
        </button>
        <h2 className="text-2xl font-bold">
          {currentMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Next &gt;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* ... table headers ... */}
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => {
                const category = categories.find(
                  (c) => c.id === txn.categoryId
                );
                const isExpense = category?.type === "expense";
                return (
                  <tr key={txn.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {txn.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(txn.transactionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(txn.categoryId)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                        isExpense ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isExpense ? "-" : "+"} Rp{" "}
                      {txn.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  No transactions for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
