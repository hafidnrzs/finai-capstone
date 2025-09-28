import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 md:px-8">
      <h1 className="mb-4 text-2xl font-bold">Transaksi</h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  );
}
