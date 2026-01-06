import { useEffect, useMemo, useRef, useState } from "react";
import { getWebSocketUrl, shouldUseMocks } from "../services/config";
import { createDeliveryWsClient } from "../services/wsClient";
import { getDeliveryById } from "../services/deliveryService";

/**
 * Uses WebSocket if REACT_APP_WS_URL is set, otherwise polling.
 * Polling is disabled when mocks are used (mock list is static).
 */

// PUBLIC_INTERFACE
export function useDeliveryUpdates({ selectedId, onDeliveryUpdate }) {
  /** Provides connection state and background update mechanism for the selected delivery. */
  const [connection, setConnection] = useState({ connected: false, mode: "disabled" });
  const wsUrl = getWebSocketUrl();
  const isMock = shouldUseMocks();

  const backoffRef = useRef(2500);
  const timerRef = useRef(null);

  const wsClient = useMemo(() => {
    if (!wsUrl) return null;
    return createDeliveryWsClient({
      onDeliveryUpdate,
      onConnectionChange: setConnection,
    });
  }, [wsUrl, onDeliveryUpdate]);

  useEffect(() => {
    if (wsClient) {
      wsClient.connect();
      return () => wsClient.disconnect();
    }
    return undefined;
  }, [wsClient]);

  useEffect(() => {
    if (wsClient) return undefined; // WS mode
    if (isMock) {
      setConnection({ connected: false, mode: "mock" });
      return undefined;
    }

    setConnection({ connected: false, mode: "polling" });

    const poll = async () => {
      if (!selectedId) return;

      try {
        const updated = await getDeliveryById(selectedId);
        if (updated) onDeliveryUpdate(updated);
        // Reset backoff on success
        backoffRef.current = 2500;
      } catch {
        // Exponential backoff up to 30s
        backoffRef.current = Math.min(backoffRef.current * 1.6, 30000);
      } finally {
        timerRef.current = setTimeout(poll, backoffRef.current);
      }
    };

    timerRef.current = setTimeout(poll, backoffRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [wsClient, isMock, selectedId, onDeliveryUpdate]);

  return { connection };
}
