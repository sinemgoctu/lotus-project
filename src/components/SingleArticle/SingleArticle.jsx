import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleArticle.css";

const SingleArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultImage =
    "https://img.freepik.com/premium-vector/vector-mom-baby-concept-illustration-mother-s-day_594654-79.jpg";

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/articles/${id}`
        );
        if (!response.ok) {
          throw new Error("Article not found");
        }
        const data = await response.json();
        setArticle(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formattedContent = article.contentText
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  return (
    <div className="single-article-container">
      <div className="single-article-image-container">
        <img
          src={article.image || defaultImage}
          alt="Article"
          className="single-article-image"
        />
      </div>
      <h1 className="single-article-title">{article.title}</h1>
      <p className="single-article-meta">
        Yazar: {article.writers}
        <br></br>
        Yayınlanma Tarihi: {new Date(
          article.releaseDate
        ).toLocaleDateString()},{" "}
        {new Date(article.releaseDate).toLocaleTimeString()}
      </p>
      <div
        className="single-article-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      ></div>
    </div>
  );
};

export default SingleArticle;
