import { Trash, Minus, Plus } from "lucide-react";

const CartProductsList = () => {
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
        <div className="product flex gap-x-8 border-b py-3 border-gray-300 my-3" key={index}>
          <img src={product.image} alt="" className="w-30 h-30 rounded-xl" />
          <div className="text flex-2">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-xs">{product.rating}</p>
            <p>{product.price}</p>
            <p>{product.discountPrice}</p>
            {/* Divider */}
          </div>
          <div className="actions flex items-center flex-col gap-10">
            <Trash color="#f50004" className="cursor-pointer" />
            <div className="flex gap-5 rounded-2xl bg-gray-100 items-baseline px-2 text-xl ">
              <Minus size={15} className="cursor-pointer hover:bg-gray-100" />
              1
              <Plus size={15} className="cursor-pointer hover:bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartProductsList;
