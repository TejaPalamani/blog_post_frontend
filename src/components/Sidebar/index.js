import Cookies from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { CiSaveDown2 } from "react-icons/ci";
import { BiLogoGitlab } from "react-icons/bi";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { useEffect, useState } from "react";

import "./index.css";

const Sidebar = () => {
  const [mobileView, setMobileView] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handelResize = () => {
      setMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handelResize);

    //this is to clear eventListener while coponent unmount

    return () => {
      window.removeEventListener("resize", handelResize);
    };
  }, []);

  const bigScreenView = () => {
    const handleLogOut = () => {
      Cookies.remove("token");
      navigate("/login");
    };

    return (
      <nav className="sidebar">
        <div style={{ marginBottom: "30px", marginLeft: "5px" }}>
          <i style={{ fontSize: "30px", color: "white" }}>
            <BiLogoGitlab />
          </i>
        </div>

        <NavLink to="/" className="NavLink" activeClassName="active">
          <div className="navdiv">
            <i className="icon">
              <IoHomeOutline />
            </i>
            <span className="icontext">Home</span>
          </div>
        </NavLink>
        <NavLink to="/feed" className="NavLink" activeClassName="active">
          <div>
            <i className="icon">
              <MdOutlineExplore />
            </i>
            <span className="icontext">Explore</span>
          </div>
        </NavLink>
        <NavLink to="/saved" className="NavLink" activeClassName="active">
          <div>
            <i className="icon">
              <CiSaveDown2 />
            </i>
            <span className="icontext">Saved</span>
          </div>
        </NavLink>
        <NavLink to="/profile" className="NavLink" activeClassName="active">
          <div>
            <i className="icon">
              <GiPlagueDoctorProfile />
            </i>
            <span className="icontext">Profile</span>
          </div>
        </NavLink>

        <button type="button" className=" LogoutButton" onClick={handleLogOut}>
          Logout
        </button>
      </nav>
    );
  };

  const mobileScreenView = () => {
    return <h1>This is mobileView</h1>;
  };

  return !mobileView && bigScreenView();
};

export default Sidebar;
