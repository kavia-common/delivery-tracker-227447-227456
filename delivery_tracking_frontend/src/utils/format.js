// PUBLIC_INTERFACE
export function formatDateTime(iso) {
  /** Format an ISO date into a readable local date/time string. */
  if (!iso) return "—";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// PUBLIC_INTERFACE
export function etaLabel(iso) {
  /** Create an "ETA in Xh Ym" label. */
  if (!iso) return "ETA —";
  const dt = new Date(iso);
  const now = new Date();
  if (Number.isNaN(dt.getTime())) return "ETA —";

  const diff = dt.getTime() - now.getTime();
  const sign = diff < 0 ? "-" : "";
  const abs = Math.abs(diff);

  const mins = Math.round(abs / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h === 0) return `ETA ${sign}${m}m`;
  return `ETA ${sign}${h}h ${m}m`;
}
