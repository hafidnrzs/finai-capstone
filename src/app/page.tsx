import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import OverviewCards from "./components/OverviewCards";
import AIInsightCard from "./components/AIInsightCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full py-6">
            <div className="flex items-center">
              <h1 className="text-3xl text-gray-900">
                <span className="font-bold">Fin</span>
                <span className="font-bold text-slate-500">AI</span> Dasbor
              </h1>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* --- Dashboard Summary Cards --- */}
          <OverviewCards />
          <AIInsightCard />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* --- Left Column: Form --- */}
            <div className="lg:col-span-1">
              <TransactionForm />
            </div>

            {/* --- Right Column: Monthly List of Transactions --- */}
            <div className="lg:col-span-2">
              <TransactionList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
