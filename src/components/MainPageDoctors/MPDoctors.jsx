import React, { useEffect, useState } from "react";
import MPDoctorItem from "./MPDoctorItem";
import "./MPDoctors.css";
import { Link } from "react-router-dom";

function MPDoctors() {
  const [doctors, setDoctors] = useState([]);

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

        const sortedDoctors = data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );

        const latestDoctors = sortedDoctors.slice(0, 7);

        const formattedData = latestDoctors.map((doctor) => ({
          doctorId: doctor.userId,
          doctorImage: doctor.image,
          doctorUsername: doctor.userName,
          doctorSurname: doctor.surname,
        }));

        setDoctors(formattedData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="mpdoctor-wrapper">
      <div className="mpdoctors-header">
        <h2>Yeni Doktorlarımız</h2>
        <Link to="/alldoctors">Tümünü Gör</Link>
      </div>
      <div className="mpdoctors">
        {doctors.map((doctor) => (
          <Link
            key={doctor.doctorId}
            to={`/doctors/${doctor.doctorId}`}
            style={{ textDecoration: "none" }}
            className="doctor-link"
          >
            <MPDoctorItem doctor={doctor} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MPDoctors;
