import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

 const FAQsTab = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const faqs = [
    {
      question: "Is this t-shirt true to size?",
      answer:
        "Yes, our t-shirts run true to size with a slightly relaxed fit. If you prefer a highly oversized look, we recommend sizing up. Please refer to our size chart for exact measurements.",
    },
    {
      question: "How should I wash this graphic tee to prevent fading?",
      answer:
        "To ensure the graphic print lasts as long as possible, we recommend washing the t-shirt inside out in cold water. Tumble dry on low heat or air dry. Do not iron directly on the print.",
    },
    {
      question: "What is your return policy for apparel?",
      answer:
        "We offer a 30-day return policy for all unworn and unwashed apparel with original tags attached. Returns are free for store credit, or a small restocking fee applies to original payment methods.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times are calculated at checkout based on your specific location.",
    },
  ];

  return (
    <div className="animate-in fade-in duration-300 max-w-3xl mx-auto mt-8">
      <h3 className="font-body font-bold text-xl sm:text-2xl text-black mb-6 text-center">
        Frequently Asked Questions
      </h3>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="border border-black/10 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-[#F0F0F0]/50 transition-colors cursor-pointer"
              >
                <span className="font-body font-bold text-base sm:text-lg pr-4 text-black">
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                >
                  <ChevronDown className="w-5 h-5 text-black" />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-50 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 sm:p-6 pt-0 font-body text-sm sm:text-base text-black/60 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQsTab