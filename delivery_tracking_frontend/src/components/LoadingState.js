import React from "react";

export default function LoadingState({ label = "Loading…" }) {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <div className="state__text">{label}</div>
    </div>
  );
}
