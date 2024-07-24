import "./ForumQuestionItem.css";

function ForumQuestionItem({ question }) {
  const { questionTitle } = question;

  return (
    <div className="forum-question-item">
      <div className="forum-question-info">
        <a href="#forum-questionTitle">{questionTitle}</a>

        <br></br>
      </div>
    </div>
  );
}

export default ForumQuestionItem;
