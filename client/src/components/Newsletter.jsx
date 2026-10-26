import React, { useState } from "react";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log("Subscribed with email:", email);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 font-body">
      <div className="flex flex-col items-center justify-between gap-6 rounded-[20px] bg-black px-6 py-9 md:flex-row md:px-16 md:py-10">
        {/* Banner Heading */}
        <h2 className="font-heading uppercase leading-wide text-white md:max-w-137 md:text-4xl">
          STAY UPTO DATE ABOUT OUR LATEST OFFERS
        </h2>

        {/* Form Controls */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3.5 sm:max-w-87"
        >
          {/* Email Input Field */}
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-5 w-5 text-black/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-sm text-black placeholder-black/40 outline-none transition-all focus:ring-2 focus:ring-gray-400 font-body"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200 font-body"
          >
            Subscribe to Newsletter
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;