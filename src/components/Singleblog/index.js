import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "./index.css";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { GiSkeleton } from "react-icons/gi";
import { MdOutlineDelete } from "react-icons/md";
import Loaderfunction from "../skeleton";
import { FcDislike, FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { formatDistanceToNow, parseISO } from "date-fns";
import ContextObject from "../../context/ContextObject";

///blog with comments and time list before that add likes and comments post

const status = {
  inital: "inital",
  loading: "loading",
  success: "success",
  error: "error",
};

const Singleblog = () => {
  const { id } = useParams();
  const jwt_token = Cookies.get("token");

  const decode = jwt_token.split(".")[1];

  //btoa means encode
  //atob means decode

  const payload = JSON.parse(atob(decode));

  const { savedVideosChanged } = useContext(ContextObject);
  const [saveStatus, setSaveStatus] = useState(false);

  const [likeStatus, setLikeStatus] = useState(null);
  const [comment, setComment] = useState({
    status: false,
    comment: "",
  });
  const [isLoading, setLoading] = useState(true);

  const [count, setCount] = useState({
    likesCount: 0,
    commentsCount: 0,
  });

  const [progress, setProgress] = useState(status.inital);

  const [data, setData] = useState({});
  const [sendingRawData, setSendingRawData] = useState({});

  useEffect(() => {
    getSingleData();
  }, [count.commentsCount]);

  //hadle fetch of like here

  const sendingLikesToDatabase = async () => {
    setLikeStatus(!likeStatus);
    if (likeStatus && count.likesCount !== 0) {
      setCount((prev) => ({ ...prev, likesCount: prev.likesCount - 1 }));
    } else {
      setCount((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
    }

    //fetching data from database

    const postLikesUrl = `http://localhost:3000/user/like/${id}`;

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
      const commentUrl = `http://localhost:3000/user/comments/${id}`;

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

  const getSingleData = async () => {
    setProgress(status.loading);
    const singleBlogUrl = `http://localhost:3000/blog-api/blogs/${id}`;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(singleBlogUrl, options);

    if (response.ok) {
      const singleData = await response.json();

      // setbbData(singleData.singleObjectData);
      //update it to javascript reacdable formate like user_id to userId
      //{ title, image, description, user_id, comments, likes, _id }
      const sendingdata = await {
        title: singleData.singleObjectData.title,
        image: singleData.singleObjectData.image,
        description: singleData.singleObjectData.description,
        _id: singleData.singleObjectData._id,
        likes: singleData.singleObjectData.likes.map((each) => ({
          userId: each.user_id,
        })),
        comments: singleData.singleObjectData.comments,
        user_id: singleData.singleObjectData.user_id,
      };

      const changingFormate = await {
        blogId: singleData.singleObjectData._id,
        title: singleData.singleObjectData.title,
        image: singleData.singleObjectData.image,
        description: singleData.singleObjectData.description,
        userId: {
          createdUser: singleData.singleObjectData.user_id._id,
          name: singleData.singleObjectData.user_id.name,
        },
        comments: singleData.singleObjectData.comments.map((each) => ({
          commentId: each._id,
          CommentUserId: {
            createdUser: each.user_id._id,
            name: each.user_id.name,
          },
          comment: each.comment,
          createdAt: each.createdAt,
        })),
        likes: singleData.singleObjectData.likes.map((each) => ({
          userId: each.user_id,
        })),
        blogCreatedAt: singleData.singleObjectData.createdAt,
      };

      //console.log(changingFormate);
      setData(changingFormate);
      setSendingRawData(sendingdata);
      setLikeStatus(singleData.isLiked);
      setProgress(status.success);
      setCount((prev) => ({
        likesCount: changingFormate.likes.length,
        commentsCount: changingFormate.comments.length,
      }));
    } else {
      setProgress(status.error);
    }
  };

  const deleteFunctionTriggermain = () => {
    setCount((prev) => ({ ...prev, commentsCount: prev.commentsCount - 1 }));
  };

  const HandleEachComment = (props) => {
    const { eachComment, deleteFunctionTrigger } = props;
    const { commentId, CommentUserId, comment, createdAt } = eachComment;

    const createdAtUTC = parseISO(createdAt);

    const diff = formatDistanceToNow(new Date(createdAtUTC));

    async function handleDelteButtonFunction() {
      const commentDeleteUrl = `http://localhost:3000/user/comments-remove/${commentId}`; //provide id of comment

      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json",
        },
      };

      const delResponse = await fetch(commentDeleteUrl, options);

      if (delResponse.ok) {
        deleteFunctionTrigger();
      }
    }

    function checkButton() {
      //console.log(payload);
      if (payload.id === data.userId.createdUser) {
        return (
          <button
            type="button"
            title="delete"
            onClick={handleDelteButtonFunction}
            style={{ outline: "none", backgroundColor: "none", border: "none" }}
          >
            <i style={{ fontSize: "22px" }}>
              <MdOutlineDelete />
            </i>
          </button>
        );
      }
    }

    return (
      <li className="com_list">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="p">{CommentUserId.name[0]}</span>
            <div style={{ marginLeft: "15px" }}>
              <p style={{ color: "green" }}>{CommentUserId.name}</p>
              <p>{diff} ago</p>
            </div>
          </div>
          {checkButton()}
        </div>
        <p style={{ marginLeft: "46px" }}>{comment}</p>
      </li>
    );
  };

  const imageorVideo = () => {
    if (data.image.endsWith(".mp4")) {
      return (
        <video controls autoPlay width="100%" height={500}>
          <source src={data.image} type="video/mp4" />
        </video>
      );
    } else {
      return (
        <img src={data.image} alt={data.title} className="image-card-image" />
      );
    }
  };

  const successFunction = () => {
    return (
      <>
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
          <h1 className="profile">{data.userId.name[0]}</h1>

          <div className="profile_para">
            <p style={{ color: "rgb(121, 247, 163)" }}>{data.userId.name}</p>
            <p className="tittle_para">{data.title}</p>
          </div>
        </div>
        {imageorVideo()}

        <div className="sperate_like_comment">
          <button type="button" title="Like" onClick={sendingLikesToDatabase}>
            {likeStatus ? (
              <i>
                <FcLike />
              </i>
            ) : (
              <i>
                <FcDislike />
              </i>
            )}

            <span className="min-device">{`${count.likesCount} likes`}</span>
          </button>
          <button
            type="button"
            title="Comment"
            onClick={() => handleComments()}
          >
            <i>
              <FaRegComment />
            </i>
            <span className="min-device">{`${count.commentsCount}`}</span>
          </button>
          <button
            type="button"
            title="Save"
            onClick={() => {
              return (
                savedVideosChanged(sendingRawData, likeStatus),
                setSaveStatus(!saveStatus)
              );
            }}
          >
            <i style={{ color: saveStatus ? "rgb(28, 240, 56)" : null }}>
              <CiSaveDown2 />
            </i>
            <span
              className="min-device"
              style={{ color: saveStatus ? "rgb(28, 240, 56)" : null }}
            >
              save
            </span>
          </button>
        </div>
        <div className="comment_block">
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
                event.key === "Enter" && handleCommentsPost();
              }}
            />
            <button type="button" onClick={() => handleCommentsPost()}>
              Post
            </button>
          </div>
          <ul>
            {data.comments.map((each) => (
              <HandleEachComment
                eachComment={each}
                deleteFunctionTrigger={deleteFunctionTriggermain}
                key={each.id}
              />
            ))}
          </ul>
        </div>
      </>
    );
  };

  const errorFunction = () => {
    return (
      <>
        <div>
          <h1>Error</h1>
        </div>
      </>
    );
  };

  const checkFunction = () => {
    switch (progress) {
      case status.loading:
        return <Loaderfunction />;
      case status.success:
        return successFunction();

      default:
        return errorFunction();
    }
  };

  return (
    <>
      <Sidebar />
      <div className="mani-home-container">
        <Navbar />
        <div className="home-main-feed">{checkFunction()}</div>
      </div>
    </>
  );
};

export default Singleblog;
