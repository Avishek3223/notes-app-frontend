import * as Sentry from "@sentry/browser";
const isLocal = process.env.NODE_ENV === "development";
export function initSentry() {
    if (isLocal) {
        return;
    }
    Sentry.init({ dsn: "https://45cff322dba84342a7fe02d22b8143ec@o4505417339502592.ingest.sentry.io/4505417346187264" });
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