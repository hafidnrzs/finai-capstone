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
          new Date(a.transactionDate).getTime(),
      );
  }, [transactions, currentMonth]);

  // --- Helper Functions ---
  const getAccountName = (id: string) =>
    accounts.find((a) => a.id === id)?.name || "N/A";
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "N/A";

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      {/* --- Month Navigation --- */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          &lt; Sebelumnya
        </button>
        <h2 className="text-2xl font-bold">
          {currentMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={goToNextMonth}
          className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Berikutnya &gt;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* ... table headers ... */}
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Deskripsi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Kategori
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => {
                const category = categories.find(
                  (c) => c.id === txn.categoryId,
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
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {getCategoryName(txn.categoryId)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right text-sm font-semibold whitespace-nowrap ${
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
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  Tidak ada transaksi untuk bulan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
