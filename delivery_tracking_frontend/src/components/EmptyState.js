import React from "react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="state state--empty" role="note">
      <div className="state__title">{title}</div>
      {description ? <div className="state__text">{description}</div> : null}
      {action ? <div className="state__action">{action}</div> : null}
    </div>
  );
}
