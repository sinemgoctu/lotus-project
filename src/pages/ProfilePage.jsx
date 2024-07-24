import React, { useContext } from "react";
import "./ProfilePage.css";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile/Profile";

const ProfilePage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="profile-page-container">
      <Navbar></Navbar>
      <div className="profile-page-content">
        <Profile></Profile>
      </div>
    </div>
  );
};

export default ProfilePage;
