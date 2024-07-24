import React, { useContext } from "react";
import "./SingleConversationPage.css";
import SingleConversation from "../components/SingleConversation/SingleConversation";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const SingleConversationPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="main-page-container">
      <Navbar></Navbar>

      <SingleConversation />
    </div>
  );
};

export default SingleConversationPage;
