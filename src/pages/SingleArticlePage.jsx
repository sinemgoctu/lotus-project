import React, { useContext } from "react";
import "./SingleArticlePage.css";
import SingleArticle from "../components/SingleArticle/SingleArticle";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const SingleArticlePage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="main-page-container">
      <Navbar></Navbar>

      <SingleArticle />
    </div>
  );
};

export default SingleArticlePage;
