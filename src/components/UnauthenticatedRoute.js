import React from "react";
import { Route, Navigate } from "react-router-dom";

const UnauthenticatedRoute = ({ element: Component, ...rest }) => {
  // Check if the user is authenticated (you can implement your own logic here)
  const isAuthenticated = false; // Set to true if the user is authenticated

  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Navigate to="/" /> : <Component />}
    />
  );
};

export default UnauthenticatedRoute;
