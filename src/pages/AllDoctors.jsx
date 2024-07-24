import React from "react";
import "./AllDoctors.css";
import Doctors from "../components/Doctors/Doctors";
import Navbar from "../components/Navbar";

const AllDoctors = () => {
  return (
    <div className="all-doctors-container">
      <Navbar></Navbar>
      <div className="all-doctors-content">
        <Doctors />
      </div>
    </div>
  );
};

export default AllDoctors;
