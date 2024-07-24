import "./MPArticleItem.css";

function MPArticleItem({ article }) {
  const { articleImage, articleTitle } = article;
  const defaultImage =
    "https://img.freepik.com/premium-vector/vector-mom-baby-concept-illustration-mother-s-day_594654-79.jpg";

  return (
    <div className="mparticle-item">
      <div className="mparticle-image">
        <img
          src={articleImage || defaultImage}
          alt={articleTitle}
          style={{ height: 190 }}
        />
      </div>
      <div className="mparticle-info">
        <h3>{articleTitle}</h3>
      </div>
    </div>
  );
}

export default MPArticleItem;
