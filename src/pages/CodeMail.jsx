import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodeMail.css";
import Navbar from "../components/Navbar";

const CodeMail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/user/code-mail",
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
      <div className="code-mail-container">
        <div className="code-mail-box">
          <div className="code-mail-header"></div>
          <a href="/info-code-text" className="info-code-text">
            Lütfen e-posta adresinizi girin.
            <br />
            E-posta adresinize şifrenizi sıfırlamanız
            <br />
            için bir bağlantı göndereceğiz.
          </a>
          <form className="code-mail-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="E-posta"
              className="code-mail-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="code-mail-button">
              Şifreyi Sıfırla
            </button>
          </form>
          {message && <p className="code-mail-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CodeMail;
