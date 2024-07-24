import React, { useEffect, useState } from "react";
import ArticleItem from "../Makaleler/ArticleItem";
import "./Articles.css";
import { Link } from "react-router-dom";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortingMethod, setSortingMethod] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/filter/ArticleFilterAndGetAllArticles"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const formattedData = data.map((article) => ({
          id: article.id,
          articleImage: article.image,
          articleTitle: article.title,
          articleDes: article.contentText,
          articleCategoryId: article.articleCategoryId,
        }));
        setArticles(formattedData);
        setFilteredArticles(formattedData);
      } catch (error) {
        console.error("Error fetching articles:", error);
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

    fetchArticles();
    fetchCategories();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find(
      (category) => category.articleCategoryId === id
    );
    return category ? category.articleCategoryName : "Unknown";
  };

  const handleSearchAndFilter = () => {
    let filteredData = articles;
    if (searchTerm.trim()) {
      filteredData = articles.filter((article) =>
        article.articleTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filteredData = filteredData.filter((article) => {
      return (
        filter === "All" ||
        getCategoryName(article.articleCategoryId) === filter
      );
    });

    switch (sortingMethod) {
      case "Alfabetik Sırala (A-Z)":
        filteredData.sort((a, b) =>
          a.articleTitle.localeCompare(b.articleTitle)
        );
        break;
      case "Alfabetik Sırala (Z-A)":
        filteredData.sort((a, b) =>
          b.articleTitle.localeCompare(a.articleTitle)
        );
        break;
      case "Tarihe Göre Sırala (Yeni)":
        filteredData.sort(
          (a, b) => new Date(b.articleDate) - new Date(a.articleDate)
        );
        break;
      case "Tarihe Göre Sırala (Eski)":
        filteredData.sort(
          (a, b) => new Date(a.articleDate) - new Date(b.articleDate)
        );
        break;
      default:
        break;
    }

    setFilteredArticles(filteredData);
  };

  return (
    <div className="article-wrapper">
      <div className="articles-header">
        <h1>Makaleler</h1>
        <br />
        <div className="search-filter">
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">Tüm Kategoriler</option>
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
            className="article-filter-button"
            onClick={handleSearchAndFilter}
          >
            OK
          </button>
        </div>
      </div>
      <br />
      <div className="articles">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            style={{ textDecoration: "none" }}
            className="article-link"
          >
            <ArticleItem article={article} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Articles;
