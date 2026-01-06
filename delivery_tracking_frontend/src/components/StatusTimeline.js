import React from "react";
import { formatDateTime } from "../utils/format";
import StatusPill from "./StatusPill";

export default function StatusTimeline({ events }) {
  const items = Array.isArray(events) ? [...events] : [];
  items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <ol className="timeline" aria-label="Status timeline">
      {items.map((e) => (
        <li key={e.id} className="timeline__item">
          <div className="timeline__dot" aria-hidden="true" />
          <div className="timeline__content">
            <div className="timeline__row">
              <StatusPill status={e.status} />
              <div className="muted">{formatDateTime(e.timestamp)}</div>
            </div>
            <div className="timeline__msg">{e.message}</div>
            {e.location ? <div className="timeline__loc muted">{e.location}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
