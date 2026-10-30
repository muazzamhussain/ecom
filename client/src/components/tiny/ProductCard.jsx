import { Star } from "lucide-react";

const ProductCard = ({ image, title, rating, price, discountPrice }) => {
  return (
    <div>
      <div className="image">
        <img src={image} alt="" />
      </div>
      <div className="text p-4">
        <h3 className="font-semibold text-md font-body">{title}</h3>
        <p className="text-xs flex gap-3 items-center">
          <Star fill="orange" stroke="none" size={20} /> {rating}
        </p>
        <div className="price flex gap-2">
          <h3 className="line-through font-body">{price}</h3>
          <h3 className="text-lg font-bold font-body text-red-600">{discountPrice}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
