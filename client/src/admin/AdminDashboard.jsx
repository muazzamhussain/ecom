import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ConfirmModal from "../components/ConfirmModal";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
} from "./data/mockData";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Entity state
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders] = useState(INITIAL_ORDERS);
  const [customers] = useState(INITIAL_CUSTOMERS);

  // Signal child to open "add" form
  const [addProductTick, setAddProductTick] = useState(0);

  // CRUD handlers
  const handleAdd = (data) => {
    setProducts((prev) => [{ ...data, id: Date.now() }, ...prev]);
  };
  const handleUpdate = (updated) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };
  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
    setSearch(""); // clear search when switching
  };

  const handleAddProductFromDashboard = () => {
    setActiveTab("products");
    setAddProductTick((t) => t + 1); // force ProductsPage effect
  };

  const handleViewOrder = () => setActiveTab("orders");

  const handleLogout = () => setLogoutConfirm(true);
  const confirmLogout = () => {
    setLogoutConfirm(false);
    alert("Logged out successfully!");
    // real app: clear auth + redirect
  };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardPage
            orders={orders}
            onAddProduct={handleAddProductFromDashboard}
            onNavigate={handleTabChange}
            onViewOrder={handleViewOrder}
          />
        );
      case "products":
        return (
          <ProductsPage
            key={addProductTick} // reset local view when "Add" triggered
            products={products}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            searchValue={search}
          />
        );
      case "orders":
        return <OrdersPage orders={orders} searchValue={search} />;
      case "customers":
        return <CustomersPage customers={customers} />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] select-none flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={search}
          onSearchChange={setSearch}
          onBellClick={() => console.log("Notifications clicked")}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {renderPage()}
        </main>
      </div>

      <ConfirmModal
        open={logoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out of your admin account?"
        confirmText="Log Out"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirm(false)}
      />
    </div>
  );
};

export default AdminDashboard;