import React, { useEffect, useState } from "react";
import DoctorItem from "../Doctors/DoctorItem";
import "./Doctors.css";
import { Link } from "react-router-dom";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortingMethod, setSortingMethod] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/filter/DoctorFilterAndGetAllDoctor"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const formattedData = data.map((doctor) => ({
          id: doctor.userId,
          doctorImage: doctor.image,
          doctorUsername: doctor.userName,
          doctorSurname: doctor.surname,
          doctorDes: doctor.information,
          doctorCategoryId: doctor.doctorCategoryId,
        }));
        setDoctors(formattedData);
        setFilteredDoctors(formattedData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/doctorCategories"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchDoctors();
    fetchCategories();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find(
      (category) => category.doctorCategoryId === id
    );
    return category ? category.doctorCategoryName : "Unknown";
  };

  const handleSearchAndFilter = async () => {
    let filteredData = doctors;

    if (searchTerm.trim()) {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/search/doctorSearch?title=${searchTerm}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        filteredData = data.map((doctor) => ({
          id: doctor.userId,
          doctorImage: doctor.image,
          doctorUsername: doctor.userName,
          doctorSurname: doctor.surname,
          doctorDes: doctor.information,
          doctorCategoryId: doctor.doctorCategoryId,
        }));
      } catch (error) {
        console.error("Error fetching search results:", error);
        return;
      }
    }

    filteredData = filteredData.filter((doctor) => {
      return (
        filter === "All" || getCategoryName(doctor.doctorCategoryId) === filter
      );
    });

    switch (sortingMethod) {
      case "Alfabetik Sırala (A-Z)":
        filteredData.sort((a, b) =>
          a.doctorUsername.localeCompare(b.doctorUsername)
        );
        break;
      case "Alfabetik Sırala (Z-A)":
        filteredData.sort((a, b) =>
          b.doctorUsername.localeCompare(a.doctorUsername)
        );
        break;
      default:
        break;
    }

    setFilteredDoctors(filteredData);
  };

  return (
    <div className="doctor-wrapper">
      <div className="doctors-header">
        <h1>Doktorlarımız</h1>
        <br></br>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">Tümü</option>
            {categories.map((category) => (
              <option
                key={category.doctorCategoryId}
                value={category.doctorCategoryName}
              >
                {category.doctorCategoryName}
              </option>
            ))}
          </select>
          <select
            value={sortingMethod}
            onChange={(e) => setSortingMethod(e.target.value)}
          >
            <option value="">Sırala</option>
            <option value="Alfabetik Sırala (A-Z)">
              Alfabetik Sırala (A-Z)
            </option>
            <option value="Alfabetik Sırala (Z-A)">
              Alfabetik Sırala (Z-A)
            </option>
          </select>
          <button
            className="doctor-filter-button"
            onClick={handleSearchAndFilter}
          >
            OK
          </button>
        </div>
      </div>
      <br></br>
      <div className="doctors">
        {filteredDoctors.map((doctor) => (
          <Link
            key={doctor.id}
            to={`/doctors/${doctor.id}`}
            style={{ textDecoration: "none" }}
            className="doctor-link"
          >
            <DoctorItem doctor={doctor} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Doctors;
