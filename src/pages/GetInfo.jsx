import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./GetInfo.css";
import { UserContext } from "../contexts/UserContext";

const GetInfo = () => {
  const [selectedWeek, setSelectedWeek] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedWeek) {
      await updatePregnancyStatus(selectedWeek);
      navigate("/");
    } else {
      alert("Lütfen bir gün seçiniz.");
    }
  };

  const handleNotPregnantClick = async (event) => {
    event.preventDefault();
    await updatePregnancyStatus("0");
    navigate("/");
  };

  const updatePregnancyStatus = async (status) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const userId = user.id;
    const url = `https://lotusproject.azurewebsites.net/api/user/${userId}`;
    const formData = new FormData();
    formData.append("PregnancyStatus", status);
    formData.append("Username", user.userName || "");
    formData.append("Surname", user.surname || "");
    formData.append("Email", user.email || "");
    formData.append("Image", user.image);

    try {
      const response = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update pregnancy status"
        );
      }

      const updatedUser = { ...user, pregnancyStatus: status };
      setUser(updatedUser);

      console.log("Pregnancy status updated successfully");
    } catch (error) {
      console.error("Error updating pregnancy status:", error);
    }
  };

  return (
    <div className="get-info-container">
      <div className="get-info-box">
        <div className="get-info-header"></div>
        <h1>Hoş Geldiniz</h1>
        <span>
          Deneyiminizi kişiselleştirmek için
          <br />
          lütfen bilgilerinizi giriniz.
          <br />
          <br />
        </span>

        <form className="get-info-form" onSubmit={handleSubmit}>
          <label htmlFor="week">
            Hamileliğinizin kaçıncı haftasında<br></br>
            olduğunuzu seçiniz:
          </label>
          <br />
          <select
            id="week"
            name="week"
            value={selectedWeek}
            onChange={handleWeekChange}
          >
            <option value="">Seçiniz</option>
            {Array.from({ length: 45 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}. hafta
              </option>
            ))}
          </select>
          <br />
          <button type="submit" className="get-info-button">
            OK
          </button>
        </form>
        <br />
        <a
          href="/"
          onClick={handleNotPregnantClick}
          className="not-pregnant-text"
        >
          Hamile Değilim
        </a>
      </div>
    </div>
  );
};

export default GetInfo;
