import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineLegendToggle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { BiLogoGitlab } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { GiPlagueDoctorProfile } from "react-icons/gi";

import "./index.css";
import Cookies from "js-cookie";

const Navbar = () => {
  const [userInput, setInput] = useState("");
  const [toggleButton, setToggleButton] = useState(false);

  const navigate = useNavigate();

  function handlelogoutButton() {
    Cookies.remove("token");
    navigate("/login");
  }

  const jwt_token = Cookies.get("token");

  const decode = jwt_token.split(".")[1];

  const payload = JSON.parse(atob(decode));

  const ConditionalSidebar = () => {
    return (
      <div className="conditinalSider">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <i style={{ fontSize: "22px" }}>
            <BiLogoGitlab />
          </i>
          <button
            type="button"
            className="cross"
            onClick={() => setToggleButton(!toggleButton)}
          >
            <i>
              <ImCross />
            </i>
          </button>
        </div>
        <NavLink to="/" className="navLink" activeClassName="active">
          <i className="icon">
            <IoHomeOutline />
          </i>
          <span>Home</span>
        </NavLink>
        <NavLink to="/feed" className="navLink" activeClassName="active">
          <i className="icon">
            <MdOutlineExplore />
          </i>
          <span>Explore</span>
        </NavLink>
        <NavLink to="/saved" className="navLink" activeClassName="active">
          <i className="icon">
            <CiSaveDown2 />
          </i>
          <span>Saved</span>
        </NavLink>
        <NavLink to="/profile" className="navLink" activeClassName="active">
          <i className="icon">
            <GiPlagueDoctorProfile />
          </i>
          <span>Profile</span>
        </NavLink>

        <button
          type="button"
          className="specialLogout"
          onClick={handlelogoutButton}
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <nav className="navtop">
      {toggleButton && ConditionalSidebar()}
      <div className="inner">
        <i className="toggleIcon">
          <button type="button" onClick={() => setToggleButton(!toggleButton)}>
            <MdOutlineLegendToggle />
          </button>
        </i>
        <div className="searchbar">
          <i>
            <CiSearch />
          </i>
          <input
            type="search"
            placeholder="Search"
            value={userInput}
            style={{ height: "100%", borderRadius: "10px" }}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>
        <div className="threeIcons">
          <i>
            <button
              type="button"
              onClick={() => navigate("/thread/posting-data")}
              style={{ cursor: "pointer" }}
            >
              <FaPlus />
            </button>
          </i>

          <i>
            <button onClick={() => navigate("/profile")}>
              <GiPlagueDoctorProfile />
            </button>
          </i>

          <p
            style={{
              fontFamily: "cursive",
              fontSize: "20px",
              marginRight: "10px",
              color: "white",
            }}
          >
            {payload.user}
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
