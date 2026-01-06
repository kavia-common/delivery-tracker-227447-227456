import React from "react";

export default function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__title">{title}</div>
      {description ? <div className="state__text">{description}</div> : null}
      {onRetry ? (
        <button className="btn btn--primary" onClick={onRetry} type="button">
          Retry
        </button>
      ) : null}
    </div>
  );
}
