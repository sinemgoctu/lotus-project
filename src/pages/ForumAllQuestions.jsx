import React, { useContext } from "react";
import "./ForumAllQuestions.css";
import { UserContext } from "../contexts/UserContext";
import ForumQuestions from "../components/ForumQuestions/ForumQuestions";
import Navbar from "../components/Navbar";

const ForumAllQuestions = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="forum-all-questions-container">
      <Navbar></Navbar>
      <div className="forum-all-questions-content">
        <ForumQuestions></ForumQuestions>
      </div>
    </div>
  );
};

export default ForumAllQuestions;
