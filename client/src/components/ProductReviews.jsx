import { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Star,
  MoreHorizontal,
  BadgeCheck,
  X,
  Send,
  Flag,
} from "lucide-react";
import API from "../lib/api";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Highest Rating", value: "highest" },
  { label: "Lowest Rating", value: "lowest" },
];

const ProductReviews = ({ reviews = [], productId }) => {
  const [sortBy, setSortBy] = useState("latest");
  const [filterRating, setFilterRating] = useState("all");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reporting, setReporting] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  // Filter and sort reviews without mutating the original prop.
  const displayedReviews = useMemo(() => {
    let result = [...safeReviews];

    if (filterRating !== "all") {
      result = result.filter(
        (review) => Number(review.rating) === Number(filterRating),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();

      switch (sortBy) {
        case "oldest":
          return dateA - dateB;
        case "highest":
          return Number(b.rating || 0) - Number(a.rating || 0);
        case "lowest":
          return Number(a.rating || 0) - Number(b.rating || 0);
        case "latest":
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [safeReviews, filterRating, sortBy]);

  const renderStars = (value, interactive = false) => {
    const selectedRating = interactive ? hoverRating || rating : value;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                star <= Math.floor(Number(selectedRating) || 0)
                  ? "fill-[#FFC633] text-[#FFC633]"
                  : "fill-transparent text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!productId) {
      setError("Product information is missing.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      setSubmitting(true);

      // Expected backend endpoint:
      // POST /product/:productId/reviews
      const response = await API.post(`/product/${productId}/review`, {
        rating,
        comment: reviewText.trim(),
      });

      setMessage(response.data.message || "Review submitted successfully.");
      setReviewText("");
      setRating(0);
      setShowReviewModal(false);

      // Refresh the page data so the new review appears.
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportReview = async (reviewId) => {
    if (!reviewId) {
      setError("This review cannot be reported.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to report this review?",
    );

    if (!confirmed) return;

    try {
      setReporting(reviewId);
      setError("");
      setMessage("");

      // Expected backend endpoint:
      // POST /reviews/:reviewId/report
      const response = await API.post(`/reviews/${reviewId}/report`);

      setMessage(response.data.message || "Review reported successfully.");
      setActiveMenu(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to report this review.");
    } finally {
      setReporting(null);
    }
  };

  return (
    <>
      {/* Reviews heading and actions */}
      <div className="mt-8 mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="flex items-center gap-2 font-body text-xl font-bold text-black sm:text-2xl">
          All Reviews
          <span className="font-body text-sm font-normal text-black/60">
            ({safeReviews.length})
          </span>
        </h3>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          {/* Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFilter((prev) => !prev);
                setShowSort(false);
              }}
              aria-label="Filter reviews"
              aria-expanded={showFilter}
              className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full ${
                filterRating !== "all"
                  ? "bg-black text-white"
                  : "bg-[#F0F0F0] text-black"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            {showFilter && (
              <div className="absolute left-0 top-14 z-20 w-48 rounded-xl border border-black/10 bg-white p-3 shadow-lg">
                <p className="mb-2 text-sm font-semibold">Filter by rating</p>

                <button
                  type="button"
                  onClick={() => {
                    setFilterRating("all");
                    setShowFilter(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    filterRating === "all"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  All ratings
                </button>

                {[5, 4, 3, 2, 1].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setFilterRating(String(value));
                      setShowFilter(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      filterRating === String(value)
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{value}</span>
                    <Star className="h-4 w-4 fill-[#FFC633] text-[#FFC633]" />
                    <span className="text-xs">and above? No</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sorting */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setShowSort((prev) => !prev);
                setShowFilter(false);
              }}
              aria-expanded={showSort}
              className="flex h-12 cursor-pointer items-center gap-3 rounded-full bg-[#F0F0F0] px-5"
            >
              <span className="font-body text-sm font-medium">
                {SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
              </span>
              <ChevronDown className="h-4 w-4 text-black" />
            </button>

            {showSort && (
              <div className="absolute right-0 top-14 z-20 w-48 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSort(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      sortBy === option.value
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Write review */}
          <button
            type="button"
            onClick={() => {
              setError("");
              setMessage("");
              setShowReviewModal(true);
            }}
            className="h-12 flex-1 cursor-pointer rounded-full bg-black px-6 font-body text-sm font-medium text-white transition hover:bg-black/80 sm:flex-none"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Review cards */}
      {displayedReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {displayedReviews.map((review) => {
            const reviewId = review._id || review.id;

            return (
              <div
                key={reviewId}
                className="flex flex-col justify-between rounded-2xl border border-black/10 p-6 sm:p-7"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between">
                    {renderStars(review.rating)}

                    {/* Review menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenu((prev) =>
                            prev === reviewId ? null : reviewId,
                          )
                        }
                        aria-label="Review options"
                        aria-expanded={activeMenu === reviewId}
                        className="cursor-pointer text-black/40 hover:text-black"
                      >
                        <MoreHorizontal className="h-6 w-6" />
                      </button>

                      {activeMenu === reviewId && (
                        <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
                          <button
                            type="button"
                            disabled={reporting === reviewId}
                            onClick={() => handleReportReview(reviewId)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Flag className="h-4 w-4" />
                            {reporting === reviewId
                              ? "Reporting..."
                              : "Report review"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-1.5">
                    <h4 className="font-body text-lg font-bold text-black sm:text-xl">
                      {review.name || review.user?.name || "Anonymous"}
                    </h4>

                    {review.isVerifiedPurchase && (
                      <BadgeCheck
                        className="h-5 w-5 text-white"
                        fill="#01AB31"
                      />
                    )}
                  </div>

                  <p className="mb-4 whitespace-pre-wrap wrap-break-word font-body text-sm leading-relaxed text-black/60">
                    {review.text || review.comment || ""}
                  </p>
                </div>

                <p className="font-body text-sm font-medium text-black/60">
                  Posted on {formatDate(review.createdAt || review.date)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 px-5 py-12 text-center">
          <p className="font-body text-base font-medium text-black">
            {safeReviews.length === 0
              ? "No reviews on this product yet."
              : "No reviews match this filter."}
          </p>

          {filterRating !== "all" && (
            <button
              type="button"
              onClick={() => setFilterRating("all")}
              className="mt-3 cursor-pointer text-sm font-medium text-black underline"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Write review modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReviewModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3
                id="review-modal-title"
                className="font-body text-xl font-bold"
              >
                Write a Review
              </h3>

              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                aria-label="Close modal"
                className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <label className="mb-2 block font-body text-sm font-semibold">
                Your Rating
              </label>

              <div className="mb-6 flex items-center gap-1">
                {renderStars(rating, true)}
                <span className="ml-2 text-sm text-black/60">
                  {rating > 0 ? `${rating}/5` : "Select a rating"}
                </span>
              </div>

              <label
                htmlFor="review-text"
                className="mb-2 block font-body text-sm font-semibold"
              >
                Your Review
              </label>

              <textarea
                id="review-text"
                rows={5}
                maxLength={1000}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full resize-none rounded-xl border border-black/15 p-4 font-body text-sm outline-none transition focus:border-black"
              />

              <p className="mt-1 text-right text-xs text-black/40">
                {reviewText.length}/1000
              </p>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black font-body text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductReviews;
