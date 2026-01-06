import { getWebSocketUrl } from "./config";

/**
 * WebSocket update format (best-effort):
 * {
 *   type: "delivery.updated",
 *   delivery: { ...partialDelivery }
 * }
 *
 * This client is defensive and will ignore unknown messages.
 */

// PUBLIC_INTERFACE
export function createDeliveryWsClient({ onDeliveryUpdate, onConnectionChange } = {}) {
  /** Create a WS client that emits delivery updates when configured; no-ops otherwise. */
  const url = getWebSocketUrl();
  let socket = null;
  let closedByUser = false;

  const notifyConn = (state) => {
    if (typeof onConnectionChange === "function") onConnectionChange(state);
  };

  const safeEmitUpdate = (payload) => {
    if (typeof onDeliveryUpdate === "function") onDeliveryUpdate(payload);
  };

  const connect = () => {
    if (!url) {
      notifyConn({ connected: false, mode: "disabled" });
      return;
    }
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;

    closedByUser = false;
    notifyConn({ connected: false, mode: "connecting" });

    socket = new WebSocket(url);

    socket.onopen = () => notifyConn({ connected: true, mode: "ws" });

    socket.onclose = () => {
      notifyConn({ connected: false, mode: "ws" });
      socket = null;
      // Auto-reconnect unless explicitly closed by user.
      if (!closedByUser) {
        setTimeout(() => connect(), 1500);
      }
    };

    socket.onerror = () => {
      // Let onclose handle reconnection.
      notifyConn({ connected: false, mode: "ws-error" });
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const delivery = msg?.delivery || msg?.payload?.delivery || msg?.data?.delivery;
        if (msg?.type === "delivery.updated" || msg?.type === "delivery.update" || delivery) {
          if (delivery) safeEmitUpdate(delivery);
        }
      } catch {
        // Ignore non-JSON payloads.
      }
    };
  };

  const disconnect = () => {
    closedByUser = true;
    if (socket) socket.close();
    socket = null;
    notifyConn({ connected: false, mode: url ? "ws" : "disabled" });
  };

  const send = (payload) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(payload));
    return true;
  };

  return { connect, disconnect, send };
}
