import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import API from "../lib/api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/newsletter/subscribe", {
        email: email.trim(),
      });

      const successMessage =
        response.data?.message || "Successfully subscribed!";

      setMessage(successMessage);
      toast.success(successMessage);

      setEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 font-body">
      <div className="flex flex-col items-center justify-between gap-6 rounded-[20px] bg-black px-6 py-9 md:flex-row md:px-16 md:py-10">
        <h2 className="font-heading uppercase leading-widest text-white md:max-w-137 md:text-4xl">
          STAY UPTO DATE ABOUT OUR LATEST OFFERS
        </h2>

        <form
          onSubmit={handleSubscribe}
          className="flex w-full flex-col gap-3.5 sm:max-w-87"
        >
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-5 w-5 text-black/40" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
              className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-sm font-body text-black placeholder-black/40 outline-none transition-all focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-3 text-sm font-medium font-body text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe to Newsletter"}
          </button>

          {message && <p className="text-sm text-white">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
