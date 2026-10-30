import React from "react";
import { FaTwitter, FaFacebookSquare } from "react-icons/fa";
import { TbBrandGithubFilled } from "react-icons/tb";
import { AiFillInstagram } from "react-icons/ai";
import Newsletter from "./Newsletter";

const footerLinks = [
  {
    title: "COMPANY",
    links: [
      { name: "About", href: "#" },
      { name: "Features", href: "#" },
      { name: "Works", href: "#" },
      { name: "Career", href: "#" },
    ],
  },
  {
    title: "HELP",
    links: [
      { name: "Customer Support", href: "#" },
      { name: "Delivery Details", href: "#" },
      { name: "Terms & Conditions", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
  {
    title: "FAQ",
    links: [
      { name: "Account", href: "#" },
      { name: "Manage Deliveries", href: "#" },
      { name: "Orders", href: "#" },
      { name: "Payments", href: "#" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { name: "Free eBooks", href: "#" },
      { name: "Development Tutorial", href: "#" },
      { name: "How to - Blog", href: "#" },
      { name: "Youtube Playlist", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-6 pb-8 font-body text-black/60">
      <Newsletter />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:py-4 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand Info Column */}
          <div className="md:col-span-1 lg:col-span-1">
            <h2 className="font-heading mb-4 text-3xl font-bold uppercase tracking-winder text-black">
              ECOM
            </h2>
            <p className="font-body mb-6 text-sm leading-relaxed text-black/60 max-w-62">
              We have clothes that suits your style and which you’re proud to
              wear. From women to men.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-black transition-colors hover:bg-black hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter className="h-3.5 w-3.5 fill-current stroke-none" />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-black transition-colors hover:bg-black hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookSquare className="h-3.5 w-3.5 fill-current stroke-none" />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-black transition-colors hover:bg-black hover:text-white"
                aria-label="Instagram"
              >
                <AiFillInstagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-black transition-colors hover:bg-black hover:text-white"
                aria-label="GitHub"
              >
                <TbBrandGithubFilled className="h-3.5 w-3.5 fill-current stroke-none" />
              </a>
            </div>
          </div>

          {/* Links Columns Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 md:col-span-4 md:grid-cols-4">
            {footerLinks.map((section, idx) => (
              <div key={idx}>
                <h3 className="font-heading mb-4 text-xs md:text-sm font-normal tracking-[1px] text-black uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-xs md:text-sm">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="font-body text-black/60 transition-colors hover:text-black tracking-wide"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-300/70" />

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-body text-xs md:text-sm text-black/60">
            Shop.co © 2000-2023, All Rights Reserved
          </p>

          {/* Payment Gateway Badges */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-12 items-center justify-center rounded bg-white shadow-sm border border-gray-200">
              <span className="text-[11px] font-extrabold italic text-blue-800">
                VISA
              </span>
            </div>
            <div className="flex h-7 w-12 items-center justify-center rounded bg-white shadow-sm border border-gray-200">
              <div className="flex -space-x-1">
                <span className="h-3.5 w-3.5 rounded-full bg-red-500 inline-block opacity-90" />
                <span className="h-3.5 w-3.5 rounded-full bg-yellow-500 inline-block opacity-90" />
              </div>
            </div>
            <div className="flex h-7 w-12 items-center justify-center rounded bg-white shadow-sm border border-gray-200">
              <span className="text-[10px] font-bold italic text-blue-600">
                PayPal
              </span>
            </div>
            <div className="flex h-7 w-12 items-center justify-center rounded bg-white shadow-sm border border-gray-200">
              <span className="text-[10px] font-semibold text-black">Pay</span>
            </div>
            <div className="flex h-7 w-12 items-center justify-center rounded bg-white shadow-sm border border-gray-200">
              <span className="text-[10px] font-bold text-gray-700">G Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
