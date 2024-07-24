import React, { useEffect, useState } from "react";
import PodcastItem from "../Podcasts/PodcastItem";
import "./Podcasts.css";
import { Link } from "react-router-dom";

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortingMethod, setSortingMethod] = useState("");
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);

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
        const formattedData = data.map((podcast) => ({
          id: podcast.id,
          podcastImage: podcast.image,
          podcastTitle: podcast.title,
          podcastDate: podcast.releaseTime,
          podcastCategoryId: podcast.podcastCategoryId,
        }));
        setPodcasts(formattedData);
        setFilteredPodcasts(formattedData);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/articleCategories"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchPodcasts();
    fetchCategories();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find(
      (category) => category.articleCategoryId === id
    );
    return category ? category.articleCategoryName : "Unknown";
  };

  const handleSearchAndFilter = async () => {
    let filteredData = podcasts;

    if (searchTerm.trim()) {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/search/PodcastSearch?title=${searchTerm}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        filteredData = data.map((podcast) => ({
          id: podcast.id,
          podcastImage: podcast.image,
          podcastTitle: podcast.title,
          podcastDate: podcast.releaseTime,
          podcastCategoryId: podcast.podcastCategoryId,
        }));
      } catch (error) {
        console.error("Error fetching search results:", error);
        return;
      }
    }

    filteredData = filteredData.filter((podcast) => {
      return (
        filter === "All" ||
        getCategoryName(podcast.podcastCategoryId) === filter
      );
    });

    switch (sortingMethod) {
      case "Alfabetik Sırala (A-Z)":
        filteredData.sort((a, b) =>
          a.podcastTitle.localeCompare(b.podcastTitle)
        );
        break;
      case "Alfabetik Sırala (Z-A)":
        filteredData.sort((a, b) =>
          b.podcastTitle.localeCompare(a.podcastTitle)
        );
        break;
      case "Tarihe Göre Sırala (Yeni)":
        filteredData.sort(
          (a, b) => new Date(b.podcastDate) - new Date(a.podcastDate)
        );
        break;
      case "Tarihe Göre Sırala (Eski)":
        filteredData.sort(
          (a, b) => new Date(a.podcastDate) - new Date(b.podcastDate)
        );
        break;
      default:
        break;
    }

    setFilteredPodcasts(filteredData);
  };

  return (
    <div className="podcast-wrapper">
      <div className="podcasts-header">
        <h1>Podcastler</h1>
        <br />
        <div className="search-filter">
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">Tümü</option>
            {categories.map((category) => (
              <option
                key={category.articleCategoryId}
                value={category.articleCategoryName}
              >
                {category.articleCategoryName}
              </option>
            ))}
          </select>
          <select
            value={sortingMethod}
            onChange={(e) => setSortingMethod(e.target.value)}
          >
            <option value="">Sırala</option>
            <option value="Alfabetik Sırala (A-Z)">
              Alfabetik Sırala (A-Z)
            </option>
            <option value="Alfabetik Sırala (Z-A)">
              Alfabetik Sırala (Z-A)
            </option>
            <option value="Tarihe Göre Sırala (Yeni)">
              Tarihe Göre Sırala (Yeni)
            </option>
            <option value="Tarihe Göre Sırala (Eski)">
              Tarihe Göre Sırala (Eski)
            </option>
          </select>
          <button
            className="podcast-filter-button"
            onClick={handleSearchAndFilter}
          >
            OK
          </button>
        </div>
      </div>
      <br />
      <div className="podcasts">
        {filteredPodcasts.map((podcast) => (
          <div key={podcast.id} className="podcast-item-container">
            <Link
              to={`/podcast/${podcast.id}`}
              style={{ textDecoration: "none" }}
              className="podcast-link"
            >
              <PodcastItem podcast={podcast} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Podcasts;
