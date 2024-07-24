import React, { useContext } from "react";
import "./SingleProductPage.css";
import SingleProduct from "../components/SingleProduct/SingleProduct";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const SingleProductPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="main-page-container">
      <Navbar></Navbar>

      <SingleProduct />
    </div>
  );
};

export default SingleProductPage;
