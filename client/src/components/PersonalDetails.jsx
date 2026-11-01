import { Edit2, MapPin } from "lucide-react";
import { useAuth } from "../context/authContext";

const PersonalDetails = () => {
  const { user } = useAuth();

  const defaultAddress = user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0];
  const formattedAddress = defaultAddress
    ? [defaultAddress.street, defaultAddress.city, defaultAddress.state, defaultAddress.zipCode, defaultAddress.country]
        .filter(Boolean)
        .join(", ")
    : "No address added yet";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Profile Details Card */}
      <div className="border border-black/10 rounded-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-body font-bold text-xl sm:text-2xl uppercase">
            Personal Details
          </h2>
          <button className="flex items-center gap-2 text-black/60 hover:text-black font-body text-sm transition-colors cursor-pointer">
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="font-body text-sm text-black/60 mb-1">Full Name</p>
            <p className="font-body font-medium text-black">{user?.name || "N/A"}</p>
          </div>
          <div>
            <p className="font-body text-sm text-black/60 mb-1">
              Email Address
            </p>
            <p className="font-body font-medium text-black">{user?.email || "N/A"}</p>
          </div>
          <div>
            <p className="font-body text-sm text-black/60 mb-1">Role</p>
            <p className="font-body font-medium capitalize text-black">{user?.role || "Customer"}</p>
          </div>
          <div>
            <p className="font-body text-sm text-black/60 mb-1">Password</p>
            <p className="font-body font-medium text-black">********</p>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="border border-black/10 rounded-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-body font-bold text-xl sm:text-2xl uppercase">
            Shipping Address
          </h2>
          <button className="flex items-center gap-2 text-black/60 hover:text-black font-body text-sm transition-colors cursor-pointer">
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-black" />
          </div>
          <div>
            <p className="font-body font-bold text-base mb-1">
              Default Address
            </p>
            <p className="font-body text-sm text-black/60 leading-relaxed max-w-sm">
              {formattedAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
