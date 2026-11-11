import React from "react";
import SalesChart from "../components/SalesChart";
import StatCard from "../components/StatCard";
import { INITIAL_STATS } from "../data/mockData";

const AnalyticsPage = () => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
          Analytics
        </h1>
        <p className="font-body text-sm text-black/60 mt-1">Performance insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {INITIAL_STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <SalesChart />
    </div>
  );
};

export default AnalyticsPage;