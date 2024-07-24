import "./Navbar.css";
import { UserContext } from "../contexts/UserContext";
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="lotus-container" tabIndex={-1}>
          <img src="/lotus_resim_logo.png" alt="Logo" className="logo-image" />
          <div className="lotus-text">LOTUS</div>
        </div>
        <div className="nav-links">
          <Link
            to="/"
            className={activeLink === "/" ? "active" : ""}
            onClick={() => handleLinkClick("/")}
          >
            Anasayfa
          </Link>
          <Link
            to="/forumallquestions"
            className={activeLink === "/forumallquestions" ? "active" : ""}
            onClick={() => handleLinkClick("/forumallquestions")}
          >
            Forum
          </Link>
          <Link
            to="/allconversations"
            className={activeLink === "/allconversations" ? "active" : ""}
            onClick={() => handleLinkClick("/allconversations")}
          >
            Sohbet
          </Link>
          <Link
            to="/bazaar"
            className={activeLink === "/bazaar" ? "active" : ""}
            onClick={() => handleLinkClick("/bazaar")}
          >
            Pazar
          </Link>
        </div>
        <div className="girisyap">
          {user ? (
            <Link
              to="/profilepage"
              className={activeLink === "/profilepage" ? "active" : ""}
              onClick={() => handleLinkClick("/profilepage")}
              style={{ textDecoration: "none" }}
            >
              Profilim
            </Link>
          ) : (
            <Link
              to="/login"
              className={activeLink === "/login" ? "active" : ""}
              onClick={() => handleLinkClick("/login")}
              style={{ textDecoration: "none" }}
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
