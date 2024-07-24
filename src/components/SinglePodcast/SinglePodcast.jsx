import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./SinglePodcast.css";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";

const SinglePodcast = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const defaultImage =
    "https://static.vecteezy.com/system/resources/previews/002/779/424/original/people-recording-podcast-in-studio-flat-illustration-podcaster-talking-to-microphone-recording-podcast-in-studio-radio-host-with-table-flat-illustration-vector.jpg";

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/podcast/${id}`
        );
        if (!response.ok) {
          throw new Error("Podcast not found");
        }
        const data = await response.json();
        setPodcast(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handlePlay = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Error attempting to play audio:", error);
      });
    }
  };

  const handleStop = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  };

  const formattedContent = podcast.description
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  return (
    <div className="single-podcast-container">
      <div className="single-podcast-image-container">
        <img
          src={podcast.image || defaultImage}
          alt="Podcast"
          className="single-podcast-image"
        />
      </div>
      <h1 className="single-podcast-title">{podcast.title}</h1>
      <p className="single-podcast-meta">
        Yayınlayan: {podcast.writers}
        <br></br>
        Yayınlanma Tarihi: {new Date(
          podcast.releaseTime
        ).toLocaleDateString()},{" "}
        {new Date(podcast.releaseTime).toLocaleTimeString()}
      </p>
      <div
        className="single-podcast-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      ></div>
      <br></br>
      <button className="podcast-play-button" onClick={handlePlay}>
        <PlayCircleOutlineIcon />
      </button>
      <button className="podcast-stop-button" onClick={handleStop}>
        <PauseCircleOutlineOutlinedIcon />
      </button>
      <audio ref={audioRef} src={podcast.url} />
    </div>
  );
};

export default SinglePodcast;
