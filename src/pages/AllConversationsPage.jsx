import React, { useContext } from "react";
import "./AllConversationsPage.css";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

import AllConversations from "../components/AllConversations/AllConversations";

const AllConversationsPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="all-convo-page-container">
      <Navbar></Navbar>
      <div className="all-convo-page-content">
        <AllConversations></AllConversations>
      </div>
    </div>
  );
};

export default AllConversationsPage;
