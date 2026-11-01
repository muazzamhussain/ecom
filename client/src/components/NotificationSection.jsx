import SectionHeader from "./ui/SectionHeader";
import Toggle from "./ui/Toggle";
import { Mail, MessageSquare, TrendingDown,Package,Tag,Newspaper } from "lucide-react";

const NotificationsSection = ({ draft, update, setAllNotifications }) => {
  const allOn = Object.values(draft.notifications).every(Boolean);

  const NOTIFICATION_GROUPS = [
    {
      title: "Orders",

      items: [
        {
          key: "orderUpdates",

          label: "Order updates",

          description: "Status changes, shipping and delivery alerts",

          icon: Mail,
        },

        {
          key: "orderSms",

          label: "SMS alerts",

          description: "Text messages for important order events",

          icon: MessageSquare,
        },
      ],
    },

    {
      title: "Shopping",

      items: [
        {
          key: "priceDrops",

          label: "Price drops",

          description: "Know when wishlist items go on sale",

          icon: TrendingDown,
        },

        {
          key: "restock",

          label: "Back in stock",

          description: "Alerts when sold-out items return",

          icon: Package,
        },
      ],
    },

    {
      title: "Marketing",

      items: [
        {
          key: "promotions",

          label: "Promotions & offers",

          description: "Exclusive deals and seasonal discounts",

          icon: Tag,
        },

        {
          key: "newsletter",

          label: "Newsletter",

          description: "Weekly style edits and new arrivals",

          icon: Newspaper,
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <SectionHeader
          title="Notifications"
          description="Decide what you hear from us and how."
        />

        <button
          type="button"
          onClick={() => setAllNotifications(!allOn)}
          className="h-10 px-5 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white font-body text-sm font-medium transition-colors cursor-pointer self-start shrink-0"
        >
          {allOn ? "Turn all off" : "Turn all on"}
        </button>
      </div>

      <div className="space-y-6">
        {NOTIFICATION_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="font-heading font-bold text-xs uppercase tracking-wider text-black/50 mb-2">
              {group.title}
            </p>

            <div>
              {group.items.map((item) => (
                <Toggle
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                  checked={draft.notifications[item.key]}
                  onChange={(v) => update("notifications", item.key, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSection;
