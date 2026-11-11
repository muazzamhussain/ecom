import React from "react";
import { Plus } from "lucide-react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import TopProducts from "../components/TopProducts";
import OrdersTable from "../components/OrdersTable";
import { INITIAL_STATS } from "../data/mockData";

const DashboardPage = ({ orders, onAddProduct, onNavigate, onViewOrder }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
            Dashboard
          </h1>
          <p className="font-body text-sm text-black/60 mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {INITIAL_STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <TopProducts onViewAll={() => onNavigate("products")} />
      </div>

      <OrdersTable
        orders={orders.slice(0, 4)}
        title="Recent Orders"
        subtitle="Latest customer purchases"
        onViewAll={() => onNavigate("orders")}
        onViewOrder={onViewOrder}
      />
    </div>
  );
};

export default DashboardPage;