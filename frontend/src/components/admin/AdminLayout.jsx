import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

export default function AdminLayout({ children, title }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-page-topbar">
          <div>
            <p className="admin-page-kicker">Kape Nga Ni Admin Panel</p>
            <h1 className="admin-page-title">{title}</h1>
          </div>
        </div>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
