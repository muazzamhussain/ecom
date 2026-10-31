import { Trash, Minus, Plus } from "lucide-react";
import { useState } from "react";

const CartProductsList = () => {
  const [qty,setQty] = useState(1)
  const products = [
    {
      title: "T-shirt with Tape Details",
      image: "shirt.png",
      rating: "4.5/5",
      price: 120,
      discountPrice: null,
    },
    {
      title: "Skinny Fit Jeans",
      image: "jeans.png",
      rating: "3.5/5",
      price: 260,
      discountPrice: 240,
    },
    {
      title: "Checkered Shirt",
      image: "check-shirt.png",
      rating: "4.5/5",
      price: 180,
      discountPrice: null,
    },
    {
      title: "Sleeve Striped T-shirt",
      image: "striped-shirt.png",
      rating: "4.5/5",
      price: 160,
      discountPrice: 130,
    },
  ];

  return (
    <div className="px-6 ml-20 w-170 border-2 rounded-2xl border-gray-200">
      {products.map((product, index) => (
        <div
          className="product flex gap-x-8 border-b py-3 border-gray-300 my-3"
          key={index}
        >
          <img src={product.image} alt="" className="w-30 h-30 rounded-xl" />
          <div className="text flex-2">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-xs">{product.rating}</p>
            <p>{product.price}</p>
            <p>{product.discountPrice}</p>
            {/* Divider */}
          </div>
          <div className="actions flex items-center flex-col gap-10">
            <Trash color="#d50004" className="cursor-pointer" />
            <div className="bg-[#F0F0F0] rounded-full flex items-center justify-between px-5 w-32 shrink-0">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2 cursor-pointer text-black"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-body font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="p-2 cursor-pointer text-black"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartProductsList;
