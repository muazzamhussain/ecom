import { useEffect, useState } from "react";
import { Check, Minus, Plus, Star } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQsTab from "../components/FAQsTab";
import ProductDetailsTab from "../components/ProductDetailsTab";
import ProductReviews from "../components/ProductReviews";

import API from "../lib/api";
import { useCart } from "../context/cartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Rating & Reviews");

  // Fetch product using the URL ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const result = await API.get(`/product/${id}`);

        setProduct(result.data);
        setActiveImg(0);
        setActiveColor(0);
        setActiveSize("");
        setQty(1);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Product values
  const images = product?.images ?? [];
  const colors = Array.isArray(product?.colors) ? product.colors : [];
  const sizes = Array.isArray(product?.sizes) ? product.sizes : [];

  const price = Number(product?.salePrice ?? product?.cost ?? 0);
  const oldPrice = Number(product?.cost ?? 0);

  // Support either a numeric rating or an object containing average
  const rating =
    Number(
      product?.ratings?.average ?? product?.ratings ?? product?.rating ?? 0,
    ) || 0;

  const discount =
    oldPrice > price && oldPrice > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  // Render rating stars
  const renderStars = (value) => {
    const safeRating = Math.max(0, Math.min(5, Number(value) || 0));

    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              i < Math.round(safeRating)
                ? "fill-[#FFC633] text-[#FFC633]"
                : "fill-transparent text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Add selected product to cart
  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, qty);
    toast.success("Product added to cart");
  };

  const productId = product?._id || product?.id;
  const isInCart = cart.some(
    (item) => String(item.productId || item._id) === String(productId),
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="font-body text-gray-500">Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <h2 className="font-heading text-2xl font-bold">Product not found</h2>
          <p className="font-body text-gray-500">
            {error || "This product may have been removed."}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="w-full bg-white pb-20 select-none">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
          {/* TOP: PRODUCT INFO */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            {/* LEFT: PRODUCT IMAGES */}
            <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-1/2 h-fit">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex flex-row md:flex-col gap-3.5 overflow-x-auto md:w-37 shrink-0 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImg(idx)}
                      className={`w-20 md:w-full aspect-3/4 rounded-xl overflow-hidden bg-[#F0EEED] border-2 transition-all cursor-pointer shrink-0 ${
                        activeImg === idx
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="w-full aspect-3/4 md:aspect-auto md:h-150 rounded-2xl bg-[#F0EEED] overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[activeImg] || images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/30">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: PRODUCT DETAILS */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black text-black mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                {renderStars(rating)}

                <span className="font-body text-sm text-black/60">
                  {rating.toFixed(1)}/<span className="text-black">5</span>
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center flex-wrap gap-3 mb-5">
                <span className="font-body text-3xl font-bold text-black">
                  ${price.toFixed(2)}
                </span>

                {oldPrice > price && (
                  <>
                    <span className="font-body text-2xl font-bold text-black/30 line-through">
                      ${oldPrice.toFixed(2)}
                    </span>

                    <span className="font-body font-medium text-xs text-[#FF3333] bg-[#FF3333]/10 px-3 py-1.5 rounded-full">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="font-body text-black/60 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              <hr className="border-black/10 mb-6" />

              {/* Colors - only shown if product has colors */}
              {colors.length > 0 && (
                <>
                  <div className="mb-6">
                    <span className="font-body text-black/60 text-sm mb-3 block">
                      Select Colors
                    </span>

                    <div className="flex gap-4">
                      {colors.map((color, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveColor(idx)}
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ring-1 ring-black/10"
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                        >
                          {activeColor === idx && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-black/10 mb-6" />
                </>
              )}

              {/* Sizes - only shown if product has sizes */}
              {sizes.length > 0 && (
                <>
                  <div className="mb-6">
                    <span className="font-body text-black/60 text-sm mb-3 block">
                      Choose Size
                    </span>

                    <div className="flex flex-wrap gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
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
                </>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex gap-4">
                <div className="bg-[#F0F0F0] rounded-full flex items-center justify-between px-3 sm:px-5 w-32 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="p-2 cursor-pointer text-black"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <span className="font-body font-medium">{qty}</span>

                  <button
                    type="button"
                    onClick={() => setQty((prev) => prev + 1)}
                    className="p-2 cursor-pointer text-black"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {isInCart ? (
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="flex-1 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white font-body font-medium rounded-full hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE: TABS AND REVIEWS */}
          <div className="mt-16 md:mt-20">
            <div className="flex justify-between border-b border-black/10 px-2">
              {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-body text-xs sm:text-base transition-colors flex-1 text-center cursor-pointer ${
                    activeTab === tab
                      ? "text-black font-medium border-b-2 border-black"
                      : "text-black/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-8">
              {activeTab === "Product Details" && (
                <ProductDetailsTab product={product} />
              )}

              {activeTab === "FAQs" && <FAQsTab />}

              {activeTab === "Rating & Reviews" && (
                <ProductReviews
                  reviews={product.reviews}
                  productId={productId}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
