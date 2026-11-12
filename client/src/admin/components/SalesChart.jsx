const money = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

const dayLabel = (date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const SalesChart = ({ data = [], days = 30 }) => {
  const totalRevenue = data.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = data.reduce((sum, day) => sum + day.orders, 0);
  const max = Math.max(0, ...data.map((day) => day.revenue));

  const ticks = data.length
    ? [data[0], data[Math.floor((data.length - 1) / 2)], data[data.length - 1]]
    : [];

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6 h-full">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg uppercase">
            Sales Overview
          </h3>
          <p className="font-body text-xs text-black/50 mt-1">
            Daily revenue, last {days} days
          </p>
        </div>

        <div className="text-right">
          <p className="font-heading font-black text-xl">
            {money(totalRevenue)}
          </p>
          <p className="font-body text-xs text-black/50">
            {totalOrders.toLocaleString()} orders
          </p>
        </div>
      </div>

      {max === 0 ? (
        <div className="h-56 flex items-center justify-center rounded-xl bg-[#F9F9F9] font-body text-sm text-black/50">
          No sales in this period yet.
        </div>
      ) : (
        <>
          <div className="flex items-end gap-0.5 h-56">
            {data.map((day) => (
              <div
                key={day.date.toISOString()}
                title={`${dayLabel(day.date)}: ${money(day.revenue)} from ${day.orders} orders`}
                className="flex-1 h-full flex items-end"
              >
                <div
                  className={`w-full rounded-t ${
                    day.revenue ? "bg-black hover:bg-black/70" : "bg-black/10"
                  }`}
                  style={{
                    height: day.revenue
                      ? `${Math.max((day.revenue / max) * 100, 3)}%`
                      : "2px",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 font-body text-xs text-black/50">
            {ticks.map((day) => (
              <span key={day.date.toISOString()}>{dayLabel(day.date)}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SalesChart;
