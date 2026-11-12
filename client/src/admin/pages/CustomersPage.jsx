import { useMemo, useState } from "react";
import { Ban, Loader2, Mail, Trash2, UserCheck } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const FILTERS = [
  ["all", "All"],
  ["active", "Active"],
  ["blocked", "Blocked"],
];

const CONFIRM_COPY = {
  block: (customer) => ({
    title: "Block Customer",
    message: `Block ${customer.name}? They won't be able to sign in or place orders until you unblock them.`,
    confirmText: "Block",
  }),
  delete: (customer) => ({
    title: "Delete Customer",
    message: `Delete ${customer.name}? This action cannot be undone. Customers with orders can't be deleted, so block them instead.`,
    confirmText: "Delete",
  }),
};

const money = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const CustomersPage = ({
  customers = [],
  loading = false,
  searchValue = "",
  onToggleBlock,
  onDelete,
}) => {
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null); // { action: "block" | "delete", customer }
  const [busy, setBusy] = useState(false);

  const blockedCount = useMemo(
    () => customers.filter((c) => c.isBlocked).length,
    [customers],
  );

  const visible = useMemo(() => {
    const words = searchValue.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return customers.filter((c) => {
      if (filter === "active" && c.isBlocked) return false;
      if (filter === "blocked" && !c.isBlocked) return false;

      const text = `${c.name} ${c.email} ${c.phone ?? ""}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [customers, filter, searchValue]);

  // Errors are already shown as toasts by the parent.
  const handleBlockClick = (customer) =>
    customer.isBlocked
      ? onToggleBlock(customer).catch(() => {})
      : setConfirm({ action: "block", customer });

  const runConfirm = async () => {
    if (!confirm || busy) return;

    setBusy(true);

    try {
      if (confirm.action === "delete") await onDelete(confirm.customer);
      else await onToggleBlock(confirm.customer);

      setConfirm(null);
    } catch {
      // keep the dialog open so the admin can retry or cancel
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
    );
  }

  const copy = confirm ? CONFIRM_COPY[confirm.action](confirm.customer) : {};

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
            Customers
          </h1>
          <p className="font-body text-sm text-black/60 mt-1">
            {customers.length} customers, {blockedCount} blocked
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter customers"
          className="flex gap-1 p-1 bg-[#F0F0F0] rounded-full self-start"
        >
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              onClick={() => setFilter(id)}
              className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-colors cursor-pointer ${
                filter === id
                  ? "bg-black text-white"
                  : "text-black/60 hover:text-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-2xl py-16 text-center font-body text-sm text-black/50">
          {customers.length === 0
            ? "No customers have signed up yet."
            : "No customers match your search or filter."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((c) => (
            <div
              key={c._id}
              className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 ${
                c.isBlocked ? "border-red-200" : "border-black/10"
              }`}
            >
              <div className="flex gap-4 items-center">
                <div
                  className={`w-14 h-14 rounded-full text-white flex items-center justify-center font-body text-xl shrink-0 ${
                    c.isBlocked ? "bg-black/30" : "bg-black"
                  }`}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-body font-bold text-base truncate">
                      {c.name}
                    </p>
                    {c.isBlocked && (
                      <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 font-body text-[11px] font-semibold text-red-700">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-black/60 truncate">
                    {c.email}
                  </p>
                  {c.phone && (
                    <p className="font-body text-xs text-black/60 truncate">
                      {c.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl bg-[#F9F9F9] p-3">
                <div>
                  <p className="font-body text-[11px] text-black/50">Orders</p>
                  <p className="font-body text-sm font-bold">{c.orders}</p>
                </div>
                <div>
                  <p className="font-body text-[11px] text-black/50">Spent</p>
                  <p className="font-body text-sm font-bold wrap-break-words">
                    {money(c.spent)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-[11px] text-black/50">Joined</p>
                  <p className="font-body text-sm font-bold">
                    {formatDate(c.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${c.email}`}
                  title="Send email"
                  aria-label={`Email ${c.name}`}
                  className="w-10 h-10 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleBlockClick(c)}
                  className={`h-10 px-4 rounded-full font-body text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    c.isBlocked
                      ? "bg-black text-white hover:bg-black/80"
                      : "bg-[#F0F0F0] hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  {c.isBlocked ? (
                    <UserCheck className="w-4 h-4" />
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                  {c.isBlocked ? "Unblock" : "Block"}
                </button>

                <button
                  type="button"
                  title="Delete customer"
                  aria-label={`Delete ${c.name}`}
                  onClick={() => setConfirm({ action: "delete", customer: c })}
                  className="ml-auto w-10 h-10 rounded-full bg-[#F0F0F0] hover:bg-red-600 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirm)}
        title={copy.title}
        message={copy.message}
        confirmText={busy ? "Working..." : copy.confirmText}
        onConfirm={runConfirm}
        onCancel={() => {
          if (!busy) setConfirm(null);
        }}
      />
    </div>
  );
};

export default CustomersPage;
