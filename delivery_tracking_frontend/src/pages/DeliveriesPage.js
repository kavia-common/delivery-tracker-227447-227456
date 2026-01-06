import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SidebarFilters from "../components/SidebarFilters";
import DeliveryList from "../components/DeliveryList";
import DeliveryDetails from "../components/DeliveryDetails";
import ErrorState from "../components/ErrorState";
import { listDeliveries, getDeliveryById, mergeDeliveryUpdate } from "../services/deliveryService";
import { MOCK_COURIERS } from "../mock/mockDeliveries";
import { shouldUseMocks } from "../services/config";
import { useDeliveryUpdates } from "../hooks/useDeliveryUpdates";

const DEFAULT_STATUSES = ["in-transit", "delivered", "delayed"];

function uniqueCouriers(deliveries) {
  const set = new Set();
  for (const d of deliveries || []) if (d?.courier) set.add(d.courier);
  return Array.from(set).sort();
}

// PUBLIC_INTERFACE
export default function DeliveriesPage({ theme, onToggleTheme }) {
  /** Main delivery tracking page (filters + list + detail panel). */
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState([...DEFAULT_STATUSES]);
  const [courier, setCourier] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const selectedId = id || selected?.id || "";

  const filters = useMemo(
    () => ({ query, statuses, courier, mineOnly, fromDate, toDate }),
    [query, statuses, courier, mineOnly, fromDate, toDate]
  );

  const couriers = useMemo(() => {
    const fromData = uniqueCouriers(deliveries);
    if (fromData.length) return fromData;
    return shouldUseMocks() ? MOCK_COURIERS : [];
  }, [deliveries]);

  const loadList = useCallback(async () => {
    setListError("");
    setListLoading(true);
    try {
      const items = await listDeliveries(filters);
      setDeliveries(items);
    } catch (e) {
      setListError("Unable to load deliveries.");
    } finally {
      setListLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    const loadDetails = async () => {
      if (!selectedId) {
        setSelected(null);
        return;
      }
      setDetailsLoading(true);
      try {
        const d = await getDeliveryById(selectedId);
        setSelected(d);
      } finally {
        setDetailsLoading(false);
      }
    };
    loadDetails();
  }, [selectedId]);

  const onSelect = useCallback(
    (deliveryId) => {
      navigate(`/deliveries/${encodeURIComponent(deliveryId)}`);
      setSidebarOpen(false);
    },
    [navigate]
  );

  const onToggleStatus = useCallback((s) => {
    setStatuses((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      return [...prev, s];
    });
  }, []);

  const onClear = useCallback(() => {
    setQuery("");
    setStatuses([...DEFAULT_STATUSES]);
    setCourier("");
    setMineOnly(false);
    setFromDate("");
    setToDate("");
  }, []);

  const onDeliveryUpdate = useCallback(
    (update) => {
      // Update list item if present
      setDeliveries((prev) =>
        prev.map((d) => (d.id === update.id ? mergeDeliveryUpdate(d, update) : d))
      );
      // Update selected details
      setSelected((prev) => (prev?.id === update.id ? mergeDeliveryUpdate(prev, update) : prev));
    },
    [setDeliveries, setSelected]
  );

  const { connection } = useDeliveryUpdates({ selectedId, onDeliveryUpdate });

  return (
    <div className="appShell">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="content">
        <SidebarFilters
          open={sidebarOpen}
          statuses={statuses}
          onToggleStatus={onToggleStatus}
          courier={courier}
          couriers={couriers}
          onCourierChange={setCourier}
          mineOnly={mineOnly}
          onMineOnlyChange={setMineOnly}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onClear={onClear}
        />

        <main className="main" aria-label="Delivery tracking content">
          <section className="panel panel--list" aria-label="Deliveries list">
            <div className="panel__header">
              <div>
                <div className="panel__title">Deliveries</div>
                <div className="panel__subtitle">
                  {shouldUseMocks() ? "Mock mode (no backend configured)" : "Connected"}
                </div>
              </div>
              <button className="btn btn--ghost btn--sm" type="button" onClick={loadList}>
                Refresh
              </button>
            </div>

            {listError ? (
              <ErrorState title="Failed to load" description={listError} onRetry={loadList} />
            ) : (
              <DeliveryList
                deliveries={deliveries}
                selectedId={selectedId}
                loading={listLoading}
                onSelect={onSelect}
              />
            )}
          </section>

          <section className="panel panel--details" aria-label="Delivery details panel">
            <DeliveryDetails delivery={selected} loading={detailsLoading} connection={connection} />
          </section>
        </main>
      </div>

      {/* Mobile overlay to close sidebar */}
      <button
        type="button"
        className={`overlay ${sidebarOpen ? "overlay--show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close filters sidebar"
      />
    </div>
  );
}
