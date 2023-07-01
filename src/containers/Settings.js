import React from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import "./Settings.css"; // Import the CSS file for custom styles

export default function Settings() {
  const navigate = useNavigate();

  function handleChangeEmail() {
    // Code to handle email change
    // ...
    navigate("/settings/email");
  }

  function handleChangePassword() {
    // Code to handle password change
    // ...
    navigate("/settings/password");
  }

  return (
    <div className="Settings">
      <LinkContainer to="/settings/email">
        <Button className="EkThaBtn" variant="primary" size="lg" block onClick={handleChangeEmail}>
          Change Email
        </Button>
      </LinkContainer>
      <LinkContainer to="/settings/password">
        <Button className="EkThaBtn" variant="primary" size="lg" block onClick={handleChangePassword}>
          Change Password
        </Button>
      </LinkContainer>
    </div>
  );
}
