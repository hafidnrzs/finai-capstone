import OverviewCards from "../components/OverviewCards";
import AIInsightCard from "../components/AIInsightCard";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 md:px-8">
      <h1 className="mb-4 text-2xl font-bold">Dasbor</h1>
      <div className="flex flex-col">
        <OverviewCards />
        <AIInsightCard />
      </div>
    </div>
  );
}
