import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

const ICONS = {
  Revenue: Wallet,
  Orders: ShoppingCart,
  Customers: Users,
  Products: Package,
};

const StatCard = ({ label, value, change = null, hint }) => {
  const Icon = ICONS[label];
  const positive = change !== null && change >= 0;

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center">
          {Icon && <Icon className="w-5 h-5" />}
        </div>

        {change !== null && (
          <span
            title="Compared with the previous period"
            className={`flex items-center gap-0.5 font-body text-xs font-semibold ${
              positive ? "text-[#01AB31]" : "text-red-600"
            }`}
          >
            {positive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <p className="font-body text-sm text-black/60 mt-4">{label}</p>
      <p className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-black mt-1 wrap-word-break">
        {value}
      </p>
      {hint && <p className="font-body text-xs text-black/40 mt-1">{hint}</p>}
    </div>
  );
};

export default StatCard;
