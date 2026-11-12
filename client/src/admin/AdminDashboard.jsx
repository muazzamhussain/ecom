import { useCallback, useEffect, useState } from "react";
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

  // --------------------------------------------------
  // DATA FETCHING
  // Defined at component level so the product handlers can refresh the list.
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
    fetchProducts();
    fetchOrders();
    fetchCustomers();
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
  // PAGES
  // --------------------------------------------------

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
