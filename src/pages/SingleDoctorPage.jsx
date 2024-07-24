import React, { useContext } from "react";
import "./SingleDoctorPage.css";
import SingleDoctor from "../components/SingleDoctor/SingleDoctor";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const SingleDoctorPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="main-page-container">
      <Navbar></Navbar>
      <br></br>
      <SingleDoctor />
    </div>
  );
};

export default SingleDoctorPage;
