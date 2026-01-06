import React from "react";

// PUBLIC_INTERFACE
export default function SidebarFilters({
  open,
  statuses,
  onToggleStatus,
  courier,
  couriers,
  onCourierChange,
  mineOnly,
  onMineOnlyChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onClear,
}) {
  /** Left sidebar filters; collapses on small screens. */
  return (
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`} aria-label="Filters">
      <div className="sidebar__header">
        <div className="sidebar__title">Filters</div>
        <button className="btn btn--ghost btn--sm" type="button" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="card card--inset">
        <div className="card__title">Status</div>

        <label className="check">
          <input
            type="checkbox"
            checked={statuses.includes("in-transit")}
            onChange={() => onToggleStatus("in-transit")}
            aria-label="Filter status: in transit"
          />
          <span>In transit</span>
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={statuses.includes("delivered")}
            onChange={() => onToggleStatus("delivered")}
            aria-label="Filter status: delivered"
          />
          <span>Delivered</span>
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={statuses.includes("delayed")}
            onChange={() => onToggleStatus("delayed")}
            aria-label="Filter status: delayed"
          />
          <span>Delayed</span>
        </label>
      </div>

      <div className="card card--inset">
        <div className="card__title">Date range (ETA)</div>
        <div className="grid2">
          <label className="field">
            <span className="field__label">From</span>
            <input
              className="input"
              type="date"
              value={fromDate || ""}
              onChange={(e) => onFromDateChange(e.target.value)}
              aria-label="ETA from date"
            />
          </label>
          <label className="field">
            <span className="field__label">To</span>
            <input
              className="input"
              type="date"
              value={toDate || ""}
              onChange={(e) => onToDateChange(e.target.value)}
              aria-label="ETA to date"
            />
          </label>
        </div>
      </div>

      <div className="card card--inset">
        <div className="card__title">Courier</div>
        <label className="field">
          <span className="field__label">Carrier</span>
          <select
            className="input"
            value={courier}
            onChange={(e) => onCourierChange(e.target.value)}
            aria-label="Filter by courier"
          >
            <option value="">All couriers</option>
            {couriers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="check check--switch">
          <input
            type="checkbox"
            checked={mineOnly}
            onChange={(e) => onMineOnlyChange(e.target.checked)}
            aria-label="Show only my deliveries"
          />
          <span>My deliveries</span>
        </label>
      </div>
    </aside>
  );
}
