import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import Cookies from "js-cookie";

import "./index.css";

const ListDisplay = (props) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const navigate = useNavigate();
  const { eachData, removedButtonClicked } = props;
  //console.log(eachData);
  const { image } = eachData;

  const [tag, setTag] = useState(null);

  useEffect(() => {
    if (image.endsWith(".mp4")) {
      setTag(true);
    } else {
      setTag(false);
    }
  });

  const removeFunctionTrigger = async () => {
    const url = `http://localhost:3000/blog-api/blogs/user-post/${eachData._id}`;

    //console.log(url);

    const jwt_token = Cookies.get("token");

    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    };

    const response = await fetch(url, options);

    if (response.ok) {
      removedButtonClicked();
    } else {
      const data = response.json();
      console.log(data.error);
    }

    //write this when response is ok
    //removedButtonClicked()
  };

  const imageContainer = () => {
    return (
      <li>
        <div style={{ backgroundImage: `url(${image})` }} className="inner_li">
          <p style={{ color: "rgb(121, 247, 163)", fontWeight: "bold" }}>
            {eachData.title}
          </p>
          {!buttonClicked ? (
            <button
              type="button"
              onClick={() => setButtonClicked(!buttonClicked)}
              className="threedots_profile_card"
            >
              <i>
                <BsThreeDotsVertical />
              </i>
            </button>
          ) : (
            <div className="hiddden">
              <div style={{ marginTop: "20px" }} className="tt">
                <button
                  onClick={() =>
                    navigate(`/update/${eachData._id}`, {
                      state: { blogData: eachData },
                    })
                  }
                  type="button"
                >
                  Update
                </button>
                <hr />
                <button type="button" onClick={removeFunctionTrigger}>
                  Remove
                </button>
                <hr />
                <button
                  type="button"
                  onClick={() => navigate(`/blogs/${eachData._id}`)}
                >
                  view post
                </button>
              </div>
              <button
                type="button"
                onClick={() => setButtonClicked(!buttonClicked)}
                className="inner-profile-cross"
              >
                <i>
                  <RxCross1 />
                </i>
              </button>
            </div>
          )}
        </div>
      </li>
    );
  };

  const videoContainer = () => {
    return (
      <li>
        <div className="inner_li">
          <video muted loop width={250} height={200} controls>
            <source src={image} type="video/mp4" />
          </video>
          {!buttonClicked ? (
            <button
              type="button"
              onClick={() => setButtonClicked(!buttonClicked)}
              className="threedots_profile_card"
            >
              <i>
                <BsThreeDotsVertical />
              </i>
            </button>
          ) : (
            <div className="hiddden">
              <div style={{ marginTop: "20px" }} className="tt">
                <button
                  onClick={() =>
                    navigate(`/update/${eachData._id}`, {
                      state: { blogData: eachData },
                    })
                  }
                  type="button"
                >
                  Update
                </button>
                <hr />
                <button type="button" onClick={removeFunctionTrigger}>
                  Remove
                </button>
                <hr />
                <button
                  type="button"
                  onClick={() => navigate(`/blogs/${eachData._id}`)}
                >
                  view post
                </button>
              </div>
              <button
                type="button"
                onClick={() => setButtonClicked(!buttonClicked)}
                className="inner-profile-cross"
              >
                <i>
                  <RxCross1 />
                </i>
              </button>
            </div>
          )}
        </div>
      </li>
    );
  };

  const checkVideoOrImage = () => {
    if (tag) {
      return videoContainer();
    } else {
      return imageContainer();
    }
  };
  //

  return checkVideoOrImage();
};

export default ListDisplay;
