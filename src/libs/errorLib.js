import * as Sentry from "@sentry/react";

const isLocal = false;

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({ dsn: "https://7e98d388b10f4283bf314771dd8b2976@o4505418044735488.ingest.sentry.io/4505434713227264" });

}
export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function onError(error) {
  let errorInfo = {};
  let message = error.toString();
  // Auth errors
  if (!(error instanceof Error) && error.message) {
    errorInfo = error;
    message = error.message;
    error = new Error(message);
    // API errors
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }
  logError(error, errorInfo);
  alert(message);
}