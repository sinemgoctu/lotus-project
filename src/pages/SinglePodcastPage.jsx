import React, { useContext } from "react";
import "./SingleArticlePage.css";
import SinglePodcast from "../components/SinglePodcast/SinglePodcast";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const SinglePodcastPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="main-page-container">
      <Navbar></Navbar>

      <SinglePodcast />
    </div>
  );
};

export default SinglePodcastPage;
