import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";
import { s3Upload } from "../libs/awsLib";

export default function Notes() {
  const file = useRef(null);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  function validateForm() {
    return notes.every((note) => note.content.length > 0);
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  async function handleFileChange(event, index) {
    const imageFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const attachment = await s3Upload(imageFile);
        setNotes((prevNotes) => {
          const updatedNotes = [...prevNotes];
          updatedNotes[index].attachment = attachment;
          updatedNotes[index].attachmentURL = reader.result;
          return updatedNotes;
        });
      } catch (e) {
        onError(e);
      }
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }

    file.current = imageFile;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const newNotes = [];

      for (const note of notes) {
        let attachment;
        if (file.current) {
          attachment = await s3Upload(file.current);
        }

        const createdNote = await API.post("notes", "/notes", {
          body: {
            content: note.content,
            attachment: attachment || note.attachment,
          },
        });

        newNotes.push(createdNote);
      }

      setNotes(newNotes);
      navigate("/");
    } catch (e) {
      onError(e);
    } finally {
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `/notes/`);
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to delete this note?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      navigate("/");
    } catch (e) {
      onError(e);
    } finally {
      setIsDeleting(false);
    }
  }

  function addNewNote() {
    setNotes((prevNotes) => [...prevNotes, { content: "", attachment: null }]);
  }

  return (
    <div className="Notes">
      <Form onSubmit={handleSubmit}>
        {notes.map((note, index) => (
          <div key={index} className="form-container">
            <div className="image-container">
              {note.attachment && (
                <img
                  src={note.attachmentURL}
                  alt={formatFilename(note.attachment)}
                  className="preview-image"
                />
              )}
            </div>
            <div className="content-container">
              <Form.Group controlId={`content-${index}`}>
                <Form.Control
                  as="textarea"
                  value={note.content}
                  onChange={(e) =>
                    setNotes((prevNotes) => {
                      const updatedNotes = [...prevNotes];
                      updatedNotes[index].content = e.target.value;
                      return updatedNotes;
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId={`file-${index}`}>
                <Form.Label>Attachment</Form.Label>
                <div className="attachment-container">
                  {note.attachment && (
                    <p>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={note.attachmentURL}
                      >
                        {formatFilename(note.attachment)}
                      </a>
                    </p>
                  )}
                  <Form.Control
                    onChange={(event) => handleFileChange(event, index)}
                    type="file"
                  />
                </div>
              </Form.Group>
            </div>
          </div>
        ))}
        <div>
          <button type="button" onClick={addNewNote}>
            Add New Note
          </button>
        </div>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Save
        </LoaderButton>
        <LoaderButton
          block
          size="lg"
          variant="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete
        </LoaderButton>
      </Form>
    </div>
  );
}
