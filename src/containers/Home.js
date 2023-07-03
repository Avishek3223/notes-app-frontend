import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import Footer from "./Footer";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadNotes() {
      const params = searchQuery ? { queryStringParameters: { search: searchQuery } } : {};
      return API.get("notes", "/notes", params);
    }

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
  }, [isAuthenticated, searchQuery]);

  function renderNotesList(notes) {
    const filteredNotes = notes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredNotes.length === 0) {
      return (
        <ListGroup.Item className="text-muted">No matching notes found.</ListGroup.Item>
      );
    }

    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate listItem">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {filteredNotes.map(({ noteId, content, createdAt }) => (
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

  function handleSearch(event) {
    setSearchQuery(event.target.value);
  }

  return (
    <div className="Home">
      <h2 className="pb-3 mt-4 mb-3 border-bottom notes-heading">Your Notes</h2>
      <input
        type="text"
        className="search-bar"
        placeholder="Search Notes"
        value={searchQuery}
        onChange={handleSearch}
      />
      <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
  
      {/* Social Media Buttons */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
  }  