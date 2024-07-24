import "./ArticleItem.css";

function ArticleItem({ article }) {
  const { articleImage, articleTitle} = article;
  const defaultImage =
    "https://img.freepik.com/premium-vector/vector-mom-baby-concept-illustration-mother-s-day_594654-79.jpg";

  return (
    <div className="article-item">
      <div className="article-image" >
        <img src={articleImage || defaultImage} style={{ height: 190 }}/>
      </div>
      <div className="article-info">
        <a href="#articleTitle">{articleTitle}</a>

        <br></br>
      </div>
    </div>
  );
}

export default ArticleItem;
