import React from "react";
import "./AllPodcasts.css";
import Podcasts from "../components/Podcasts/Podcasts";
import Navbar from "../components/Navbar";

const AllPodcasts = () => {
  return (
    <div className="all-podcasts-container">
      <Navbar></Navbar>
      <div className="all-podcasts-content">
        <Podcasts />
      </div>
    </div>
  );
};

export default AllPodcasts;
