import {
  SlidersHorizontal,
  ChevronDown,
  Star,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";

const ProductReviews = () => {
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
  const REVIEWS = [
    {
      id: 1,
      name: "Samantha D.",
      rating: 5,
      date: "August 14, 2023",
      text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
    },
    {
      id: 2,
      name: "Alex M.",
      rating: 5,
      date: "August 15, 2023",
      text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    },
    {
      id: 3,
      name: "Ethan R.",
      rating: 4,
      date: "August 16, 2023",
      text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    },
    {
      id: 4,
      name: "Olivia P.",
      rating: 5,
      date: "August 17, 2023",
      text: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
    },
  ];

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 mb-6">
        <h3 className="font-body font-bold text-xl sm:text-2xl text-black flex items-center gap-2">
          All Reviews{" "}
          <span className="text-black/60 font-body text-sm font-normal">
            ({PRODUCT.reviews})
          </span>
        </h3>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0 cursor-pointer">
            <SlidersHorizontal className="w-5 h-5 text-black" />
          </button>
          <button className="h-12 px-5 rounded-full bg-[#F0F0F0] hidden sm:flex items-center gap-3 cursor-pointer">
            <span className="font-body text-sm font-medium">Latest</span>
            <ChevronDown className="w-4 h-4 text-black" />
          </button>
          <button className="flex-1 sm:flex-none h-12 px-6 rounded-full bg-black text-white font-body text-sm font-medium cursor-pointer">
            Write a Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="border border-black/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                {renderStars(review.rating)}
                <button className="text-black/40 hover:text-black cursor-pointer">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <h4 className="font-body font-bold text-lg sm:text-xl text-black">
                  {review.name}
                </h4>
                <BadgeCheck className="w-5 h-5 text-white" fill="#01AB31" />
              </div>
              <p className="font-body text-sm text-black/60 leading-relaxed mb-4">
                "{review.text}"
              </p>
            </div>
            <p className="font-body text-sm text-black/60 font-medium">
              Posted on {review.date}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductReviews;
