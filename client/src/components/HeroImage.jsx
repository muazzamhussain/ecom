import React from "react";

const HeroImage = () => {
  return (
    <div className="md:hidden h-70">
      <img
        src="hero.png"
        alt="hero-image"
        className="object-cover object-right h-full"
      />
    </div>
  );
};

export default HeroImage;
