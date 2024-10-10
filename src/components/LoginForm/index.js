import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import './index.css';
import { baseurl } from '../../constants';

const Login = () => {
  const [email, setemail] = useState('');
  const [passCode, setpassCode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [state, setState] = useState({ error: false, mesg: '' });

  const navigate = useNavigate();
  const jwt_token = Cookies.get('token');

  useEffect(() => {
    if (jwt_token) {
      navigate('/');
    }
  }, [jwt_token]);

  const postingDataToServer = async () => {
    const userDetails = {
      email,
      password: passCode,
    };

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };

    const url = `${baseurl}/blog-api/login`;

    try {
      const response = await fetch(url, option);

      if (response.ok) {
        const data = await response.json();
        const jwt = data.jwt_token;
        setState({ error: false, mesg: '' });
        Cookies.set('token', jwt, { expires: 7 });
        navigate('/');
      } else {
        const data = await response.json();
        const error = data.error;
        setState({ error: true, mesg: error });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const loginFormSubmitted = (event) => {
    event.preventDefault();
    postingDataToServer();
  };

  return (
    <div className="dd">
      <form className="loginForm form" onSubmit={loginFormSubmitted}>
        <label htmlFor="email" className="label">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          id="email"
          onChange={(event) => setemail(event.target.value)}
        />
        <label htmlFor="pass" className="label">
          Password
        </label>
        <input
          type={showPass ? 'text' : 'password'}
          placeholder="Enter password"
          value={passCode}
          id="pass"
          onChange={(event) => setpassCode(event.target.value)}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <input
            type="checkbox"
            onChange={() => setShowPass(!showPass)}
            style={{ width: '16px', cursor: 'pointer' }}
            id="check"
          />
          <label htmlFor="check">show password</label>
        </div>
        <div>
          <button type="submit" style={{ marginRight: '5px' }}>
            Login In
          </button>
          <button type="button" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
        {state.error && <p style={{ color: 'red' }}>{state.mesg}</p>}
      </form>
    </div>
  );
};

export default Login;
