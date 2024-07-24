import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
        navigate("/resetpassword");
      } else {
        const data = await response.json();
        setMessage(data.message || "Şifre sıfırlama işlemi başarısız oldu.");
      }
    } catch (error) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="forgot-password-container">
        <div className="forgot-password-box">
          <div className="forgot-password-header"></div>
          <a href="/info-text" className="info-text">
            Lütfen e-posta adresinizi girin.
            <br />
            E-posta adresinize şifrenizi sıfırlamanız
            <br />
            için bir bağlantı göndereceğiz.
          </a>
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="E-posta"
              className="forgot-password-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="forgot-password-button">
              Şifreyi Sıfırla
            </button>
          </form>
          {message && <p className="forgot-password-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
