import React from "react";
import StatusPill from "./StatusPill";
import StatusTimeline from "./StatusTimeline";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import { etaLabel, formatDateTime } from "../utils/format";

// PUBLIC_INTERFACE
export default function DeliveryDetails({ delivery, loading, connection }) {
  /** Shows details of the selected delivery including timeline and meta. */
  if (loading) return <LoadingState label="Loading delivery details…" />;

  if (!delivery) {
    return (
      <EmptyState
        title="Select a delivery"
        description="Choose an order from the list to see address, courier, and status updates."
      />
    );
  }

  return (
    <div className="details" aria-label="Delivery details">
      <div className="details__header">
        <div>
          <div className="mono details__id">{delivery.id}</div>
          <div className="details__recipient">{delivery.recipient}</div>
        </div>

        <div className="details__headerRight">
          <StatusPill status={delivery.status} />
          <div className="muted">{etaLabel(delivery.eta)}</div>
        </div>
      </div>

      <div className="card">
        <div className="kv">
          <div className="kv__row">
            <div className="kv__k">Address</div>
            <div className="kv__v">{delivery.address}</div>
          </div>
          <div className="kv__row">
            <div className="kv__k">Courier</div>
            <div className="kv__v">{delivery.courier}</div>
          </div>
          <div className="kv__row">
            <div className="kv__k">ETA</div>
            <div className="kv__v">{formatDateTime(delivery.eta)}</div>
          </div>
          <div className="kv__row">
            <div className="kv__k">Updates</div>
            <div className="kv__v muted">
              {connection?.mode === "ws" && connection?.connected ? "Live (WebSocket)" : null}
              {connection?.mode === "polling" ? "Polling" : null}
              {connection?.mode === "mock" ? "Mock data" : null}
              {connection?.mode === "disabled" ? "Offline" : null}
              {connection?.mode === "connecting" ? "Connecting…" : null}
              {connection?.mode === "ws-error" ? "WebSocket error" : null}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__title">Timeline</div>
        {delivery.timeline?.length ? (
          <StatusTimeline events={delivery.timeline} />
        ) : (
          <div className="muted">No timeline events available.</div>
        )}
      </div>
    </div>
  );
}
