import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

import { DataProvider } from "./context/DataContext";
import Navbar from "./components/Navbar";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "FinAI - Personal Finance Tracker",
  description: "Your AI-powered personal finance tracker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased`}>
        <Navbar />
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
