import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote"; // Import the NewNote component
import Notes from "./containers/Notes"; // Import the Notes component


export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/notes/new" element={<NewNote />} /> {/* Add this route */}
      <Route exact path="/notes/:id" element={<Notes />} /> {/* Add this route */}
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}