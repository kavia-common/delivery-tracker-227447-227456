import React from "react";
import DeliveryListItem from "./DeliveryListItem";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

// PUBLIC_INTERFACE
export default function DeliveryList({ deliveries, selectedId, loading, onSelect }) {
  /** Renders the left list of deliveries (search results). */
  if (loading) return <LoadingState label="Loading deliveries…" />;

  if (!deliveries || deliveries.length === 0) {
    return (
      <EmptyState
        title="No deliveries found"
        description="Try adjusting your search or filters."
      />
    );
  }

  return (
    <div className="list" role="list" aria-label="Deliveries">
      {deliveries.map((d) => (
        <DeliveryListItem
          key={d.id}
          delivery={d}
          selected={d.id === selectedId}
          onClick={() => onSelect(d.id)}
        />
      ))}
    </div>
  );
}
