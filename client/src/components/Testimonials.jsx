import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star, BadgeCheck } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    verified: true,
    rating: 5,
    comment:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: "Alex K.",
    verified: true,
    rating: 5,
    comment:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: 3,
    name: "James L.",
    verified: true,
    rating: 5,
    comment:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: 4,
    name: "Mooen K.",
    verified: true,
    rating: 5,
    comment:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is amazing and always on trend.",
  },
  {
    id: 5,
    name: "Samantha D.",
    verified: true,
    rating: 5,
    comment:
      "The customer service is top notch! Delivery was fast and the quality of fabrics is unmatched. Highly recommend Shop.co.",
  },
  {
    id: 6,
    name: "Ethan R.",
    verified: true,
    rating: 5,
    comment:
      "Great prices for premium quality. Everything fits true to size and looks even better in person than on the website.",
  },
  {
    id: 7,
    name: "Olivia P.",
    verified: true,
    rating: 5,
    comment:
      "Shop.co has become my go-to online store. The variety is insane and the items always arrive beautifully packaged!",
  },
];

export default function HappyCustomers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(5);

  // Update how many cards are visible based on screen width
  useEffect(() => {
    const updateCardsToShow = () => {
      const width = window.innerWidth;
      if (width < 640)
        setCardsToShow(1); // mobile
      else if (width < 768)
        setCardsToShow(2); // sm
      else if (width < 1024)
        setCardsToShow(3); // md
      else if (width < 1280)
        setCardsToShow(4); // lg
      else setCardsToShow(5); // xl+
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  // Reset index if it goes out of bounds when resizing
  useEffect(() => {
    const maxIndex = Math.max(0, testimonials.length - cardsToShow);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsToShow, currentIndex]);

  const maxIndex = Math.max(0, testimonials.length - cardsToShow);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Card width calculation (accounting for gap)
  const gap = 20; // gap-5 = 1.25rem = 20px
  const cardWidthPercent = 100 / cardsToShow;

  return (
    <section className="w-full bg-white py-10 sm:py-12 md:py-16 overflow-hidden select-none">
      <div className="max-w-350 mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black tracking-wide uppercase leading-tight">
            OUR HAPPY CUSTOMERS
          </h2>

          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handlePrev}
              className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative w-full">
          {/* Left fade — only show when there are cards overflowing left */}
          {cardsToShow >= 3 && (
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 lg:w-40 bg-linear-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          )}
          {/* Right fade */}
          {cardsToShow >= 3 && (
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 lg:w-40 bg-linear-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
          )}

          {/* Track */}
          <div className="overflow-hidden py-2">
            <div
              className="flex gap-4 sm:gap-5 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
              }}
            >
              {testimonials.map((item, index) => {
                const relativeIndex = index - currentIndex;
                // Fade first & last visible cards only when showing 3+
                const isEdgeCard =
                  cardsToShow >= 3 &&
                  (relativeIndex === 0 || relativeIndex === cardsToShow - 1);

                return (
                  <div
                    key={item.id}
                    className={`shrink-0 border border-black/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 bg-white transition-opacity duration-500 flex flex-col ${
                      isEdgeCard ? "opacity-40" : "opacity-100"
                    }`}
                    style={{
                      width: `calc(${cardWidthPercent}% - ${
                        (gap * (cardsToShow - 1)) / cardsToShow
                      }px)`,
                      minWidth: `calc(${cardWidthPercent}% - ${
                        (gap * (cardsToShow - 1)) / cardsToShow
                      }px)`,
                    }}
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FFC633] text-[#FFC633]"
                        />
                      ))}
                    </div>

                    {/* Name + Badge */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <h3 className="font-heading font-bold text-base sm:text-lg md:text-xl text-black">
                        {item.name}
                      </h3>
                      {item.verified && (
                        <BadgeCheck
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0"
                          fill="#01AB31"
                        />
                      )}
                    </div>

                    {/* Comment */}
                    <p className="font-body text-black/60 text-xs sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">
                      "{item.comment}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
