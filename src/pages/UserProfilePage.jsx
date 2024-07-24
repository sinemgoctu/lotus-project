import React, { useContext } from "react";
import "./UserProfilePage.css";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";
import UserProfile from "../components/Profile/UserProfile";

const UserProfilePage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="UserProfile-page-container">
      <Navbar></Navbar>
      <div className="UserProfile-page-content">
        <UserProfile></UserProfile>
      </div>
    </div>
  );
};

export default UserProfilePage;
