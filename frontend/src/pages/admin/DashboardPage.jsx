import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminPages.css'
import { toCapitalize } from '@/utils/toCapitalize'
import { useGetDashboardSummary, useGetLowStockProducts, useRestockProduct } from '@/hooks/useDashboardQuery'

export default function DashboardPage() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary()
  const { data: lowStockCount } = useGetLowStockProducts()
  const restockProduct = useRestockProduct()

  const [restockingId, setRestockingId] = useState(null)
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    productId: null,
    productName: '',
  })

  const openRestockModal = (productId, productName) => {
    setConfirmModal({
      open: true,
      productId,
      productName,
    })
  }

  const closeRestockModal = () => {
    setConfirmModal({
      open: false,
      productId: null,
      productName: '',
    })
  }

  const handleQuickRestock = () => {
    console.log(confirmModal.productId)
    try {
      setRestockingId(confirmModal.productId)

      const payloadData = {
        quantity: 10,
        remarks: 'Quick restock from dashboard',
      }

      restockProduct.mutate({ productId: confirmModal.productId, payload: payloadData })
      closeRestockModal()
    } catch (error) {
      console.error('Failed to restock product:', error)
    } finally {
      setRestockingId(null)
    }
  }

  if (isSummaryLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="admin-loading-state">Loading dashboard summary...</div>
      </AdminLayout>
    )
  }
  return (
    <AdminLayout title="Dashboard">
      <section className="admin-hero-card">
        <span className="admin-hero-badge">✨ Admin Overview</span>
        <h2>Kape Nga Ni Operations</h2>
        <p>Monitor orders, customers, products, employees, and café operations in one professional admin dashboard.</p>
      </section>

      <section className="admin-summary-grid">
        <div className="admin-summary-card summary-card orders">
          <h4>🧾 Orders</h4>
          <h2>{summary?.total_orders || 0}</h2>
        </div>

        <div className="admin-summary-card summary-card products">
          <h4>☕ Products</h4>
          <h2>{summary?.total_products || 0}</h2>
        </div>

        <div className="admin-summary-card summary-card customers">
          <h4>👥 Customers</h4>
          <h2>{summary?.total_customers || 0}</h2>
        </div>

        <div className="admin-summary-card summary-card sales">
          <h4>💰 Sales</h4>
          <h2>₱{Number(summary?.total_sales || 0).toLocaleString()}</h2>
        </div>
      </section>

      <section className="admin-page-card">
        <div className="admin-page-head">
          <h2>Low Stock Alerts</h2>
          <p>Products that need replenishment. Quick restock to clear alerts.</p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockCount.length > 0 ? (
                lowStockCount.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.stock}</td>
                    <td>{item.low_stock_threshold}</td>
                    <td>
                      <span className={`badge ${item.status === 'OUT OF STOCK' ? 'cancelled' : 'pending'}`}>
                        {toCapitalize(item.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => openRestockModal(item.id, item.name)}
                      >
                        Quick Restock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state-cell">
                    All stocks are healthy ✅
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-page-card" style={{ marginTop: '24px' }}>
        <div className="admin-page-head">
          <h2>Recent Orders</h2>
          <p>Latest customer transactions</p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Type</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {summary.recent_orders.length > 0 ? (
                summary.recent_orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_no}</td>
                    <td>{toCapitalize(order.order_type)}</td>
                    <td>
                      <span className={`badge ${order.status.toLowerCase()}`}>{toCapitalize(order.status)}</span>
                    </td>
                    <td>₱{Number(order.total_amount).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state-cell">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {confirmModal.open && (
        <div className="admin-modal-overlay" onClick={closeRestockModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-page-head">
              <h2>Confirm Restock</h2>
              <p>
                Add 10 stock units to <strong>{confirmModal.productName}</strong>?
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="admin-action-btn"
                style={{ background: '#d1d5db', color: '#111827', boxShadow: 'none' }}
                onClick={closeRestockModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-action-btn"
                onClick={handleQuickRestock}
                disabled={restockingId === confirmModal.productId}
              >
                {restockingId === confirmModal.productId ? 'Restocking...' : 'Confirm Restock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
