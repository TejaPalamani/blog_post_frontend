import Cookies from 'js-cookie';
import HomeBlog from '../homeBlog';

import { useNavigate, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { TbPlayerTrackPrev } from 'react-icons/tb';
import { TbPlayerTrackNext } from 'react-icons/tb';

import './index.css';
import { useEffect, useState } from 'react';
import Loaderfunction from '../skeleton';
import { baseurl, notFoundImage } from '../../constants';

const status = {
  intial: 'intial',
  loading: 'loading',
  success: 'success',
  error: 'error',
};

const Home = () => {
  const jwt_token = Cookies.get('token');

  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  const [progress, setProgress] = useState(status.intial);

  const gettingData = async () => {
    setProgress(status.loading);
    const url = `${baseurl}/blog-api/blogs/?skip=${page}`;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const actual_data = await response.json();
      const { newDataWithLiked, total } = actual_data;
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setData(newDataWithLiked);
      setProgress(status.success);
    } else {
      const error = await response.json();
      setProgress(status.error);
      console.log(error.error);
    }
  };

  useEffect(() => {
    gettingData();
  }, [page]);

  //onErrro time loading condition

  const errorScreen = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'centre',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={notFoundImage}
          alt="404 not found"
          style={{
            width: 'auto',
            height: 'auto',
            backgroundColor: 'white',
          }}
        />
        <button
          type="button"
          style={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '10px',
            width: '120px',
            height: '35px',
            cursor: 'pointer',
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transform: 'translate(-50%, 50%)',
          }}
          onClick={() => gettingData()}
        >
          Retry
        </button>
      </div>
    );
  };

  //on Empty view loading Screen condition

  const onEmptyView = () => {};

  //onSuccess view
  const sucessFunction = () => {
    return (
      <>
        <ul className="internal">
          {data.map((each) => (
            <HomeBlog
              blog={each.blog}
              status={each.status}
              key={each.blog._id}
            />
          ))}
        </ul>
        <div className="nextpages">
          <button
            onClick={() => {
              page > 0 && setPage(page - 1);
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
          >
            <i>
              <TbPlayerTrackPrev />
            </i>
            <span>prev</span>
          </button>
          <button
            onClick={() => {
              data.length > 9 && setPage(page + 1);
              //window.scroll(0, 0);
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
          >
            <span>next</span>
            <i>
              <TbPlayerTrackNext />
            </i>
          </button>
        </div>
      </>
    );
  };

  //onloading View
  const loadingFunction = () => {
    return (
      <>
        <Loaderfunction />
        <Loaderfunction />
        <Loaderfunction />
      </>
    );
  };

  const checkFunction = () => {
    switch (progress) {
      case status.loading:
        return loadingFunction();
      case status.error:
        return errorScreen();
      case status.success:
        return sucessFunction();
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

export default Home;
