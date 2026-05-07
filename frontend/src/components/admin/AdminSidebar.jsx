import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/useAuthStore'
import './AdminLayout.css'
import { useGetLowStockProducts } from '@/hooks/useDashboardQuery'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const role = user?.role?.toLowerCase() || 'staff'
  const fullName = user?.full_name || 'User'

  const { data: lowStockProducts } = useGetLowStockProducts()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menu = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
      roles: ['admin', 'manager', 'staff'],
    },
    {
      label: 'Orders',
      path: '/orders',
      icon: '🧾',
      roles: ['admin', 'manager', 'staff'],
    },
    {
      label: 'Products',
      path: '/products',
      icon: '☕',
      roles: ['admin', 'manager'],
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: '📈',
      roles: ['admin', 'manager'],
    },
    {
      label: 'Employees',
      path: '/employees',
      icon: '👥',
      roles: ['admin', 'manager'],
    },
    {
      label: 'Staff Scheduling',
      path: '/staff-scheduling',
      icon: '🗓️',
      roles: ['admin', 'manager'],
    },
    {
      label: 'System Control',
      path: '/system-control',
      icon: '🛠️',
      roles: ['admin'],
    },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="admin-header-group">
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
          <span className={`sidebar-alert-badge ${lowStockProducts?.length > 0 ? 'danger' : 'ok'}`}>
            {lowStockProducts?.length || 0}
          </span>
        </div>
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

      <button className="admin-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}
