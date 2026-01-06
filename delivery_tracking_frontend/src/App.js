import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import DeliveriesPage from "./pages/DeliveriesPage";

// PUBLIC_INTERFACE
function App() {
  /** Root app: applies theme and sets up routes for delivery deep-links. */
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useMemo(
    () => () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/deliveries" replace />}
          />
          <Route
            path="/deliveries"
            element={<DeliveriesPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route
            path="/deliveries/:id"
            element={<DeliveriesPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route path="*" element={<Navigate to="/deliveries" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
