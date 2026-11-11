import {
  SlidersHorizontal,
  ChevronDown,
  Star,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";

const ProductReviews = ({ reviews }) => {
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
            ({reviews})
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
      {reviews.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review) => (
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
      ) : (
        <p className="text-center">No reviews on this product.</p>
      )}
    </>
  );
};

export default ProductReviews;
