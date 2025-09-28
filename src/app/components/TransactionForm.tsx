"use client";

import { useState, FormEvent } from "react";
import { useData } from "../context/DataContext";

export default function TransactionForm() {
  // --- Form State ---
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [transactionType, setTransactionType] = useState<"expense" | "income">(
    "expense",
  );

  // --- UI & API State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Get data and actions from our context ---
  const { accounts, categories, addTransaction } = useData();

  // Set the default account
  if (!accountId && accounts.length > 0) {
    setAccountId(accounts[0].id);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accountId) {
      setError("Please select an account.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // 1. Call the AI to get the category name
      const response = await fetch("/api/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, transactionType }),
      });

      if (!response.ok) {
        throw new Error("AI categorization failed.");
      }

      const result = await response.json();
      const aiCategoryName = result.category;

      // 2. Find the category ID that matches the AI's response
      const category = categories.find(
        (c) =>
          c.name.toLowerCase() === aiCategoryName.toLowerCase() &&
          c.type === transactionType,
      );

      if (!category) {
        throw new Error(
          `AI suggested category "${aiCategoryName}" not found for type "${transactionType}".`,
        );
      }

      // 3. Add the transaction to our in-memory state
      addTransaction({
        description,
        amount: parseFloat(amount),
        accountId,
        categoryId: category.id,
        transactionDate: new Date(),
      });

      // 4. Reset the form
      setDescription("");
      setAmount("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Tambah Transaksi Baru</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Deskripsi
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="misal, Kopi Kenangan"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Jumlah
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50000"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="account"
            className="block text-sm font-medium text-gray-700"
          >
            Akun
          </label>
          <select
            id="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.type})
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setTransactionType("expense")}
            className={`w-full cursor-pointer rounded-md p-2 ${
              transactionType === "expense"
                ? "bg-red-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setTransactionType("income")}
            className={`w-full cursor-pointer rounded-md p-2 ${
              transactionType === "income"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Pemasukan
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:bg-gray-400"
        >
          {isLoading ? "Memproses..." : "Tambah Transaksi"}
        </button>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
