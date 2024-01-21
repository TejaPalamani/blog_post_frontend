// empty view while saved videos == 0

import { useContext, useEffect, useState } from "react";
import "./index.css";
import ContextObject from "../../context/ContextObject";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import HomeBlog from "../homeBlog";
import Loaderfunction from "../skeleton";
import { FaFireAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SavedVideo = () => {
  const { savedVideos } = useContext(ContextObject);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  console.log(savedVideos);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  function emptyFunction() {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div className="icon-back">
            <i>
              <FaFireAlt />
            </i>
          </div>
          <h1 style={{ color: "red" }}>
            <span style={{ color: "white" }}>Saved</span> Videos
          </h1>
        </div>
        <div className="retry-saved">
          <img
            src="https://res.cloudinary.com/ddl5dr4cw/image/upload/v1703494752/fqcfewuhhiytpdqh7jbb.png"
            alt="notFound"
          />
          <h1 style={{ color: "red" }}>
            <span style={{ color: "white" }}>NO Saved Videos</span> Try adding!
          </h1>
          <button type="button" onClick={() => navigate("/")}>
            Go to home
          </button>
        </div>
      </>
    );
  }

  const successFunction = () => {
    if (isLoading) {
      return (
        <>
          <Loaderfunction />
          <Loaderfunction />
        </>
      );
    } else {
      return (
        <>
          {savedVideos.map((each) => (
            <HomeBlog blog={each} status={each.isLiked} key={each._id} />
          ))}
        </>
      );
    }
  };

  const chechFunction = () => {
    if (savedVideos.length === 0) {
      return emptyFunction();
    } else {
      return successFunction();
    }
  };

  return (
    <>
      <Sidebar />
      <div className="mani-home-container">
        <Navbar />
        <div className="home-main-feed">{chechFunction()}</div>
      </div>
    </>
  );
};

export default SavedVideo;
