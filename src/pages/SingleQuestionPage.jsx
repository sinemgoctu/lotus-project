import React, { useContext } from "react";
import "./SingleQuestionPage.css";
import SingleQuestion from "../components/SingleQuestion/SingleQuestion";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const SingleQuestionPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);
  return (
    <div className="main-page-container">
      <Navbar></Navbar>

      <SingleQuestion />
    </div>
  );
};

export default SingleQuestionPage;
