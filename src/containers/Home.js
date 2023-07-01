import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderNotesList(notes) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate listItem">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action className="listItem">
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1 className="text">Scratch</h1>
        <p className="text-muted">
          <span className="simple-app-text">A simple note taking app</span>
        </p>
        <div className="pt-3">
          <Link
            to="/login"
            className="btn btn-info btn-lg mr-3 btn-login"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn btn-success btn-lg custom-btn btn-signup"
          >
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom notes-heading">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? (
        renderNotes()
      ) : (
        <div className="lander">
          {renderLander()}
        </div>
      )}
      {/* Social Media Buttons */}
      <div className="button-container">
        <a href="https://www.facebook.com/profile.php?id=100084340068772">
          <div className="button">
            <div className="icon">
              <i className="fab fa-facebook-f"></i>
              <div>
                <span className="blue">Facebook</span>
              </div>
            </div>
          </div>
        </a>
        <a href="https://www.instagram.com/_avishek_23_/">
          <div className="button">
            <div className="icon">
              <i className="fab fa-instagram"></i>
              <div>
                <span className="pink">Instagram</span>
              </div>
            </div>
          </div>
        </a>
        <a href="https://www.linkedin.com/in/avishek-mishra-6b3910272/">
          <div className="button">
            <div className="icon">
              <i className="fab fa-linkedin"></i>
              <div>
                <span className="sky">LinkedIn</span>
              </div>
            </div>
          </div>
        </a>
      </div >
    </div >
  );
}
