"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";

// --- 1. DEFINE THE DATA TYPES (Schema) ---
export interface Account {
  id: string;
  name: string;
  type: "Bank" | "E-Wallet" | "Cash";
}

export interface Category {
  id: string;
  name: string;
  type: "expense" | "income";
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  transactionDate: Date;
}

// --- 2. DEFINE THE SHAPE OF THE CONTEXT ---
interface DataContextType {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
}

// --- 3. CREATE THE CONTEXT ---
const DataContext = createContext<DataContextType | undefined>(undefined);

// --- 4. CREATE THE PROVIDER COMPONENT ---
export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // --- INITIAL DUMMY DATA FOR THE DEMO ---
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "acc1", name: "Dompet", type: "Cash" },
    { id: "acc2", name: "BCA Savings", type: "Bank" },
    { id: "acc3", name: "GoPay", type: "E-Wallet" },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    // Income Categories
    { id: "inc1", name: "Salary/Wages", type: "income" },
    { id: "inc2", name: "Bonus", type: "income" },
    { id: "inc3", name: "Commission", type: "income" },
    { id: "inc4", name: "Freelance/Contract Work", type: "income" },
    { id: "inc5", name: "Dividends", type: "income" },
    { id: "inc6", name: "Interest Income", type: "income" },
    { id: "inc7", name: "Rental Income", type: "income" },
    { id: "inc8", name: "Government Benefits", type: "income" },
    { id: "inc9", name: "Child Support", type: "income" },
    { id: "inc10", name: "Alimony", type: "income" },
    { id: "inc11", name: "Retirement Withdrawals", type: "income" },
    { id: "inc12", name: "Social Security", type: "income" },
    { id: "inc13", name: "Pension", type: "income" },
    { id: "inc14", name: "Other Income", type: "income" },

    // Expense Categories
    { id: "exp1", name: "Housing", type: "expense" },
    { id: "exp2", name: "Transportation", type: "expense" },
    { id: "exp3", name: "Food", type: "expense" },
    { id: "exp4", name: "Health", type: "expense" },
    { id: "exp5", name: "Personal Care", type: "expense" },
    { id: "exp6", name: "Entertainment", type: "expense" },
    { id: "exp7", name: "Shopping", type: "expense" },
    { id: "exp8", name: "Travel", type: "expense" },
    { id: "exp9", name: "Education", type: "expense" },
    { id: "exp10", name: "Debt Repayment", type: "expense" },
    { id: "exp11", name: "Savings", type: "expense" },
    { id: "exp12", name: "Insurance", type: "expense" },
    { id: "exp13", name: "Taxes", type: "expense" },
    { id: "exp14", name: "Gifts & Donations", type: "expense" },
    { id: "exp15", name: "Other Expenses", type: "expense" },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "txn1",
      accountId: "acc2",
      categoryId: "inc1",
      amount: 3500000,
      description: "Gaji Bulanan",
      transactionDate: new Date("2025-09-01"),
    },
    {
      id: "txn2",
      accountId: "acc3",
      categoryId: "exp3",
      amount: 25000,
      description: "Kopi Kenangan",
      transactionDate: new Date("2025-09-03"),
    },
    {
      id: "txn3",
      accountId: "acc3",
      categoryId: "exp2",
      amount: 50000,
      description: "Gojek",
      transactionDate: new Date("2025-09-04"),
    },
  ]);

  // --- FUNCTION TO ADD A NEW TRANSACTION ---
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: `txn${Date.now()}`, // Simple unique ID for the demo
    };
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
  };

  const value = { accounts, categories, transactions, addTransaction };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// --- 5. CREATE A CUSTOM HOOK FOR EASY ACCESS ---
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
