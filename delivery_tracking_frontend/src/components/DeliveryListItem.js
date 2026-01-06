import React from "react";
import StatusPill from "./StatusPill";
import { etaLabel, formatDateTime } from "../utils/format";

export default function DeliveryListItem({ delivery, selected, onClick }) {
  return (
    <button
      type="button"
      className={`listItem ${selected ? "listItem--selected" : ""}`}
      onClick={onClick}
      role="listitem"
      aria-label={`Open delivery ${delivery.id}`}
    >
      <div className="listItem__top">
        <div className="mono listItem__id">{delivery.id}</div>
        <StatusPill status={delivery.status} />
      </div>

      <div className="listItem__mid">
        <div className="listItem__recipient">{delivery.recipient}</div>
        <div className="listItem__courier">{delivery.courier}</div>
      </div>

      <div className="listItem__bottom">
        <div className="muted">{etaLabel(delivery.eta)}</div>
        <div className="muted">{formatDateTime(delivery.eta)}</div>
      </div>
    </button>
  );
}
