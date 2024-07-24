import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const credentials = {
      email,
      password,
    };

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/authentication/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();
      console.log("Login successful:", result);

      await login(result);

      navigate("/getinfo");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/lotus_resim.png" className="logo" alt="Logo" />
          <h2>Giriş</h2>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="E-posta"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
          <br></br>

          <div className="login-options">
            <Link to="/forgotpassword" className="forgot-password">
              Şifremi Unuttum
            </Link>
          </div>
        </form>
        <p className="signup-text">
          Hesabınız Yok Mu? <Link to="/register">Kaydol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
