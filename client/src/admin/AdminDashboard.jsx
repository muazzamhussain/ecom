
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../context/authContext";

// --------------------------------------------------
// DASHBOARD STATISTICS
// --------------------------------------------------

const PERIOD_DAYS = 30;
const LOW_STOCK_LIMIT = 5;

const orderTotal = (order) => Number(order?.totalPrice) || 0;

const isCancelled = (order) =>
  String(order?.orderStatus || "").toLowerCase() === "cancelled";

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  })}`;

const formatCardPrice = (value) =>
  value >= 1_000_000
    ? `Rs. ${new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)}`
    : formatPrice(value);

const percentChange = (current, previous) =>
  previous > 0
    ? Math.round(((current - previous) / previous) * 1000) / 10
    : null;

const dayKey = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

// Normalize API responses so dashboard calculations always receive arrays.
// Supports both direct arrays and common object response formats.
const extractArray = (payload, keys = []) => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }

    if (Array.isArray(payload?.data?.[key])) {
      return payload.data[key];
    }
  }

  return [];
};

const buildStats = (orders, products, customers) => {
  // Defensive normalization: never call array methods on undefined.
  orders = Array.isArray(orders) ? orders : [];
  products = Array.isArray(products) ? products : [];
  customers = Array.isArray(customers) ? customers : [];

  const now = new Date();

  const dayStart = (daysAgo) =>
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysAgo,
    );

  const currentStart = dayStart(PERIOD_DAYS - 1);
  const previousStart = dayStart(PERIOD_DAYS * 2 - 1);

  const current = { revenue: 0, orders: 0 };
  const previous = { revenue: 0, orders: 0 };

  const byDay = new Map();

  orders.forEach((order) => {
    if (isCancelled(order)) return;

    const created = new Date(order?.createdAt);

    if (
      Number.isNaN(created.getTime()) ||
      created < previousStart
    ) {
      return;
    }

    const total = orderTotal(order);

    if (created >= currentStart) {
      current.revenue += total;
      current.orders += 1;

      const key = dayKey(created);
      const day = byDay.get(key) || {
        revenue: 0,
        orders: 0,
      };

      day.revenue += total;
      day.orders += 1;

      byDay.set(key, day);
    } else {
      previous.revenue += total;
      previous.orders += 1;
    }
  });

  const salesByDay = Array.from(
    { length: PERIOD_DAYS },
    (_, index) => {
      const date = dayStart(PERIOD_DAYS - 1 - index);
      const day = byDay.get(dayKey(date));

      return {
        date,
        revenue: day?.revenue ?? 0,
        orders: day?.orders ?? 0,
      };
    },
  );

  const newCustomers = customers.filter((customer) => {
    const created = new Date(customer?.createdAt);

    return (
      !Number.isNaN(created.getTime()) &&
      created >= currentStart
    );
  }).length;

  const stock = (product) => Number(product?.stock) || 0;

  const lowStock = products.filter(
    (product) =>
      stock(product) > 0 &&
      stock(product) <= LOW_STOCK_LIMIT,
  ).length;

  const outOfStock = products.filter(
    (product) => stock(product) <= 0,
  ).length;

  // Copy before sorting; do not mutate the original products state.
  const topProducts = [...products]
    .filter((product) => Number(product?.soldCount) > 0)
    .sort(
      (a, b) =>
        Number(b.soldCount) - Number(a.soldCount),
    )
    .slice(0, 5);

  return {
    periodDays: PERIOD_DAYS,

    cards: [
      {
        label: "Revenue",
        value: formatCardPrice(current.revenue),
        change: percentChange(
          current.revenue,
          previous.revenue,
        ),
        hint: `Last ${PERIOD_DAYS} days`,
      },
      {
        label: "Orders",
        value: current.orders.toLocaleString(),
        change: percentChange(
          current.orders,
          previous.orders,
        ),
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
  const navigate = useNavigate();

  const { logout, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Product view: "list" | "add" | "edit"
  const [productsView, setProductsView] = useState("list");

  // Dashboard data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // DATA FETCHING
  // --------------------------------------------------

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await API.get("/product");

      setProducts(
        extractArray(data, ["products"]),
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await API.get("/order");

      setOrders(
        extractArray(data, ["orders"]),
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      // Your backend auth router exposes GET / for admin users.
      const { data } = await API.get("/auth");

      setCustomers(
        extractArray(data, ["users", "customers"]),
      );
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    }
  }, []);

  // Wait until AuthProvider has finished restoring the session.
  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchCustomers(),
        ]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [
    authLoading,
    fetchProducts,
    fetchOrders,
    fetchCustomers,
  ]);

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const stats = useMemo(
    () => ({
      ...buildStats(orders, products, customers),
      loading,
    }),
    [orders, products, customers, loading],
  );

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const handleTabChange = (id) => {
    setActiveTab(id);
    setProductsView("list");
    setSidebarOpen(false);
    setSearch("");
  };

  const handleAddProductFromDashboard = () => {
    setProductsView("add");
    setActiveTab("products");
    setSidebarOpen(false);
  };

  const handleViewOrder = () => {
    handleTabChange("orders");
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleOpenLogoutModal = () => {
    setLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();

      setLogoutConfirm(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to log out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  // --------------------------------------------------
  // PRODUCT ACTIONS
  // --------------------------------------------------

  const handleAddProduct = async (formData) => {
    try {
      const { data } = await API.post(
        "/product",
        formData,
      );

      toast.success(
        data.message || "Product added successfully",
      );

      await fetchProducts();

      return data.product;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add product",
      );

      throw error;
    }
  };

  const handleUpdateProduct = async (
    productId,
    formData,
  ) => {
    try {
      const { data } = await API.put(
        `/product/${productId}`,
        formData,
      );

      toast.success(
        data.message || "Product updated successfully",
      );

      await fetchProducts();

      return data.product;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update product",
      );

      throw error;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { data } = await API.delete(
        `/product/${productId}`,
      );

      toast.success(
        data.message || "Product deleted successfully",
      );

      await fetchProducts();

      return data;
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product",
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // CUSTOMER ACTIONS
  // --------------------------------------------------

  const handleToggleBlockCustomer = async (customer) => {
    try {
      // This endpoint must exist in your backend.
      const { data } = await API.patch(
        `/customers/${customer._id}/block`,
        {
          isBlocked: !customer.isBlocked,
        },
      );

      toast.success(
        data.message || "Customer updated successfully",
      );

      await fetchCustomers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update customer",
      );

      throw error;
    }
  };

  const handleDeleteCustomer = async (customer) => {
    try {
      // Matches your shown backend route:
      // router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser)
      const { data } = await API.delete(
        `/auth/${customer._id}`,
      );

      toast.success(
        data.message || "Customer deleted successfully",
      );

      await fetchCustomers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete customer",
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // PAGE RENDERING
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
        return (
          <OrdersPage
            orders={orders}
            searchValue={search}
          />
        );

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

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] select-none flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleOpenLogoutModal}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={search}
          onSearchChange={setSearch}
          onBellClick={() =>
            console.log("Notifications clicked")
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {renderPage()}
        </main>
      </div>

      <ConfirmModal
        open={logoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out of your admin account?"
        confirmText={isLoggingOut ? "Logging Out..." : "Log Out"}
        onConfirm={confirmLogout}
        onCancel={() => {
          if (!isLoggingOut) {
            setLogoutConfirm(false);
          }
        }}
      />
    </div>
  );
};

export default AdminDashboard;
