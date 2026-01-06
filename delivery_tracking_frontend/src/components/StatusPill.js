import React from "react";

/**
 * @param {{status: "in-transit"|"delivered"|"delayed"}} props
 */
export default function StatusPill({ status }) {
  const label =
    status === "delivered" ? "Delivered" : status === "delayed" ? "Delayed" : "In transit";

  const className =
    status === "delivered"
      ? "pill pill--delivered"
      : status === "delayed"
      ? "pill pill--delayed"
      : "pill pill--intransit";

  return (
    <span className={className} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
}
