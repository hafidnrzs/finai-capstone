"use client";

import { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

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
          className="flex cursor-pointer items-center gap-1 rounded-md bg-gray-200 p-2 hover:bg-gray-300"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="hidden lg:block">Sebelumnya</span>
        </button>
        <h2 className="text-lg font-bold md:text-2xl">
          {currentMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={goToNextMonth}
          className="flex cursor-pointer items-center gap-1 rounded-md bg-gray-200 p-2 hover:bg-gray-300"
        >
          <span className="hidden lg:block">Berikutnya</span>
          <ChevronRightIcon className="h-5 w-5" />
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
              <th className="te xt-gray-500 px-6 py-3 text-right text-xs font-medium tracking-wider uppercase">
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
                    <td className="px-6 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        {isExpense ? (
                          <MinusCircleIcon className="h-4 w-4 text-red-500" />
                        ) : (
                          <PlusCircleIcon className="h-4 w-4 text-green-500" />
                        )}
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
                <td
                  colSpan={3}
                  className="items-center gap-2 py-10 text-center text-gray-500"
                >
                  <div className="flex w-full flex-col items-center gap-2">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-gray-300" />
                    Tidak ada transaksi untuk bulan ini.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
