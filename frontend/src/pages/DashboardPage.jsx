import { useNavigate } from "react-router-dom";
import "./DashBoardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    {
      title: "Orders Today",
      value: "128",
      desc: "Active, preparing, and completed customer orders.",
      icon: "🧾",
    },
    {
      title: "Menu Items",
      value: "42",
      desc: "Available drinks, meals, and add-ons in the platform.",
      icon: "☕",
    },
    {
      title: "Customers",
      value: "356",
      desc: "Customer transactions recorded in the system.",
      icon: "👥",
    },
    {
      title: "Sales Today",
      value: "₱18,420",
      desc: "Sales recorded from completed transactions.",
      icon: "💳",
    },
  ];

  const modules = [
    {
      title: "Order Monitoring",
      desc: "Track live customer orders from creation up to completion.",
      badge: "Core",
    },
    {
      title: "Digital Menu Management",
      desc: "Manage categories, products, pricing, and item availability.",
      badge: "Core",
    },
    {
      title: "Checkout & Payments",
      desc: "Handle customer checkout flow and payment processing.",
      badge: "Core",
    },
    {
      title: "Customer Management",
      desc: "Capture customer information and order-related details.",
      badge: "Operational",
    },
    {
      title: "Reports & Analytics",
      desc: "Review performance, sales summary, and café activity.",
      badge: "Management",
    },
  ];

  const activities = [
    "System login successful",
    "Dashboard initialized successfully",
    "Orders module ready for integration",
    "Menu module ready for setup",
    "Reports section prepared for expansion",
  ];

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div>
          <div className="dash-brand">
            <div className="dash-brand-logo">☕</div>
            <div className="dash-brand-text">
              <h2>Kape Nga Ni</h2>
              <p>Admin Panel</p>
            </div>
          </div>

          <nav className="dash-nav">
            <button className="dash-nav-item active">
              <span>📊</span>
              <span>Dashboard</span>
            </button>
            <button className="dash-nav-item">
              <span>🧾</span>
              <span>Orders</span>
            </button>
            <button className="dash-nav-item">
              <span>☕</span>
              <span>Menu</span>
            </button>
            <button className="dash-nav-item">
              <span>👥</span>
              <span>Customers</span>
            </button>
            <button className="dash-nav-item">
              <span>💳</span>
              <span>Payments</span>
            </button>
            <button className="dash-nav-item">
              <span>📈</span>
              <span>Reports</span>
            </button>
            <button className="dash-nav-item">
              <span>👤</span>
              <span>Users</span>
            </button>
            <button className="dash-nav-item">
              <span>⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="dash-sidebar-bottom">
          <div className="dash-help-card">
            <p className="dash-help-label">System Status</p>
            <h4>All modules are ready</h4>
            <span>Dashboard connected successfully.</span>
          </div>

          <button className="dash-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div>
            <p className="dash-welcome">Welcome back,</p>
            <h1>{user?.full_name || "System Admin"}</h1>
            <div className="dash-role-chip">{user?.role || "admin"}</div>
          </div>

          <div className="dash-user-card">
            <div className="dash-user-avatar">👤</div>
            <div>
              <h3>{user?.full_name || "System Admin"}</h3>
              <p>{user?.email || "admin@kapengani.com"}</p>
            </div>
          </div>
        </header>

        <section className="dash-hero">
          <div className="dash-hero-content">
            <div className="dash-hero-badge">Kiosk to Web Platform</div>
            <h2>Operations Overview</h2>
            <p>
              Manage orders, menu, customers, checkout flow, and payments in one
              centralized system designed for Kape Nga Ni.
            </p>
          </div>
        </section>

        <section className="dash-stats">
          {stats.map((item, index) => (
            <div className="dash-stat-card" key={index}>
              <div className="dash-stat-header">
                <div className="dash-stat-icon">{item.icon}</div>
                <span>{item.title}</span>
              </div>
              <h3>{item.value}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-head">
              <h3>System Modules</h3>
              <p>Aligned with the ordering process flow</p>
            </div>

            <div className="dash-module-list">
              {modules.map((item, index) => (
                <div className="dash-module-item" key={index}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <span className="dash-badge">{item.badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-head">
              <h3>Recent Activity</h3>
              <p>Latest system events</p>
            </div>

            <div className="dash-activity-list">
              {activities.map((activity, index) => (
                <div className="dash-activity-item" key={index}>
                  <span className="dash-activity-dot"></span>
                  <p>{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
