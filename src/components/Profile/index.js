import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "./index.css";
import Cookies from "js-cookie";
import ListDisplay from "../ProfileSingleCard/index.";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const status1 = {
  initial: "initial",
  loading: "loading",
  success: "success",
  error: "error",
};

const ProfileCard = () => {
  const [total, setTotal] = useState({
    likes: 0,
    commnets: 0,
    posts: 0,
    userName: "",
  });

  const [status, setStatus] = useState(status1.initial);

  const [finalData, setData] = useState([]);

  const getUserPosts = async () => {
    setStatus(status1.loading);
    const url = "http://localhost:3000/blog-api/blogs/user-post"; // all user Posts

    const jwt_token = Cookies.get("token");

    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${jwt_token}`,
      },
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      setTotal({
        likes: data.totalLike,
        commnets: data.totalComments,
        posts: data.userBlog.length,
        name: data.userName,
      });

      const changingData = await data.userBlog.map((each) => ({
        ...each,
        id: each._id,
      }));

      await setData(data.userBlog);
      setStatus(status1.success);
    } else {
      console.log("error occured");
      setStatus(status1.error);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  const removedButtonClicked = () => {
    getUserPosts();
  };

  const loadingFunction = () => {
    return (
      <SkeletonTheme baseColor="white" highlightColor="black">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <Skeleton circle={true} count={1} width={150} height={150} />
          <div className="threee_loading_buttons">
            <Skeleton count={1} width={100} height={20} />
            <Skeleton count={1} width={100} height={20} />
            <Skeleton count={1} width={100} height={20} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexGrow: "1",
          }}
        >
          <Skeleton
            width={200}
            height={200}
            count={1}
            style={{ margin: "10px" }}
          />
          <Skeleton
            width={200}
            height={200}
            count={1}
            style={{ margin: "10px" }}
          />
          <Skeleton
            width={200}
            height={200}
            count={1}
            style={{ margin: "10px" }}
          />
          <Skeleton
            width={200}
            height={200}
            count={1}
            style={{ margin: "10px" }}
          />
          <Skeleton
            width={200}
            height={200}
            count={1}
            style={{ margin: "10px" }}
          />
          <Skeleton
            width={200}
            height={200}
            count={1}
            style={{ margin: "10px" }}
          />
        </div>
      </SkeletonTheme>
    );
  };

  const successFunction = () => {
    return (
      <>
        <div className="main-profile-card">
          <div className="small_devices_profile">
            <div>
              <div className="Profileimage">
                <img
                  src="https://res.cloudinary.com/ddl5dr4cw/image/upload/v1702301291/bvqvtz1zmr51fvrb4wbl.png"
                  alt="profile"
                />
              </div>
              <h2
                style={{
                  color: "rgb(121, 247, 163)",
                  textTransform: "capitalize",
                }}
              >
                {total.name}
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}
            >
              <div>
                <h2 style={{ color: "white" }}>Posts</h2>
                <h2
                  style={{
                    color: "rgb(121, 247, 163)",
                  }}
                >
                  {total.posts}
                </h2>
              </div>
              <div>
                <h2 style={{ color: "white" }}>Likes</h2>
                <h2
                  style={{
                    color: "rgb(121, 247, 163)",
                  }}
                >
                  {total.likes}
                </h2>
              </div>
              <div>
                <h2 style={{ color: "white" }}>comments</h2>
                <h2
                  style={{
                    color: "rgb(121, 247, 163)",
                  }}
                >
                  {total.commnets}
                </h2>
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "15px" }}>
            <h2 style={{ color: "white" }}>Bio</h2>
            <p style={{ color: "rgb(121, 247, 163)" }}>
              Bio field need to be updated according to user....
            </p>
          </div>
        </div>
        <div className="under_profile">
          <ul>
            {finalData.map((each) => (
              <ListDisplay
                eachData={each}
                removedButtonClicked={removedButtonClicked}
                key={`${each.id}`}
              />
            ))}
          </ul>
        </div>
      </>
    );
  };

  const errroFunction = () => {
    return (
      <div>
        <h1>error</h1>
      </div>
    );
  };

  const checkFunction = () => {
    switch (status) {
      case status1.loading:
        return loadingFunction();
      case status1.success:
        return successFunction();
      default:
        return errroFunction();
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

export default ProfileCard;
