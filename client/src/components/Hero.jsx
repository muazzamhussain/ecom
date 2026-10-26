const Hero = () => {
  return (
    <div className="md:h-160 md:bg-[url('hero.png')] md:p-25 md:bg-position-[80%_center] bg-gray">
      <h1 className="font-heading md:text-7xl font-bold tracking-wide md:w-200 text-2xl w-70 pt-15 md:pt-0 px-4">
        FIND CLOTHES THAT MATCHES YOUR STYLE
      </h1>
      <p className="font-body opacity-80 md:w-170 pt-5 px-4 text-sm">
        Browse through our diverse range of meticulously crafted garments,
        designed to bring out your individuality and cater to your sense of
        style.
      </p>
      <button className="bg-black rounded-full text-white py-2 md:px-16 font-body mt-5 cursor-pointer ml-4 px-25 text-sm md:text-md">
        Shop Now
      </button>

      <div className="numbers md:mt-20 mt-10 flex md:gap-20 p-4 gap-10 w-80 flex-wrap md:flex-nowrap justify-center md:justify-normal">
        <div className="brands">
          <h2 className="md:text-5xl font-bold text-lg text-center">200+</h2>
          <p className="font-body opacity-50 pt-2 md:font-semibold text-xs">
            International Brands
          </p>
        </div>
        <div className="brands">
          <h2 className="md:text-5xl font-bold text-lg text-center">2000+</h2>
          <p className="font-body opacity-50 pt-2 md:font-semibold text-xs">
            High Quality Products
          </p>
        </div>
        <div className="brands">
          <h2 className="md:text-5xl font-bold text-lg text-center">3000+</h2>
          <p className="font-body opacity-50 pt-2 md:font-semibold text-xs">
            Happy Customers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
