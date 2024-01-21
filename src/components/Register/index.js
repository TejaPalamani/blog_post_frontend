import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./index.css";

const Register = () => {
  const [uname, setUname] = useState("");
  const [pname, setpname] = useState("");
  const [email, setemail] = useState("");
  const [error, seterror] = useState("");

  const navigate = useNavigate();

  const submittedClicked = async (event) => {
    event.preventDefault();

    try {
      const userDetails = {
        name: uname,
        email,
        password: pname,
      };

      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(userDetails),
      };
      const url = "http://localhost:3000/blog-api/register";

      const response = await fetch(url, option);

      if (response.ok) {
        console.log(response.json());
        navigate("/login");
      } else {
      }
    } catch (e) {
      console.log(e.message);
      seterror(e.message);
    }
  };

  return (
    <div className="main">
      <form className="form" onSubmit={submittedClicked}>
        <label htmlFor="u" className="label">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          value={uname}
          id="u"
          onChange={(event) => setUname(event.target.value)}
        />
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          id="email"
          onChange={(event) => setemail(event.target.value)}
        />
        <label htmlFor="p" className="label">
          Password
        </label>
        <input
          type="password"
          placeholder="EnterPassCode"
          value={pname}
          id="p"
          onChange={(event) => setpname(event.target.value)}
        />
        <div>
          <button type="submit">Register</button>
          <button type="button" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
        {error.length !== 0 && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
