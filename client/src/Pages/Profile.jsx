import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";

import PersonalDetails from "../components/PersonalDetails";
import MyOrders from "../components/MyOrders";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { useAuth } from "../context/authContext";
import ConfirmModal from "../components/ConfirmModal";
import Setting from "../components/Setting";

const NAV_ITEMS = [
  { id: "profile", label: "Personal Info", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, logout, isLoading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // STEP 1: Open the modal (called when sidebar "Log Out" button is clicked)
  const handleOpenLogoutModal = () => {
    setLogoutConfirm(true);
  };

  // STEP 2: Actual logout (called when user clicks "Log Out" inside the modal)
  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setLogoutConfirm(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-black/60">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />

      <div className="w-full bg-white pb-20 select-none">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
          <h1 className="font-heading text-2xl sm:text-4xl uppercase font-black tracking-wide text-black mb-8 md:mb-10">
            MY ACCOUNT
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* SIDEBAR */}
            <div className="w-full lg:w-72 shrink-0">
              {/* USER MINI CARD */}
              <div className="hidden lg:flex items-center gap-4 mb-8 p-6 rounded-2xl border border-black/10">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white font-heading text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-lg tracking-wider text-black truncate">
                    {user.name}
                  </h3>
                  <p className="font-body text-sm text-black/60 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* NAVIGATION */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-full font-body text-sm sm:text-base font-medium transition-colors shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-black text-white"
                          : "text-black/60 hover:bg-[#F0F0F0] hover:text-black"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <hr className="hidden lg:block border-black/10 my-4" />

                {/* LOGOUT BUTTON - OPENS MODAL */}
                <button
                  onClick={handleOpenLogoutModal}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-full font-body text-sm sm:text-base font-medium text-[#FF3333] hover:bg-[#FF3333]/10 transition-colors shrink-0 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1">
              {activeTab === "profile" && <PersonalDetails />}

              {activeTab === "orders" && <MyOrders />}

              {activeTab === "settings" && <Setting />}

              {["wishlist", "payment"].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-20 border border-black/10 rounded-2xl bg-[#F9F9F9]">
                  <Package className="w-12 h-12 text-black/20 mb-4" />
                  <h2 className="font-heading text-xl uppercase text-black mb-2">
                    Coming Soon
                  </h2>
                  <p className="font-body text-sm text-black/60">
                    This section is currently under development.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM LOGOUT MODAL */}
      <ConfirmModal
        open={logoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText={isLoggingOut ? "Logging out..." : "Log Out"}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirm(false)}
      />

      <Footer />
    </>
  );
}
