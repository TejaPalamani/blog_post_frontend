import { FcLike } from "react-icons/fc";
import { FcDislike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";
import { useContext, useEffect, useState } from "react";
import Loaderfunction from "../skeleton";
import ContextObject from "../../context/ContextObject";

const HomeBlog = (props) => {
  const { blog, status } = props;
  const { title, image, description, user_id, comments, likes, _id } = blog;
  const jwt_token = Cookies.get("token");

  const [tag, setTag] = useState(null);

  useEffect(() => {
    if (image.endsWith(".mp4")) {
      setTag(true);
    } else {
      setTag(false);
    }
  }, []);

  const { savedVideosChanged } = useContext(ContextObject);
  const [saveStatus, setSaveStatus] = useState(false);
  const [likeStatus, setLikeStatus] = useState(status);
  const [comment, setComment] = useState({
    status: false,
    comment: "",
  });

  const [isLoading, setLoading] = useState(true);
  const [count, setCount] = useState({
    likesCount: likes.length,
    commentsCount: comments.length,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  //hadle fetch of like here

  const SendingLikesToDatabase = async () => {
    setLikeStatus(!likeStatus);
    if (likeStatus && count.likesCount !== 0) {
      setCount((prev) => ({ ...prev, likesCount: prev.likesCount - 1 }));
    } else {
      setCount((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
    }

    //fetching data from database

    const postLikesUrl = `http://localhost:3000/user/like/${_id}`;

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    };

    await fetch(postLikesUrl, options);
  };

  //updating only state
  function handleComments() {
    setComment((prev) => ({ ...prev, status: !prev.status }));
  }

  async function handleCommentsPost() {
    //database fetch doing here
    //after fetch only set state
    if (comment.comment !== "") {
      const commentUrl = `http://localhost:3000/user/comments/${_id}`;

      const userComment = { comment: comment.comment };

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userComment),
      };

      const response = await fetch(commentUrl, options);

      if (response.ok) {
        setComment((prev) => ({ ...prev, comment: "" }));
        setCount((prev) => ({
          ...prev,
          commentsCount: prev.commentsCount + 1,
        }));
      }
    } else {
      const userDynamically = window.prompt("Enter Comment:", "enter comment!");
      if (userDynamically !== null) {
        setComment((prev) => ({ ...prev, comment: userDynamically }));
      }
    }
  }

  const loaderfunction = () => {
    return <Loaderfunction />;
  };

  const actualRender = () => {
    return (
      <li className="li">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <h1 className="profile">{user_id.name[0]}</h1>
          <div className="profile_para">
            <p style={{ color: "rgb(121, 247, 163)" }}>{user_id.name}</p>
            <p className="tittle_para">{title}</p>
          </div>
        </div>

        <Link to={`/blogs/${_id}`} className="linkElement">
          {tag ? (
            <video loop autoPlay muted width="100%" height={500}>
              <source src={image} type="video/mp4" />
            </video>
          ) : (
            <img src={image} alt={title} className="image-card-image" />
          )}
        </Link>
        <p style={{ color: "rgb(246, 247, 243)", margin: "10px" }}>
          {description}
        </p>
        <div className="like_comments_save">
          <button type="button" title="Like" onClick={SendingLikesToDatabase}>
            {likeStatus ? (
              <i>
                <FcLike />
              </i>
            ) : (
              <i>
                <FcDislike />
              </i>
            )}

            <span className="min-device-none">{`${count.likesCount} likes`}</span>
          </button>
          <button
            type="button"
            title="Comment"
            onClick={() => handleComments()}
          >
            <i>
              <FaRegComment />
            </i>
            <span className="min-device-none">{`${count.commentsCount}`}</span>
          </button>
          <button
            type="button"
            title="Save"
            onClick={() => {
              return (
                savedVideosChanged(blog, likeStatus), setSaveStatus(!saveStatus)
              );
            }}
          >
            <i style={{ color: saveStatus ? "rgb(28, 240, 56)" : null }}>
              <CiSaveDown2 />
            </i>

            <span
              className="min-device-none"
              style={{ color: saveStatus ? "rgb(28, 240, 56)" : null }}
            >
              save
            </span>
          </button>
        </div>
        {comment.status && (
          <div className="input-post-value">
            <input
              type="text"
              placeholder="Comment here"
              value={comment.comment}
              onChange={(event) =>
                setComment((prev) => ({
                  ...prev,
                  comment: event.target.value,
                }))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCommentsPost();
                }
              }}
            />
            <button type="button" onClick={() => handleCommentsPost()}>
              Post
            </button>
          </div>
        )}
      </li>
    );
  };

  const sctualRender = () => {
    return (
      <li style={{ border: "5px solid black" }}>
        <div className="imageC">image</div>
        <h3>name</h3>
        <div>
          <i>icon</i>
          <p>name</p>
        </div>
      </li>
    );
  };

  const checFuntion = () => {
    return isLoading ? loaderfunction() : null; // changed to mani component
  };

  return actualRender();
};
export default HomeBlog;
