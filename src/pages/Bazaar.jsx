import React, { useContext } from "react";
import "./Bazaar.css";
import { UserContext } from "../contexts/UserContext";
import Products from "../components/Products/Products";
import Navbar from "../components/Navbar";

const Bazaar = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="bazaar-container">
      <Navbar></Navbar>
      <div className="bazaar-content">
        <Products></Products>
      </div>
    </div>
  );
};

export default Bazaar;
