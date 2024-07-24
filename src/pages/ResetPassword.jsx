import React, { useState } from "react";
import "./ResetPassword.css";
import Navbar from "../components/Navbar";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code, newPassword }),
        }
      );

      if (response.ok) {
        setMessage(
          "Şifre sıfırlama işlemi başarılı. Yeni şifrenizle giriş yapabilirsiniz."
        );
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

      <div className="reset-password-container">
        <div className="reset-password-box">
          <div className="reset-password-header"></div>
          <a href="/info-text" className="info-text">
            Lütfen e-posta adresinizi, kodunuzu ve yeni şifrenizi girin.
            <br />
          </a>
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="E-posta"
              className="reset-password-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Kod"
              className="reset-password-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Yeni Şifre"
              className="reset-password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="reset-password-button">
              Şifreyi Sıfırla
            </button>
          </form>
          {message && <p className="reset-password-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
