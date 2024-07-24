import "./MPPodcastItem.css";

function MPPodcastItem({ podcast }) {
  const { podcastImage, podcastTitle } = podcast;
  const defaultImage =
    "https://static.vecteezy.com/system/resources/previews/002/779/424/original/people-recording-podcast-in-studio-flat-illustration-podcaster-talking-to-microphone-recording-podcast-in-studio-radio-host-with-table-flat-illustration-vector.jpg";

  return (
    <div className="mppodcast-item">
      <div className="mppodcast-image">
        <img src={podcastImage || defaultImage} alt={podcastTitle} />
      </div>
      <div className="mppodcast-info">
        <h3>{podcastTitle}</h3>
      </div>
    </div>
  );
}

export default MPPodcastItem;
