import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  DollarSign,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export const INITIAL_STATS = [
  {
    label: "Total Revenue",
    value: "$48,329",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Total Orders",
    value: "1,429",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    label: "Total Products",
    value: "384",
    change: "+3.1%",
    trend: "up",
    icon: Package,
  },
  {
    label: "Total Customers",
    value: "12,580",
    change: "-2.4%",
    trend: "down",
    icon: Users,
  },
];

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "One Life Graphic T-Shirt",
    category: "T-Shirts",
    price: 260,
    oldPrice: 300,
    stock: 48,
    status: "Active",
  },
  {
    id: 2,
    name: "Skinny Fit Jeans",
    category: "Jeans",
    price: 240,
    oldPrice: 260,
    stock: 32,
    status: "Active",
  },
  {
    id: 3,
    name: "Checkered Shirt",
    category: "Shirts",
    price: 180,
    oldPrice: null,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Polo with Contrast Trims",
    category: "Polo",
    price: 212,
    oldPrice: 242,
    stock: 15,
    status: "Active",
  },
  {
    id: 5,
    name: "Gradient Graphic T-shirt",
    category: "T-Shirts",
    price: 145,
    oldPrice: null,
    stock: 67,
    status: "Active",
  },
];

export const INITIAL_ORDERS = [
  {
    id: "#ORD-8924",
    customer: "Alex K.",
    product: "One Life Graphic T-Shirt",
    date: "Aug 20, 2023",
    status: "Delivered",
    total: 260,
  },
  {
    id: "#ORD-8923",
    customer: "Sarah M.",
    product: "Skinny Fit Jeans",
    date: "Aug 20, 2023",
    status: "Processing",
    total: 240,
  },
  {
    id: "#ORD-8922",
    customer: "James L.",
    product: "Checkered Shirt",
    date: "Aug 19, 2023",
    status: "Shipped",
    total: 180,
  },
  {
    id: "#ORD-8921",
    customer: "Olivia P.",
    product: "Polo with Contrast Trims",
    date: "Aug 19, 2023",
    status: "Delivered",
    total: 212,
  },
  {
    id: "#ORD-8920",
    customer: "Ethan R.",
    product: "Gradient Graphic T-shirt",
    date: "Aug 18, 2023",
    status: "Cancelled",
    total: 145,
  },
];

export const INITIAL_CUSTOMERS = [
  { id: 1, name: "Alex K.", email: "alex@Ecom", orders: 12, spent: 2840 },
  { id: 2, name: "Sarah M.", email: "sarah@Ecom", orders: 8, spent: 1920 },
  { id: 3, name: "James L.", email: "james@Ecom", orders: 15, spent: 3610 },
  { id: 4, name: "Olivia P.", email: "olivia@Ecom", orders: 5, spent: 940 },
];

export const TOP_PRODUCTS = [
  { name: "One Life Graphic T-Shirt", sold: 342, revenue: 88920 },
  { name: "Skinny Fit Jeans", sold: 287, revenue: 68880 },
  { name: "Checkered Shirt", sold: 219, revenue: 39420 },
  { name: "Polo with Contrast Trims", sold: 198, revenue: 41976 },
];

export const CATEGORIES = [
  "T-Shirts",
  "Jeans",
  "Shirts",
  "Polo",
  "Shorts",
  "Hoodies",
];

export const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
    case "Active":
      return "text-[#01AB31] bg-[#01AB31]/10";
    case "Processing":
      return "text-[#FFC633] bg-[#FFC633]/10";
    case "Shipped":
      return "text-[#3B82F6] bg-[#3B82F6]/10";
    case "Cancelled":
    case "Out of Stock":
      return "text-[#FF3333] bg-[#FF3333]/10";
    default:
      return "text-black/60 bg-[#F0F0F0]";
  }
};
