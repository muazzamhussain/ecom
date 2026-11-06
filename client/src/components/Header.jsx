import React from "react";
import Promobar from "./ui/Promobar";
import Navbar from "./ui/Navbar";
import { useAuth } from "../context/authContext";

const Header = () => {
  const { user } = useAuth();
  return (
    <div>
      {!user && <Promobar />}

      <Navbar />
    </div>
  );
};

export default Header;
