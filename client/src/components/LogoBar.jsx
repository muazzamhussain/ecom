const LogoBar = () => {
  return (
      <div className="logos bg-black flex flex-wrap gap-5 justify-center py-3 md:h-35 md:justify-around items-center">
        <img
          src="calvin-klein.png"
          alt=""
          className="object-center w-20 md:w-40 md:h-9 h-6"
        />
        <img
          src="gucci.png"
          alt=""
          className="object-center w-20 md:w-40 md:h-9 h-6"
        />
        <img
          src="versace.png"
          alt=""
          className="object-center w-20 md:w-40 md:h-9 h-6"
        />
        <img
          src="zara.png"
          alt=""
          className="object-center w-20 md:w-40 md:h-9 h-6"
        />
        <img
          src="prada.png"
          alt=""
          className="object-center w-20 md:w-40 md:h-9 h-6"
        />
      </div>
  );
};

export default LogoBar;
