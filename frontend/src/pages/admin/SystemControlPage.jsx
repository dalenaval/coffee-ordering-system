import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getSystemControls,
  updateSystemControl,
} from "../../api/systemControlService";
import "./AdminPages.css";

const SECTION_MAP = {
  website_ordering: "Order Controls",
  menu_visibility: "Order Controls",
  order_acceptance: "Order Controls",
  dine_in_enabled: "Order Controls",
  takeout_enabled: "Order Controls",
  pickup_enabled: "Order Controls",

  cash_enabled: "Payment Controls",
  gcash_enabled: "Payment Controls",
  card_enabled: "Payment Controls",
  tax_rate: "Payment Controls",
  service_charge: "Payment Controls",

  store_name: "Store Settings",
  opening_time: "Store Settings",
  closing_time: "Store Settings",
};

const BOOLEAN_KEYS = [
  "dine_in_enabled",
  "takeout_enabled",
  "pickup_enabled",
  "cash_enabled",
  "gcash_enabled",
  "card_enabled",
];

const ENUM_OPTIONS = {
  website_ordering: ["Enabled", "Disabled"],
  menu_visibility: ["Published", "Hidden"],
  order_acceptance: ["Open", "Closed"],
};

function prettifyKey(key) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SystemControlPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSystemControls();
      setSettings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load system settings:", err);
      setError("Failed to load system settings.");
    } finally {
      setLoading(false);
    }
  };

  const groupedSettings = useMemo(() => {
    const groups = {
      "Store Settings": [],
      "Order Controls": [],
      "Payment Controls": [],
      Other: [],
    };

    settings.forEach((item) => {
      const section = SECTION_MAP[item.setting_key] || "Other";
      groups[section].push(item);
    });

    return groups;
  }, [settings]);

  const handleChange = (id, value) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, setting_value: value } : item
      )
    );
  };

  const handleSave = async (item) => {
    try {
      setSavingId(item.id);

      await updateSystemControl(item.id, {
        setting_value: String(item.setting_value ?? ""),
      });

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: `${prettifyKey(item.setting_key)} updated successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchSettings();
    } catch (err) {
      console.error("Failed to update setting:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.response?.data?.detail || "Failed to update system setting.",
      });
    } finally {
      setSavingId(null);
    }
  };

  const renderInput = (item) => {
    const key = item.setting_key;
    const value = item.setting_value ?? "";

    if (BOOLEAN_KEYS.includes(key)) {
      return (
        <select
          className="settings-control"
          value={value}
          onChange={(e) => handleChange(item.id, e.target.value)}
        >
          <option value="1">Enabled</option>
          <option value="0">Disabled</option>
        </select>
      );
    }

    if (ENUM_OPTIONS[key]) {
      return (
        <select
          className="settings-control"
          value={value}
          onChange={(e) => handleChange(item.id, e.target.value)}
        >
          {ENUM_OPTIONS[key].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (key === "opening_time" || key === "closing_time") {
      return (
        <input
          className="settings-control"
          type="time"
          value={value}
          onChange={(e) => handleChange(item.id, e.target.value)}
        />
      );
    }

    if (key === "tax_rate" || key === "service_charge") {
      return (
        <input
          className="settings-control"
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => handleChange(item.id, e.target.value)}
        />
      );
    }

    return (
      <input
        className="settings-control"
        type="text"
        value={value}
        onChange={(e) => handleChange(item.id, e.target.value)}
      />
    );
  };

  return (
    <AdminLayout title="System Control">
      <section className="admin-hero-card">
        <span className="admin-hero-badge">🛠️ Configuration Center</span>
        <h2>System Control</h2>
        <p>
          Manage store settings, order behavior, payment options, and platform
          operations from one central control panel.
        </p>
      </section>

      {loading && <p>Loading system settings...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="admin-summary-grid">
            <div className="admin-summary-card">
              <h4>Total Settings</h4>
              <h2>{settings.length}</h2>
            </div>
            <div className="admin-summary-card">
              <h4>Order Controls</h4>
              <h2>{groupedSettings["Order Controls"]?.length || 0}</h2>
            </div>
            <div className="admin-summary-card">
              <h4>Payment Controls</h4>
              <h2>{groupedSettings["Payment Controls"]?.length || 0}</h2>
            </div>
          </div>

          <div className="system-control-grid">
            {Object.entries(groupedSettings).map(([sectionName, items]) =>
              items.length > 0 ? (
                <div className="system-section-card" key={sectionName}>
                  <div className="system-section-head">
                    <h3>{sectionName}</h3>
                    <p>{items.length} setting{items.length > 1 ? "s" : ""}</p>
                  </div>

                  <div className="system-setting-list">
                    {items.map((item) => (
                      <div className="system-setting-row" key={item.id}>
                        <div className="system-setting-info">
                          <h4>{prettifyKey(item.setting_key)}</h4>
                          <p>{item.description || "No description available."}</p>
                        </div>

                        <div className="system-setting-action">
                          {renderInput(item)}

                          <button
                            type="button"
                            className="system-save-btn"
                            onClick={() => handleSave(item)}
                            disabled={savingId === item.id}
                          >
                            {savingId === item.id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
