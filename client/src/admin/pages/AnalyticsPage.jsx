import { Loader2 } from "lucide-react";
import SalesChart from "../components/SalesChart";
import StatCard from "../components/StatCard";

const AnalyticsPage = ({ stats }) => {
  if (stats.loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
          Analytics
        </h1>
        <p className="font-body text-sm text-black/60 mt-1">
          Performance insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <SalesChart data={stats.salesByDay} days={stats.periodDays} />
    </div>
  );
};

export default AnalyticsPage;
