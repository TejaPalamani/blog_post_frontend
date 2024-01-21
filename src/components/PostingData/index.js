import { Form, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { MdFileUpload } from "react-icons/md";
import imageCompression from "browser-image-compression";
import "./index.css";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";

const PostingData = () => {
  //practice using state in object

  const { state } = useLocation();

  const { id } = useParams();

  const [state1, setState] = useState({
    title: "",
    description: "",
    imageUrl: null,
    image: "",
  });

  const [video, setVideo] = useState(null);

  const [image, setImaage] = useState(null);

  const [getUrlClicked, setClicked] = useState(false);

  const navigate = useNavigate();

  const fetchData = async (img) => {
    if (!img) {
      alert("image and description is needed!");
      return;
    }

    //uploadind image to cludinary and getting url

    const url = img.type.startsWith("video/")
      ? "https://api.cloudinary.com/v1_1/ddl5dr4cw/video/upload?upload_preset=amjgvepq"
      : "https://api.cloudinary.com/v1_1/ddl5dr4cw/image/upload?upload_preset=amjgvepq";

    //const url = `https://api.cloudinary.com/v1_1/ddl5dr4cw/image/upload?upload_preset=amjgvepq`;

    const formData = new FormData();
    formData.append("file", img);

    const options = {
      method: "POST",
      body: formData,
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      setState((prev) => ({ ...prev, image: data.secure_url }));
    } else {
      console.log("no");
    }
  };

  const handelInputfiles = () => {
    document.querySelector(".file-i").click();
    setState((prev) => ({ ...prev, image: "" }));
  };

  const submitButtonClicked = async (event) => {
    event.preventDefault();
    console.log(state1.image);

    const token = Cookies.get("token");

    const url = "http://localhost:3000/blog-api/blogs/post-blog";

    const bodyObject = {
      title: state1.title,
      description: state1.description,
      image: state1.image,
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      alert(data.mesg);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      const data = await response.json();
      console.log(data.error);
      alert(data.error);
    }
  };

  //image selected
  const imageSelected = (event) => {
    const reader = new FileReader();

    const img = event.target.files[0];

    reader.onload = (anotherEvent) => {
      if (img.type.startsWith("image")) {
        console.log("image");
        //console.log(anotherEvent.target.result);

        setImaage(reader.result);
        setVideo(null);
      } else if (img.type.startsWith("video")) {
        console.log("video");
        //console.log(anotherEvent.target.result);
        setImaage(null);
        setVideo(anotherEvent.target.result); //another.target.result or render.result same thing
      }
      //setImaage(reader.result); // we can send this to backend
    };

    reader.readAsDataURL(img); // it returns nothing its an intializer

    setState((prev) => ({ ...prev, imageUrl: img }));
  };

  return (
    <div>
      <Sidebar />
      <div className="mani-home-container">
        <Navbar />
        <div className="home-main-feed">
          <form className="input-form" onSubmit={submitButtonClicked}>
            <input
              type="text"
              placeholder="Title"
              onChange={(e) =>
                setState((prev) => ({ ...prev, title: e.target.value }))
              }
              className="input-title"
              value={state1.title}
              style={{ fontSize: "18px" }}
            />
            <div className="description-and-image">
              <input
                style={{ color: "aliceblue" }}
                type="text"
                value={state1.description}
                placeholder="Description"
                onChange={(e) =>
                  setState((prev) => ({ ...prev, description: e.target.value }))
                }
                className="kk"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",

                  width: "80%",
                }}
              >
                {image && (
                  <img src={image} alt="selectedImage" className="image-card" />
                )}
                {video && (
                  <video width="80%" height={300} controls autoPlay>
                    <source src={video} type="video/mp4" />
                  </video>
                )}
                {state1.image !== "" ? (
                  <p style={{ color: "aliceblue" }}>{`url:${state1.image}`}</p>
                ) : (
                  image && <p>loading ....</p>
                )}
              </div>
            </div>
            <div className="post-and-inputButton">
              <button
                type="button"
                className="fileButton"
                onClick={handelInputfiles}
              >
                <i>
                  <MdFileUpload />
                </i>
                <input
                  type="file"
                  className="file-i"
                  onChange={imageSelected}
                  hidden
                />
              </button>
              {state1.image !== "" ? (
                <button type="submit">Post</button>
              ) : (
                <button
                  type="button"
                  onClick={() => fetchData(state1.imageUrl)}
                >
                  getUrl
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostingData;
