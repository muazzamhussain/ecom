import React from "react";
import { ShoppingBag } from "lucide-react";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <section className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
      {/* LEFT — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F2F0F1] relative overflow-hidden items-center justify-center p-10">
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>

          <h1 className="font-heading text-5xl xl:text-6xl uppercase text-black tracking-tight mb-5">
            ECOM
          </h1>

          <p className="font-body text-black/60 text-base leading-relaxed">
            Discover the latest trends in fashion. From casual wear to elegant
            dresses — find pieces that match your unique style.
          </p>

          <div className="flex items-center justify-center gap-6 xl:gap-8 mt-10 pt-10 border-t border-black/10">
            {[
              ["200+", "Brands"],
              ["2,000+", "Products"],
              ["30,000+", "Customers"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-heading text-2xl xl:text-3xl text-black">
                  {num}
                </p>
                <p className="font-body text-xs text-black/60 uppercase tracking-wider">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/5 blur-3xl" />
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14">
        <div className="w-full max-w-md">
          <h1 className="lg:hidden font-heading text-3xl uppercase text-black tracking-tight text-center mb-8">
            Shop.co
          </h1>

          <h2 className="font-heading text-2xl sm:text-4xl uppercase text-black tracking-tight mb-2">
            {title}
          </h2>
          <p className="font-body text-sm sm:text-base text-black/60 mb-8">
            {subtitle}
          </p>

          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;