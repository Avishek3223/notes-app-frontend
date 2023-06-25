import * as Sentry from "@sentry/browser";

const isLocal = false;

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({
    dsn: "https://45cff322dba84342a7fe02d22b8143ec@o4505417339502592.ingest.sentry.io/4505417346187264",
    // Add other configuration options here if needed
  });
}

export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    if (errorInfo) {
      scope.setExtras(errorInfo);
    }
    Sentry.captureException(error);
  });
}

export function onError(error) {
  let errorInfo = {};
  let message = error.toString();

  if (!(error instanceof Error) && error.message) {
    errorInfo = error;
    message = error.message;
    error = new Error(message);
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }

  logError(error, errorInfo);
  alert(message);
}

// Additional function for capturing custom messages to Sentry
export function logMessage(message, level = "info") {
  if (isLocal) {
    return;
  }

  Sentry.captureMessage(message, level);
}
