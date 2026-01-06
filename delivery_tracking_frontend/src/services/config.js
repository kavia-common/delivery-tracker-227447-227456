/**
 * Centralized environment configuration.
 * IMPORTANT: URLs are read from environment variables only.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL or empty string if not set. */
  return (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "").trim();
}

// PUBLIC_INTERFACE
export function getWebSocketUrl() {
  /** Returns the configured WebSocket URL or empty string if not set. */
  return (process.env.REACT_APP_WS_URL || "").trim();
}

// PUBLIC_INTERFACE
export function shouldUseMocks() {
  /** Use mocks when no backend URL is configured. */
  return !getApiBaseUrl();
}
