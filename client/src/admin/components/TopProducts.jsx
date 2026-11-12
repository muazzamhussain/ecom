import { ImageIcon } from "lucide-react";

const money = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

const TopProducts = ({ products = [], onViewAll }) => {
  const maxSold = Math.max(1, ...products.map((p) => Number(p.soldCount || 0)));

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg uppercase">
            Top Products
          </h3>
          <p className="font-body text-xs text-black/50 mt-1">
            Best sellers by units sold
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold underline cursor-pointer shrink-0"
          >
            View all
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <p className="font-body text-sm text-black/50 my-auto text-center py-10">
          No sales recorded yet.
        </p>
      ) : (
        <ul className="space-y-5">
          {products.map((product) => {
            const sold = Number(product.soldCount || 0);
            const image = product.images?.[0]?.url;

            return (
              <li key={product._id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0 rounded-xl bg-[#F0F0F0] flex items-center justify-center overflow-hidden text-black/30">
                  <ImageIcon className="w-5 h-5" />
                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-semibold text-black">
                    {product.name}
                  </p>
                  <p className="truncate font-body text-xs text-black/50">
                    {product.category} at {money(product.salePrice)}
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-[#F0F0F0]">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: `${(sold / maxSold) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-body text-sm font-bold">
                    {sold.toLocaleString()}
                  </p>
                  <p className="font-body text-[11px] text-black/40">sold</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TopProducts;
