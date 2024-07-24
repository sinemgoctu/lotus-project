import React, { useEffect, useState } from "react";
import MPPodcastItem from "./MPPodcastItem";
import "./MPPodcasts.css";
import { Link } from "react-router-dom";

function MPPodcasts() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/filter/PodcastFilterAndGetAllPodcasts"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const sortedPodcasts = data.sort(
          (a, b) => new Date(b.releaseTime) - new Date(a.releaseTime)
        );

        const latestPodcasts = sortedPodcasts.slice(0, 7);

        const formattedData = latestPodcasts.map((podcast) => ({
          podcastId: podcast.id,
          podcastImage: podcast.image,
          podcastTitle: podcast.title,
        }));

        setPodcasts(formattedData);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="mppodcast-wrapper">
      <div className="mppodcasts-header">
        <h2>Son Yüklenen Podcastler</h2>
        <Link to="/allpodcasts">Tümünü Gör</Link>
      </div>
      <div className="mppodcasts">
        {podcasts.map((podcast) => (
          <Link
            key={podcast.podcastId}
            to={`/podcast/${podcast.podcastId}`}
            style={{ textDecoration: "none" }}
            className="podcast-link"
          >
            <MPPodcastItem podcast={podcast} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MPPodcasts;
