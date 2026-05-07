import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminPages.css'
import { useGetOrderDetails, useGetOrders, useUpdateOrderStatus } from '@/hooks/useOrderQuery'
import { toCapitalize } from '@/utils/toCapitalize'
import { adminCancelAndRefundOrder, rejectCancelOrder } from '../../api/orderService'

export default function OrdersPage() {
  const queryClient = useQueryClient()

  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { data: orders = [], isLoading: isOrdersLoading } = useGetOrders()
  const { data: orderDetails, isLoading: isOrderDetailsLoading } = useGetOrderDetails(selectedOrderId)

  const { mutate: mutateOrderStatus } = useUpdateOrderStatus()

  const refreshOrders = async () => {
    await queryClient.invalidateQueries({ queryKey: ['orders'] })

    if (selectedOrderId) {
      await queryClient.invalidateQueries({
        queryKey: ['order_details', selectedOrderId],
      })
    }
  }

  const normalize = (value) => String(value || '').toLowerCase()

  const handleOpenModal = (order) => {
    setSelectedOrderId(order?.id)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setSelectedOrderId(null)
    setShowModal(false)
  }

  const handleStatusChange = (orderId, status) => {
    mutateOrderStatus(
      { orderId, status },
      {
        onSuccess: async () => {
          await refreshOrders()
        },
      }
    )
  }

  const handleAdminCancelRefund = async (orderId) => {
    const reason = window.prompt('Enter refund/cancellation reason:')

    if (!reason) return

    try {
      await adminCancelAndRefundOrder(orderId, reason)
      await refreshOrders()
      alert('Order cancelled and refunded successfully.')
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to cancel and refund order.')
    }
  }

  const handleRejectCancel = async (orderId) => {
    const reason = window.prompt('Enter rejection reason:')

    if (!reason) return

    try {
      await rejectCancelOrder(orderId, reason)
      await refreshOrders()
      alert('Cancellation request rejected.')
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to reject cancellation.')
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase()

      const matchSearch = normalize(order.order_no).includes(q) || normalize(order.customer_name).includes(q)

      const matchStatus = statusFilter === '' || normalize(order.status) === normalize(statusFilter)

      return matchSearch && matchStatus
    })
  }, [orders, search, statusFilter])

  const selectedPayment = Array.isArray(orderDetails?.payment) ? orderDetails.payment[0] : orderDetails?.payment

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
            <option value="paid">Paid</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancel requested">Cancel Requested</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <button type="button" onClick={refreshOrders}>
            Refresh
          </button>
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
                <th>Cancel Request</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isOrdersLoading ? (
                <tr>
                  <td colSpan={7} className="empty-state-cell">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const orderStatus = normalize(order.status)
                  const hasCancelRequest = order.cancel_requested || orderStatus === 'cancel requested'

                  return (
                    <tr key={order.id}>
                      <td>{order.order_no}</td>
                      <td>{order.customer_name || 'Walk-in Customer'}</td>
                      <td>{toCapitalize(order.order_type)}</td>
                      <td>
                        <span className={`badge ${orderStatus.replaceAll(' ', '-')}`}>
                          {toCapitalize(order.status)}
                        </span>
                      </td>
                      <td>₱{Number(order.total_amount || 0).toLocaleString()}</td>
                      <td className="cancel-request-column">
                        {hasCancelRequest ? (
                          <div className="cancel-request-cell">
                            <span className="badge cancel-request-badge">Requested</span>

                            {order.cancel_reason && (
                              <div className="cancel-request-reason" title={order.cancel_reason}>
                                {order.cancel_reason.length > 28
                                  ? `${order.cancel_reason.slice(0, 28)}...`
                                  : order.cancel_reason}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="muted-text">None</span>
                        )}
                      </td>
                      <td className="table-actions">
                        <button type="button" className="admin-action-btn" onClick={() => handleOpenModal(order)}>
                          View Details
                        </button>

                        <select
                          value={normalize(order.status)}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={orderStatus === 'refunded' || orderStatus === 'cancelled'}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {hasCancelRequest && (
                          <>
                            <button
                              type="button"
                              className="admin-action-btn danger"
                              onClick={() => handleAdminCancelRefund(order.id)}
                            >
                              Refund
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => handleRejectCancel(order.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="empty-state-cell">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h3>Order Details</h3>
                <p>Customer order information and items</p>
                {orderDetails?.created_at && <p>{new Date(orderDetails.created_at).toLocaleString()}</p>}
              </div>

              <button type="button" className="admin-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            {isOrderDetailsLoading || !orderDetails ? (
              <div className="empty-state-cell">Loading order details...</div>
            ) : (
              <>
                <div className="admin-modal-grid">
                  <div className="admin-detail-item">
                    <label>Order No.</label>
                    <span>{orderDetails.order_no}</span>
                  </div>

                  <div className="admin-detail-item">
                    <label>Customer</label>
                    <span>{orderDetails.customer_name || 'Walk-in Customer'}</span>
                  </div>

                  <div className="admin-detail-item">
                    <label>Email</label>
                    <span>{orderDetails.email || 'N/A'}</span>
                  </div>

                  <div className="admin-detail-item">
                    <label>Phone</label>
                    <span>{orderDetails.phone || 'N/A'}</span>
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
                    <span>₱{Number(orderDetails.subtotal || 0).toLocaleString()}</span>
                  </div>

                  <div className="admin-detail-item">
                    <label>Total</label>
                    <span>₱{Number(orderDetails.total_amount || 0).toLocaleString()}</span>
                  </div>

                  <div className="admin-detail-item">
                    <label>Payment Method</label>
                    <span>{selectedPayment?.payment_method || 'N/A'}</span>
                  </div>

                  <div className="admin-detail-item">
                    <label>Payment Status</label>
                    <span>{selectedPayment?.payment_status || 'N/A'}</span>
                  </div>

                  {orderDetails.cancel_reason && (
                    <div className="admin-detail-item wide cancel-reason-box">
                      <label>Customer Cancellation Reason</label>
                      <span>{orderDetails.cancel_reason}</span>
                    </div>
                  )}

                  {orderDetails.cancel_requested && (
                    <div className="admin-detail-item">
                      <label>Cancellation Status</label>
                      <span>Requested</span>
                    </div>
                  )}

                  {orderDetails.refund_status && (
                    <div className="admin-detail-item">
                      <label>Refund Status</label>
                      <span>{orderDetails.refund_status}</span>
                    </div>
                  )}
                </div>

                {orderDetails.cancel_requested && (
                  <div className="admin-cancel-panel">
                    <div>
                      <h4>Cancellation Requested</h4>
                      <p>{orderDetails.cancel_reason || 'No reason provided.'}</p>
                    </div>

                    <div className="table-actions">
                      <button
                        type="button"
                        className="admin-action-btn danger"
                        onClick={() => handleAdminCancelRefund(orderDetails.id)}
                      >
                        Cancel & Refund
                      </button>

                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleRejectCancel(orderDetails.id)}
                      >
                        Reject Request
                      </button>
                    </div>
                  </div>
                )}

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
                          <th>Add-ons</th>
                          <th>Line Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetails.items?.length > 0 ? (
                          orderDetails.items.map((item) => (
                            <tr key={item.id}>
                              <td>{item.product_name || `Product #${item.product_id}`}</td>
                              <td>{item.quantity}</td>
                              <td>₱{Number(item.unit_price || 0).toLocaleString()}</td>
                              <td>₱{Number(item.option_total || 0).toLocaleString()}</td>
                              <td>₱{Number(item.line_total || 0).toLocaleString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="empty-state-cell">
                              No order items found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
