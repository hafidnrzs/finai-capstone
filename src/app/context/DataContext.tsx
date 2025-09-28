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
    { id: "acc1", name: "BCA Savings", type: "Bank" },
    { id: "acc2", name: "GoPay", type: "E-Wallet" },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "cat1", name: "Food & Drink", type: "expense" },
    { id: "cat2", name: "Transportation", type: "expense" },
    { id: "cat3", name: "Salary", type: "income" },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "txn1",
      accountId: "acc1",
      categoryId: "cat3",
      amount: 5000000,
      description: "Monthly Salary",
      transactionDate: new Date("2025-09-01"),
    },
    {
      id: "txn2",
      accountId: "acc2",
      categoryId: "cat1",
      amount: 25000,
      description: "Kopi Kenangan",
      transactionDate: new Date("2025-09-03"),
    },
    {
      id: "txn3",
      accountId: "acc2",
      categoryId: "cat2",
      amount: 50000,
      description: "Gojek Ride",
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
