"use client";

import { useState, useEffect, useMemo } from "react";
import { useData } from "../context/DataContext";
import { MonthlySummary } from "@/app/lib/ai/interface";

export default function AIInsightCard() {
  const [insight, setInsight] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { transactions, categories } = useData();

  // 1. Calculate the monthly summary from the context data
  const monthlySummary: MonthlySummary = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const relevantTxns = transactions.filter(
      (t) =>
        new Date(t.transactionDate) >= startOfMonth &&
        new Date(t.transactionDate) <= endOfMonth,
    );

    let totalIncome = 0;
    let totalExpenses = 0;
    const expenseMap: { [key: string]: number } = {};

    for (const txn of relevantTxns) {
      const category = categories.find((c) => c.id === txn.categoryId);
      if (category?.type === "income") totalIncome += txn.amount;
      if (category?.type === "expense") {
        totalExpenses += txn.amount;
        expenseMap[category.name] =
          (expenseMap[category.name] || 0) + txn.amount;
      }
    }

    const topExpenses = Object.entries(expenseMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

    return { totalIncome, totalExpenses, topExpenses };
  }, [transactions, categories]);

  // 2. The "Smart" Fetching Logic
  const fetchInsight = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    // Check the cache first
    const cachedInsight = localStorage.getItem("aiInsight");
    const cachedTimestamp = localStorage.getItem("aiInsightTimestamp");
    const now = new Date().getTime();

    // Use cache if it's not forced and less than 24 hours old
    if (
      cachedInsight &&
      cachedTimestamp &&
      !forceRefresh &&
      now - parseInt(cachedTimestamp, 10) < 24 * 60 * 60 * 1000
    ) {
      setInsight(cachedInsight);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch a new one
    try {
      const response = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(monthlySummary),
      });

      if (!response.ok) throw new Error("Failed to fetch new insight.");

      const result = await response.json();
      setInsight(result.insight);

      // Update cache
      localStorage.setItem("aiInsight", result.insight);
      localStorage.setItem("aiInsightTimestamp", now.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on initial component mount
  useEffect(() => {
    fetchInsight();
  }, []); // Run only once

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          Tips Keuangan AI Anda
        </h3>
        <button
          onClick={() => fetchInsight(true)}
          disabled={isLoading}
          className="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
        >
          Segarkan
        </button>
      </div>
      <div className="mt-4 min-h-[60px] text-gray-600">
        {isLoading && <p>Menganalisis keuangan Anda...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && <p>"{insight}"</p>}
      </div>
    </div>
  );
}
