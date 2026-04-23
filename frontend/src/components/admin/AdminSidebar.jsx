import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLowStockProducts } from "../../api/productService";
import { useAuth } from "@/store/useAuthStore";
import "./AdminLayout.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();

  const role = user?.role?.toLowerCase() || "staff";
  const fullName = user?.full_name || "User";

  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    fetchLowStockCount();
  }, []);

  const fetchLowStockCount = async () => {
    try {
      const data = await getLowStockProducts();
      setLowStockCount(data.length || 0);
    } catch (error) {
      console.error("Failed to load low stock count:", error);
    }
  };

  const handleLogout = () => {
    clearAuth?.();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menu = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      roles: ["admin", "manager", "staff"],
    },
    {
      label: "Orders",
      path: "/orders",
      icon: "🧾",
      roles: ["admin", "manager", "staff"],
    },
    {
      label: "Products",
      path: "/products",
      icon: "☕",
      roles: ["admin", "manager"],
    },
    {
      label: "Reports",
      path: "/reports",
      icon: "📈",
      roles: ["admin", "manager"],
    },
    {
      label: "Employees",
      path: "/employees",
      icon: "👥",
      roles: ["admin", "manager"],
    },
    {
      label: "Staff Scheduling",
      path: "/staff-scheduling",
      icon: "🗓️",
      roles: ["admin", "manager"],
    },
    {
      label: "System Control",
      path: "/system-control",
      icon: "🛠️",
      roles: ["admin"],
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-brand">
          <div className="admin-brand-logo">☕</div>
          <div>
            <h2>Kape Nga Ni</h2>
            <p>Admin Dashboard</p>
          </div>
        </div>

        <div className="admin-profile-mini">
          <div className="admin-profile-avatar">👤</div>
          <div>
            <strong>{fullName}</strong>
            <p>{role.toUpperCase()}</p>
          </div>
        </div>

        <div className="sidebar-alert-card">
          <div>
            <strong>Stock Alerts</strong>
            <p>Items needing replenishment</p>
          </div>
          <span className={`sidebar-alert-badge ${lowStockCount > 0 ? "danger" : "ok"}`}>
            {lowStockCount}
          </span>
        </div>

        <nav className="admin-nav">
          {menu
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <NavLink key={item.path} to={item.path} className="admin-nav-item">
                <span className="admin-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>
      </div>

      <button className="admin-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
