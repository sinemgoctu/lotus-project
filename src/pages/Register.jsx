import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    const userData = {
      email,
      userName,
      surname,
      password,
    };

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/authentication/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error("Registration failed");
        }
        console.error("Server response:", errorData);
        throw new Error(errorData.message || "Registration failed");
      }

      console.log("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <img src="/lotus_resim.png" className="logo" alt="Logo" />
          <h2>Kaydol</h2>
        </div>
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="E-posta"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ad"
            className="register-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Soyad"
            className="register-input"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="register-button">
            Kaydol
          </button>

          <div className="register-options"></div>
        </form>
        <p className="signin-text">
          Hesabınız Var Mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
