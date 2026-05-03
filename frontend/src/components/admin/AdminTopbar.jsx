import { useAuth } from '@/store/useAuthStore'
import { NavLink, useNavigate } from 'react-router-dom'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth() // Access auth store for user data

  const handleLogout = () => {
    // localStorage.removeItem("user");
    logout() // Clear auth state in store
    navigate('/login')
  }

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

        <nav className="admin-nav">
          <NavLink to="/dashboard" className="admin-nav-item">
            Dashboard
          </NavLink>
          <NavLink to="/orders" className="admin-nav-item">
            Orders
          </NavLink>
          <NavLink to="/products" className="admin-nav-item">
            Products
          </NavLink>
          <NavLink to="/categories" className="admin-nav-item">
            Categories
          </NavLink>
          <NavLink to="/customers" className="admin-nav-item">
            Customers
          </NavLink>
          <NavLink to="/payments" className="admin-nav-item">
            Payments
          </NavLink>
          <NavLink to="/users" className="admin-nav-item">
            Users
          </NavLink>
          <NavLink to="/reports" className="admin-nav-item">
            Reports
          </NavLink>
        </nav>
      </div>

      <button className="admin-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}
