import React from "react";
import { logError } from "../libs/errorLib";
import "./ErrorBoundary.css";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  triggerError = () => {
    throw new Error("Manually triggered error");
  };

  render() {
    return this.state.hasError ? (
      <div className="ErrorBoundary text-center">
        <h3>Sorry, there was a problem loading this page</h3>
      </div>
    ) : (
      <div className="ErrorBoundary">
        <h1>Wrapped Component</h1>
        <button onClick={this.triggerError}>Trigger Error</button>
        {this.props.children}
      </div>
    );
  }
}
