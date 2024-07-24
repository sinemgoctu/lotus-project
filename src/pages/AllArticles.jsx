import React from "react";
import "./AllArticles.css";
import Articles from "../components/Makaleler/Articles";
import Navbar from "../components/Navbar";

const AllArticles = () => {
  return (
    <div className="all-articles-container">
      <Navbar></Navbar>
      <div className="all-articles-content">
        <Articles />
      </div>
    </div>
  );
};

export default AllArticles;
