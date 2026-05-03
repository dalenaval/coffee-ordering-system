import { useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminPages.css'
import { useGetOrderDetails, useGetOrders, useUpdateOrderStatus } from '@/hooks/useOrderQuery'
import { toCapitalize } from '@/utils/toCapitalize'

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const { data: orders, isLoading: isOrdersLoading } = useGetOrders()
  const { data: orderDetails } = useGetOrderDetails(selectedOrderId)
  const { mutate: updateOrderStatus } = useUpdateOrderStatus()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending') // Default to easily show pending orders on page load

  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = async (order) => {
    try {
      setSelectedOrderId(order?.id)
      setShowModal(true)
    } catch (error) {
      console.error('Failed to load order details:', error)
    }
  }

  const handleCloseModal = () => {
    setSelectedOrderId(null)
    setShowModal(false)
  }

  const filteredOrders = useMemo(() => {
    if (!orders && isOrdersLoading) return []
    return orders?.filter((order) => {
      const q = search.toLowerCase()
      const matchSearch = order.order_no?.toLowerCase().includes(q) || order.customer_name?.toLowerCase().includes(q)

      const matchStatus = statusFilter === '' || order.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [orders, search, statusFilter, isOrdersLoading])

  return (
    <AdminLayout title="Orders">
      <div className="admin-page-card">
        <div className="admin-page-head">
          <h2>Customer Orders</h2>
          <p>Manage and monitor customer transactions in real time.</p>
        </div>

        <div className="admin-toolbar">
          <input
            type="text"
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* <button type="button" onClick={fetchOrders}>
            Refresh
          </button> */}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Customer</th>
                <th>Order Type</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isOrdersLoading ? (
                <tr>
                  <td colSpan={6} className="empty-state-cell">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_no}</td>
                    <td>{order.customer_name}</td>
                    <td>{toCapitalize(order.order_type)} </td>
                    <td>
                      <span className={`badge ${order.status.toLowerCase()}`}>{toCapitalize(order.status)}</span>
                    </td>
                    <td>₱{Number(order.total_amount).toLocaleString()}</td>
                    <td className="table-actions">
                      <button type="button" className="admin-action-btn" onClick={() => handleOpenModal(order)}>
                        View Details
                      </button>

                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus({ orderId: order.id, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-state-cell">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && orderDetails && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h3>Order Details</h3>
                <p>Customer order information and items</p>
                <p>{orderDetails.created_at}</p>
              </div>
              <button type="button" className="admin-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="admin-modal-grid">
              <div className="admin-detail-item">
                <label>Order No.</label>
                <span>{orderDetails.order_no}</span>
              </div>
              <div className="admin-detail-item">
                <label>Customer</label>
                <span>{orderDetails.customer_name}</span>
              </div>
              <div className="admin-detail-item">
                <label>Order Type</label>
                <span>{toCapitalize(orderDetails.order_type)}</span>
              </div>
              <div className="admin-detail-item">
                <label>Status</label>
                <span>{toCapitalize(orderDetails.status)}</span>
              </div>
              <div className="admin-detail-item">
                <label>Subtotal</label>
                <span>₱{Number(orderDetails.subtotal).toLocaleString()}</span>
              </div>
              <div className="admin-detail-item">
                <label>Total</label>
                <span>₱{Number(orderDetails.total_amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="admin-page-card" style={{ marginTop: '20px', padding: '18px' }}>
              <div className="admin-page-head">
                <h2 style={{ fontSize: '22px' }}>Ordered Items</h2>
                <p>Products included in this order</p>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items?.length > 0 ? (
                      orderDetails.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>₱{Number(item.unit_price).toLocaleString()}</td>
                          <td>₱{Number(item.line_total).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-state-cell">
                          No order items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
