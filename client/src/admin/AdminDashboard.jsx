import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ConfirmModal from "../components/ConfirmModal";
import API from "../lib/api";

// --------------------------------------------------
// DASHBOARD STATISTICS
// Calculated from the orders, products and customers loaded below.
// --------------------------------------------------

const PERIOD_DAYS = 30;
const LOW_STOCK_LIMIT = 5;

const orderTotal = (order) => Number(order.totalPrice) || 0;

const isCancelled = (order) => order.orderStatus === "Cancelled";

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  })}`;

// Keeps big revenue numbers from overflowing the stat cards.
const formatCardPrice = (value) =>
  value >= 1_000_000
    ? `Rs. ${new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)}`
    : formatPrice(value);

// null when there is nothing in the previous period to compare against.
const percentChange = (current, previous) =>
  previous > 0
    ? Math.round(((current - previous) / previous) * 1000) / 10
    : null;

const dayKey = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const buildStats = (orders, products, customers) => {
  const now = new Date();
  const dayStart = (daysAgo) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);

  const currentStart = dayStart(PERIOD_DAYS - 1);
  const previousStart = dayStart(PERIOD_DAYS * 2 - 1);

  const current = { revenue: 0, orders: 0 };
  const previous = { revenue: 0, orders: 0 };
  const byDay = new Map();

  orders.forEach((order) => {
    if (isCancelled(order)) return;

    const created = new Date(order.createdAt);
    if (Number.isNaN(created.getTime()) || created < previousStart) return;

    const total = orderTotal(order);

    if (created >= currentStart) {
      current.revenue += total;
      current.orders += 1;

      const key = dayKey(created);
      const day = byDay.get(key) || { revenue: 0, orders: 0 };
      day.revenue += total;
      day.orders += 1;
      byDay.set(key, day);
    } else {
      previous.revenue += total;
      previous.orders += 1;
    }
  });

  const salesByDay = Array.from({ length: PERIOD_DAYS }, (_, i) => {
    const date = dayStart(PERIOD_DAYS - 1 - i);
    const day = byDay.get(dayKey(date));

    return { date, revenue: day?.revenue ?? 0, orders: day?.orders ?? 0 };
  });

  const newCustomers = customers.filter(
    (c) => new Date(c.createdAt) >= currentStart,
  ).length;

  const stock = (product) => Number(product.stock || 0);
  const lowStock = products.filter(
    (p) => stock(p) > 0 && stock(p) <= LOW_STOCK_LIMIT,
  ).length;
  const outOfStock = products.filter((p) => stock(p) <= 0).length;

  const topProducts = products
    .filter((p) => Number(p.soldCount) > 0)
    .sort((a, b) => Number(b.soldCount) - Number(a.soldCount))
    .slice(0, 5);

  return {
    periodDays: PERIOD_DAYS,
    cards: [
      {
        label: "Revenue",
        value: formatCardPrice(current.revenue),
        change: percentChange(current.revenue, previous.revenue),
        hint: `Last ${PERIOD_DAYS} days`,
      },
      {
        label: "Orders",
        value: current.orders.toLocaleString(),
        change: percentChange(current.orders, previous.orders),
        hint: `Last ${PERIOD_DAYS} days`,
      },
      {
        label: "Customers",
        value: customers.length.toLocaleString(),
        hint: `${newCustomers} new in the last ${PERIOD_DAYS} days`,
      },
      {
        label: "Products",
        value: products.length.toLocaleString(),
        hint: `${lowStock} low stock, ${outOfStock} out of stock`,
      },
    ],
    salesByDay,
    topProducts,
  };
};

// --------------------------------------------------
// ADMIN DASHBOARD
// --------------------------------------------------

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Which view ProductsPage should show: "list" | "add" | "edit"
  const [productsView, setProductsView] = useState("list");

  // Entity state
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(
    () => ({ ...buildStats(orders, products, customers), loading }),
    [orders, products, customers, loading],
  );

  // --------------------------------------------------
  // DATA FETCHING
  // --------------------------------------------------

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await API.get("/product");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await API.get("/order");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const { data } = await API.get("/auth");
      setCustomers(data.users);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders(), fetchCustomers()]).finally(
      () => setLoading(false),
    );
  }, [fetchProducts, fetchOrders, fetchCustomers]);

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const handleTabChange = (id) => {
    setActiveTab(id);
    setProductsView("list"); // always land on the product list
    setSidebarOpen(false);
    setSearch(""); // clear search when switching
  };

  const handleAddProductFromDashboard = () => {
    setProductsView("add");
    setActiveTab("products");
  };

  const handleViewOrder = () => setActiveTab("orders");

  const handleLogout = () => setLogoutConfirm(true);
  const confirmLogout = () => {
    setLogoutConfirm(false);
    alert("Logged out successfully!");
    // real app: clear auth + redirect
  };

  // --------------------------------------------------
  // PRODUCT ACTIONS
  // --------------------------------------------------

  const handleAddProduct = async (formData) => {
    try {
      const { data } = await API.post("/product", formData);

      toast.success(data.message || "Product added successfully");
      await fetchProducts();

      return data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
      throw error;
    }
  };

  const handleUpdateProduct = async (productId, formData) => {
    try {
      const { data } = await API.put(`/product/${productId}`, formData);

      toast.success(data.message || "Product updated successfully");
      await fetchProducts();

      return data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
      throw error;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { data } = await API.delete(`/product/${productId}`);

      toast.success(data.message || "Product deleted successfully");
      await fetchProducts();

      return data;
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
      throw error;
    }
  };

  // --------------------------------------------------
  // CUSTOMER ACTIONS
  // --------------------------------------------------

  const handleToggleBlockCustomer = async (customer) => {
    try {
      const { data } = await API.patch(`/customers/${customer._id}/block`, {
        isBlocked: !customer.isBlocked,
      });

      toast.success(data.message || "Customer updated successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update customer");
      throw error;
    }
  };

  const handleDeleteCustomer = async (customer) => {
    try {
      const { data } = await API.delete(`/customers/${customer._id}`);

      toast.success(data.message || "Customer deleted successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete customer");
      throw error;
    }
  };

  // --------------------------------------------------
  // PAGES
  // --------------------------------------------------

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardPage
            orders={orders}
            stats={stats}
            onAddProduct={handleAddProductFromDashboard}
            onNavigate={handleTabChange}
            onViewOrder={handleViewOrder}
          />
        );
      case "products":
        return (
          <ProductsPage
            products={products}
            searchValue={search}
            initialView={productsView}
            onViewChange={setProductsView}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
          />
        );
      case "orders":
        return <OrdersPage orders={orders} searchValue={search} />;
      case "customers":
        return (
          <CustomersPage
            customers={customers}
            loading={loading}
            searchValue={search}
            onToggleBlock={handleToggleBlockCustomer}
            onDelete={handleDeleteCustomer}
          />
        );
      case "analytics":
        return <AnalyticsPage stats={stats} />;
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