import React, { useContext } from "react";
import "./SingleConversationDoctorPage.css";
import SingleConversationDoctor from "../components/SingleConversationDoctor/SingleConversationDoctor";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const SingleConversationDoctorPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="main-page-container">
      <Navbar></Navbar>

      <SingleConversationDoctor />
    </div>
  );
};

export default SingleConversationDoctorPage;
