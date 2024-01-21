import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/LoginForm";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PostingData from "./components/PostingData";

import "./App.css";
import UpdatingBlogData from "./components/updatingPost.js";
import Singleblog from "./components/Singleblog/index.js";
import { createContext, useState } from "react";
import ContextObject from "./context/ContextObject.js";
import SavedVideo from "./components/SavedComponent/index.js";
import ProfileCard from "./components/Profile/index.js";

const App = () => {
  const [savedVideos, setSavedVideos] = useState([]);

  const savedVideosChanged = (blogDetails, status) => {
    //blog consist of id
    const filteredVideos = savedVideos.filter(
      (each) => each._id === blogDetails._id
    );

    if (filteredVideos.length === 0) {
      setSavedVideos([...savedVideos, { ...blogDetails, isLiked: status }]);
    } else {
      const filterData = savedVideos.filter(
        (each) => each._id !== blogDetails._id
      );
      setSavedVideos(filterData);
    }
  };

  console.log(savedVideos);

  return (
    <ContextObject.Provider value={{ savedVideos, savedVideosChanged }}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} exact />
          <Route path="/thread/posting-data" element={<PostingData />} exact />
          <Route path="/blogs/:id" element={<Singleblog />} exact />
          <Route path="/update/:id" element={<UpdatingBlogData />} exact />
          <Route path="/saved" element={<SavedVideo />} exact />
          <Route path="/profile" element={<ProfileCard />} exact />
        </Route>
      </Routes>
    </ContextObject.Provider>
  );
};

export default App;
