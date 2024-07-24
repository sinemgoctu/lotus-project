import React, { useContext } from "react";
import "./MainPage.css";
import MPArticles from "../components/MainPageArticles/MPArticles";
import MPPodcasts from "../components/MainPagePodcasts/MPPodcasts";
import MPDoctors from "../components/MainPageDoctors/MPDoctors";
import { UserContext } from "../contexts/UserContext";
import Navbar from "../components/Navbar";

const MainPage = () => {
  const { user } = useContext(UserContext);

  console.log("User data:", user);

  return (
    <div className="main-page-container">
      <Navbar />

      <div className="main-page-content">
        {user ? (
          <div className="user-info">
            <h1>
              Merhaba, {user.userName} {user.surname}
            </h1>
            <br></br>
            <span>
              Bebeğiniz {user.pregnancyStatus}. haftasında böyle görünüyor.
            </span>
            <br></br>
            {user.fetusPicture && (
              <img
                src={user.fetusPicture}
                alt="Fetus"
                className="user-fetus-picture"
              />
            )}
          </div>
        ) : (
          <h1>Hoş Geldiniz!</h1>
        )}
        <MPArticles />
        <MPPodcasts />
        <MPDoctors />
      </div>
    </div>
  );
};

export default MainPage;
