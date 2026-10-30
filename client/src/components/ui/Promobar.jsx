import React from "react";

const Promobar = () => {
  return (
    <div className="h-8 flex items-center justify-center bg-black text-white font-extralight md:text-sm text-[10px]">
      <p>
        Sign up and get 20% off to your first order.{" "}
        <a
          href="/sign-up"
          className="underline underline-offset-5 decoration-1 font-semibold"
        >
          Sign Up Now
        </a>
      </p>
    </div>
  );
};

export default Promobar;
