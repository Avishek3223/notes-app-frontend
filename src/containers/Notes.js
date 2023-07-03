import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";
import { s3Upload } from "../libs/awsLib";

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
          setImageURL(note.attachmentURL);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    const uploadedFile = event.target.files[0];
    file.current = uploadedFile;

    const reader = new FileReader();
    reader.onload = () => {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(uploadedFile);
  }

  async function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let attachment;

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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });

      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
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
      setIsDeleting(false);
    }
  }

  function handleCheckboxChange(event, noteId) {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedNotes([...selectedNotes, noteId]);
    } else {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    }
  }

  async function handleMultipleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedNotes.length} selected notes?`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await Promise.all(
        selectedNotes.map((noteId) => API.del("notes", `/notes/${noteId}`))
      );
      navigate("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          {imageURL && (
            <div className="image-container">
              <img className="preview-image" src={imageURL} alt="Attachment" />
            </div>
          )}
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
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
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <div className="button-container">
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
            {selectedNotes.length > 0 && (
              <LoaderButton
                block
                size="lg"
                variant="danger"
                onClick={handleMultipleDelete}
                isLoading={isDeleting}
              >
                Delete Selected
              </LoaderButton>
            )}
          </div>
        </Form>
      )}
    </div>
  );
}
