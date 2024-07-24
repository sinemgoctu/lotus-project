import "./PodcastItem.css";

function PodcastItem({ podcast }) {
  const { podcastImage, podcastTitle } = podcast;
  const defaultImage =
    "https://static.vecteezy.com/system/resources/previews/002/779/424/original/people-recording-podcast-in-studio-flat-illustration-podcaster-talking-to-microphone-recording-podcast-in-studio-radio-host-with-table-flat-illustration-vector.jpg";

  return (
    <div className="podcast-item">
      <div className="podcast-image">
        <img src={podcastImage || defaultImage} />
      </div>
      <div className="podcast-info">
        <a href="#podcastTitle">{podcastTitle}</a>

        <br></br>
      </div>
    </div>
  );
}

export default PodcastItem;
