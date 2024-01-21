import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const jwtToken = Cookies.get("token");

  return jwtToken ? <Outlet /> : <Navigate to="/register" replace />;
};

export default ProtectedRoute;
