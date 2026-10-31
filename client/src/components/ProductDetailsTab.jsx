import React from "react";
import { Check } from "lucide-react";

const ProductDetailsTab = () => {
  const specs = [
    { label: "Material", value: "100% Premium Heavyweight Cotton" },
    { label: "Fit", value: "Relaxed, slightly oversized fit" },
    { label: "Care", value: "Machine wash cold, tumble dry low" },
    { label: "Origin", value: "Ethically crafted in Portugal" },
  ];

  const features = [
    "Breathable, soft-touch fabric for all-day comfort",
    "Reinforced double-stitched collar and hems",
    "Fade-resistant, high-density graphic print",
    "Pre-shrunk to maintain shape after washing",
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
        {/* Left Column: Description & Specs */}
        <div>
          <h3 className="font-body font-bold text-xl sm:text-2xl text-black mb-4">
            About this product
          </h3>
          <p className="font-body text-black/60 text-sm sm:text-base leading-relaxed mb-8">
            Elevate your everyday wardrobe with the One Life Graphic T-Shirt.
            Meticulously crafted from heavyweight, ultra-soft cotton, it offers
            a premium feel and a relaxed drape that flatters any body type. The
            bold typography is printed using eco-friendly, fade-resistant inks,
            ensuring your statement piece lasts season after season.
          </p>

          <div className="space-y-4">
            {specs.map((spec, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-black/10 pb-4"
              >
                <span className="font-body font-bold text-black sm:w-24 shrink-0">
                  {spec.label}
                </span>
                <span className="font-body text-black/60 text-sm">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Features */}
        <div className="bg-[#F0F0F0]/50 rounded-2xl p-6 sm:p-8 border border-black/5 h-fit">
          <h3 className="font-body font-bold text-xl sm:text-2xl text-black mb-6">
            Key Features
          </h3>
          <ul className="space-y-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-body text-black/70 text-sm sm:text-base leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsTab;
