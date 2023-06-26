// Routes.js
import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes"
import Settings from "./containers/Settings";
import ResetPassword from "./containers/ResetPassword";
import ChangePassword from "./containers/ChangePassword";
import ChangeEmail from "./containers/ChangeEmail";

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route exact path="/login" element={<Login />}/>
      <Route exact path="/signup" element={<Signup />}/>
      <Route exact path="/notes/new" element={<NewNote />}/>
      <Route exact path="/notes/:id" element={<Notes />}/>
      <Route exact path="/settings" element={<Settings />}/>
      <Route exact path="/login/reset" element={<ResetPassword />}/>
      <Route exact path="/settings/password" element={<ChangePassword />}/>
      <Route exact path="/settings/email" element={<ChangeEmail />}/>
    </Routes>
  );
}
