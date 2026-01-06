import { getApiBaseUrl, shouldUseMocks } from "./config";
import { MOCK_DELIVERIES } from "../mock/mockDeliveries";

/**
 * NOTE: This app supports a "no backend configured" mode.
 * - If REACT_APP_API_BASE or REACT_APP_BACKEND_URL is set, we'll call REST endpoints.
 * - Otherwise we use mock data.
 *
 * Expected REST shape (best-effort):
 * - GET   /deliveries?query=&status=&courier=&mine=&from=&to=
 * - GET   /deliveries/:id
 *
 * If the backend differs, this module is the only place to adjust.
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function normalizeStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "in_transit" || s === "intransit") return "in-transit";
  if (s === "delivered") return "delivered";
  if (s === "delayed" || s === "exception") return "delayed";
  return s || "in-transit";
}

function normalizeDelivery(raw) {
  if (!raw) return null;

  const timeline = Array.isArray(raw.timeline || raw.events)
    ? (raw.timeline || raw.events).map((e, idx) => ({
        id: e.id || `${raw.id || raw.orderId || "evt"}-${idx}`,
        timestamp: e.timestamp || e.time || e.createdAt || new Date().toISOString(),
        status: normalizeStatus(e.status),
        message: e.message || e.note || e.description || "Status update",
        location: e.location,
      }))
    : [];

  return {
    id: raw.id || raw.orderId || raw.trackingId,
    recipient: raw.recipient || raw.customer || raw.recipientName || "Unknown",
    address: raw.address || raw.destination || raw.deliveryAddress || "—",
    courier: raw.courier || raw.carrier || "—",
    status: normalizeStatus(raw.status),
    eta: raw.eta || raw.estimatedDelivery || raw.estimatedArrival || new Date().toISOString(),
    mine: Boolean(raw.mine ?? raw.isMine ?? false),
    timeline,
  };
}

function applyLocalFilters(deliveries, filters) {
  const q = (filters.query || "").trim().toLowerCase();
  const statusSet = new Set((filters.statuses || []).filter(Boolean));
  const courier = (filters.courier || "").trim();
  const mineOnly = Boolean(filters.mineOnly);
  const from = filters.fromDate ? new Date(filters.fromDate) : null;
  const to = filters.toDate ? new Date(filters.toDate) : null;

  return deliveries
    .filter(Boolean)
    .filter((d) => (statusSet.size ? statusSet.has(d.status) : true))
    .filter((d) => (courier ? d.courier === courier : true))
    .filter((d) => (mineOnly ? d.mine : true))
    .filter((d) => {
      if (!from && !to) return true;
      const eta = new Date(d.eta);
      if (Number.isNaN(eta.getTime())) return true;
      if (from && eta < from) return false;
      if (to && eta > to) return false;
      return true;
    })
    .filter((d) => {
      if (!q) return true;
      return (
        d.id.toLowerCase().includes(q) ||
        d.recipient.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.courier.toLowerCase().includes(q)
      );
    });
}

// PUBLIC_INTERFACE
export async function listDeliveries(filters = {}) {
  /** Fetch deliveries list with optional filters; falls back to mocks if backend unavailable. */
  if (shouldUseMocks()) {
    await sleep(250);
    return applyLocalFilters(MOCK_DELIVERIES, filters);
  }

  const base = getApiBaseUrl();
  const url = new URL(`${base.replace(/\/$/, "")}/deliveries`);
  if (filters.query) url.searchParams.set("query", filters.query);
  if (filters.statuses?.length) url.searchParams.set("status", filters.statuses.join(","));
  if (filters.courier) url.searchParams.set("courier", filters.courier);
  if (filters.mineOnly) url.searchParams.set("mine", "true");
  if (filters.fromDate) url.searchParams.set("from", filters.fromDate);
  if (filters.toDate) url.searchParams.set("to", filters.toDate);

  try {
    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items || data.deliveries || [];
    return items.map(normalizeDelivery).filter(Boolean);
  } catch (e) {
    // Graceful fallback to mocks if backend errors.
    await sleep(150);
    return applyLocalFilters(MOCK_DELIVERIES, filters);
  }
}

// PUBLIC_INTERFACE
export async function getDeliveryById(id) {
  /** Fetch a single delivery by id; falls back to mock lookup if backend unavailable. */
  const safeId = String(id || "").trim();
  if (!safeId) return null;

  if (shouldUseMocks()) {
    await sleep(150);
    return MOCK_DELIVERIES.find((d) => d.id === safeId) || null;
  }

  const base = getApiBaseUrl();
  const url = `${base.replace(/\/$/, "")}/deliveries/${encodeURIComponent(safeId)}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return normalizeDelivery(data);
  } catch (e) {
    await sleep(100);
    return MOCK_DELIVERIES.find((d) => d.id === safeId) || null;
  }
}

// PUBLIC_INTERFACE
export function mergeDeliveryUpdate(existing, update) {
  /**
   * Merge a partial delivery update into an existing Delivery object.
   * Used for polling and WebSocket updates.
   */
  if (!existing) return update || null;
  if (!update) return existing;

  const merged = {
    ...existing,
    ...update,
    status: update.status ? normalizeStatus(update.status) : existing.status,
    timeline: existing.timeline,
  };

  if (Array.isArray(update.timeline) && update.timeline.length) {
    const byId = new Map(existing.timeline.map((e) => [e.id, e]));
    for (const e of update.timeline) {
      const normalized = {
        id: e.id || `${merged.id}-${Math.random().toString(16).slice(2)}`,
        timestamp: e.timestamp || new Date().toISOString(),
        status: normalizeStatus(e.status),
        message: e.message || "Status update",
        location: e.location,
      };
      byId.set(normalized.id, normalized);
    }
    merged.timeline = Array.from(byId.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  return merged;
}
