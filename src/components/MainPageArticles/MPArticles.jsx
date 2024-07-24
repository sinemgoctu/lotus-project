import React, { useEffect, useState } from "react";
import MPArticleItem from "./MPArticleItem";
import "./MPArticles.css";
import { Link } from "react-router-dom";

function MPArticles() {
  const [articles, setArticles] = useState([]);

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

        const sortedArticles = data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );

        const latestArticles = sortedArticles.slice(0, 7);

        const formattedData = latestArticles.map((article) => ({
          articleId: article.id,
          articleImage: article.image,
          articleTitle: article.title,
          articleDes: article.contentText,
        }));

        setArticles(formattedData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="mparticle-wrapper">
      <div className="mparticles-header">
        <h2>Son Yüklenen Makaleler</h2>
        <Link to="/allarticles">Tümünü Gör</Link>
      </div>
      <div className="mparticles">
        {articles.map((article) => (
          <Link
            key={article.articleId}
            to={`/articles/${article.articleId}`}
            style={{ textDecoration: "none" }}
            className="mparticle-link"
          >
            <MPArticleItem article={article} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MPArticles;
