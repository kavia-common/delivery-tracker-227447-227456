import React from "react";

// PUBLIC_INTERFACE
export default function Navbar({ query, onQueryChange, theme, onToggleTheme, onToggleSidebar }) {
  /** Top navigation bar with search input and optional theme toggle. */
  return (
    <header className="nav">
      <div className="nav__left">
        <button
          className="iconbtn nav__menuBtn"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle filters sidebar"
        >
          ☰
        </button>
        <div className="nav__brand">
          <div className="nav__title">Delivery Tracker</div>
          <div className="nav__subtitle">Real-time order monitoring</div>
        </div>
      </div>

      <div className="nav__center">
        <label className="search" aria-label="Search deliveries">
          <span className="search__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            className="search__input"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by order ID, recipient, address, courier…"
            aria-label="Search by order ID, recipient, address, courier"
          />
        </label>
      </div>

      <div className="nav__right">
        {onToggleTheme ? (
          <button
            className="btn btn--ghost"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        ) : null}
      </div>
    </header>
  );
}
