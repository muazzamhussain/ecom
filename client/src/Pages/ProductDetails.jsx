import React, { useState } from "react";
import { Check, Minus, Plus,Star } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQsTab from "../components/FAQsTab";
import ProductDetailsTab from "../components/ProductDetailsTab";
import ProductReviews from "../components/ProductReviews";

// --- MOCK DATA ---
const PRODUCT = {
  title: "ONE LIFE GRAPHIC T-SHIRT",
  rating: 4.5,
  reviews: 451,
  price: 260,
  oldPrice: 300,
  discount: "-40%",
  description:
    "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
  colors: ["#4F4631", "#314F4A", "#31344F"],
  sizes: ["Small", "Medium", "Large", "X-Large"],
  images: [
    "/placeholder-shirt-1.png", // Replace with your actual image paths
    "/placeholder-shirt-2.png",
    "/placeholder-shirt-3.png",
  ],
};

const RELATED_PRODUCTS = [
  { title: "Polo with Contrast Trims", price: 212, oldPrice: 242, rating: 4.0 },
  {
    title: "Gradient Graphic T-shirt",
    price: 145,
    oldPrice: null,
    rating: 3.5,
  },
  {
    title: "Polo with Tipping Details",
    price: 180,
    oldPrice: null,
    rating: 4.5,
  },
  { title: "Black Striped T-shirt", price: 120, oldPrice: 150, rating: 5.0 },
];

export default function ProductDetail() {
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState("Large");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Rating & Reviews");

  // Helper for stars
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              i < Math.floor(rating)
                ? "fill-[#FFC633] text-[#FFC633]"
                : "fill-transparent text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="w-full bg-white pb-20 select-none">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
          {/* ================= TOP: PRODUCT INFO ================= */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            {/* Left: Images */}
            <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-1/2 h-fit">
              {/* Thumbnails */}
              <div className="flex flex-row md:flex-col gap-3.5 overflow-x-auto md:w-37 shrink-0 no-scrollbar">
                {PRODUCT.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`w-full aspect-3/4 rounded-xl overflow-hidden bg-[#F0EEED] border-2 transition-all cursor-pointer ${
                      activeImg === idx ? "border-black" : "border-transparent"
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-black/20 text-xs">
                      Image {idx + 1}
                    </div>
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="w-full aspect-3/4 md:aspect-auto md:h-150 rounded-2xl bg-[#F0EEED] flex items-center justify-center">
                <span className="text-black/20">Main Image Placeholder</span>
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <h1 className="font-body text-3xl sm:text-4xl uppercase font-black  text-black mb-3">
                {PRODUCT.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                {renderStars(PRODUCT.rating)}
                <span className="font-body text-sm text-black/60">
                  {PRODUCT.rating}/<span className="text-black">5</span>
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-5">
                <span className="font-body text-3xl font-bold text-black">
                  ${PRODUCT.price}
                </span>
                <span className="font-body text-3xl font-bold text-black/30 line-through">
                  ${PRODUCT.oldPrice}
                </span>
                <span className="font-body font-medium text-xs text-[#FF3333] bg-[#FF3333]/10 px-3 py-1.5 rounded-full">
                  {PRODUCT.discount}
                </span>
              </div>

              <p className="font-body text-black/60 text-sm leading-relaxed mb-6">
                {PRODUCT.description}
              </p>

              <hr className="border-black/10 mb-6" />

              {/* Colors */}
              <div className="mb-6">
                <span className="font-body text-black/60 text-sm mb-3 block">
                  Select Colors
                </span>
                <div className="flex gap-4">
                  {PRODUCT.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveColor(idx)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ring-1 ring-black/10"
                      style={{ backgroundColor: color }}
                    >
                      {activeColor === idx && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-black/10 mb-6" />

              {/* Sizes */}
              <div className="mb-6">
                <span className="font-body text-black/60 text-sm mb-3 block">
                  Choose Size
                </span>
                <div className="flex flex-wrap gap-3">
                  {PRODUCT.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setActiveSize(size)}
                      className={`px-6 py-2.5 rounded-full font-body text-sm transition-colors cursor-pointer ${
                        activeSize === size
                          ? "bg-black text-white"
                          : "bg-[#F0F0F0] text-black/60 hover:bg-[#e0e0e0]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-black/10 mb-6" />

              {/* Actions (Qty + Cart) */}
              <div className="flex gap-4">
                <div className="bg-[#F0F0F0] rounded-full flex items-center justify-between px-5 w-32 shrink-0">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 cursor-pointer text-black"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-body font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-2 cursor-pointer text-black"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button className="flex-1 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-colors cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* ================= MIDDLE: TABS & REVIEWS ================= */}
          <div className="mt-16 md:mt-20">
            {/* Tabs Header Navigation */}
            <div className="flex justify-between border-b border-black/10 px-2">
              {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-body text-sm sm:text-base transition-colors flex-1 text-center cursor-pointer ${
                    activeTab === tab
                      ? "text-black font-medium border-b-2 border-black"
                      : "text-black/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT RENDERER */}
            <div className="mt-8">
              {activeTab === "Product Details" && <ProductDetailsTab />}

              {activeTab === "FAQs" && <FAQsTab />}

              {activeTab === "Rating & Reviews" && <ProductReviews />}
            </div>
          </div>

          {/* ================= BOTTOM: YOU MIGHT ALSO LIKE ================= */}
          <div className="mt-20 md:mt-24">
            <h2 className="text-center font-heading text-2xl sm:text-4xl lg:text-5xl uppercase font-bold  mb-10">
              YOU MIGHT ALSO LIKE
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {RELATED_PRODUCTS.map((prod, idx) => (
                <div key={idx} className="flex flex-col cursor-pointer group">
                  <div className="aspect-square bg-[#F0EEED] rounded-[20px] mb-4 overflow-hidden flex items-center justify-center">
                    {/* Product Image Placeholder */}
                    <span className="text-black/20 text-xs">Image</span>
                  </div>
                  <h3 className="font-body font-bold text-base sm:text-lg mb-1 truncate group-hover:underline">
                    {prod.title}
                  </h3>
                  <div className="mb-1">{renderStars(prod.rating)}</div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-body tracking-tight font-bold text-xl sm:text-2xl">
                      ${prod.price}
                    </span>
                    {prod.oldPrice && (
                      <>
                        <span className="font-heading font-bold text-xl sm:text-2xl text-black/30 line-through">
                          ${prod.oldPrice}
                        </span>
                        <span className="font-body text-xs text-[#FF3333] bg-[#FF3333]/10 px-2 py-1 rounded-full">
                          -
                          {Math.round(
                            ((prod.oldPrice - prod.price) / prod.oldPrice) *
                              100,
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
