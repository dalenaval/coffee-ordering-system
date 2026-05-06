import { useEffect, useState } from 'react'
import { useAuth } from '@/store/useAuthStore'
import './UserMenu.css'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getMyOrders, requestCancelOrder } from '@/api/orderService'

const UserMenu = ({ isOpen, onClose }) => {
  const { logout, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true)
      const data = await getMyOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load my orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchMyOrders()
    }
  }, [isOpen, isAuthenticated])

  const handleRequestCancel = async (orderId) => {
    const result = await Swal.fire({
      title: 'Request order cancellation?',
      input: 'textarea',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'Please tell us why you want to cancel this order...',
      inputAttributes: {
        'aria-label': 'Cancellation reason',
      },
      showCancelButton: true,
      confirmButtonText: 'Submit Request',
      cancelButtonText: 'Close',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a cancellation reason.'
        }
      },
    })

    if (!result.isConfirmed) return

    try {
      await requestCancelOrder(orderId, result.value)

      await Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: 'Your cancellation request has been sent to the admin.',
      })

      fetchMyOrders()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Unable to Request Cancellation',
        text: error?.response?.data?.detail || 'Please try again later.',
      })
    }
  }

  const onLogout = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success',
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons
      .fire({
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          logout()
          navigate('/login')
        }
      })
  }

  const formatStatus = (status) => {
    return String(status || '')
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const canRequestCancel = (order) => {
    const status = String(order.status || '').toLowerCase()
    return ['pending', 'paid'].includes(status) && !order.cancel_requested
  }

  if (!isOpen) return null

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <div>
            <h2>Profile</h2>
            <p className="profile-subtitle">
              {user?.full_name || user?.email || 'Customer'}
            </p>
          </div>

          <button className="profile-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="profile-content">
          <div className="user-orders-section">
            <div className="user-orders-head">
              <div>
                <h3>My Orders</h3>
                <p>Track your recent orders and request cancellation when allowed.</p>
              </div>

              <button
                type="button"
                className="orders-refresh-btn"
                onClick={fetchMyOrders}
                disabled={loadingOrders}
              >
                Refresh
              </button>
            </div>

            {loadingOrders ? (
              <div className="orders-loading">Loading your orders...</div>
            ) : orders.length > 0 ? (
              <div className="user-orders-list">
                {orders.map((order) => {
                  const status = String(order.status || '').toLowerCase()
                  const statusClass = status.replaceAll(' ', '-')

                  return (
                    <div className="user-order-card" key={order.id}>
                      <div className="user-order-main">
                        <div className="user-order-top">
                          <strong>{order.order_no}</strong>
                          <span className={`user-order-status ${statusClass}`}>
                            {formatStatus(order.status)}
                          </span>
                        </div>

                        <p>
                          {formatStatus(order.order_type)} · ₱
                          {Number(order.total_amount || 0).toLocaleString()}
                        </p>

                        {order.cancel_requested && (
                          <div className="cancel-request-note">
                            Cancellation requested
                          </div>
                        )}

                        {order.cancel_reason && (
                          <div className="cancel-reason-text">
                            Reason: {order.cancel_reason}
                          </div>
                        )}

                        {order.refund_status && (
                          <div className="refund-status-text">
                            Refund: {formatStatus(order.refund_status)}
                          </div>
                        )}
                      </div>

                      {canRequestCancel(order) ? (
                        <button
                          type="button"
                          className="request-cancel-btn"
                          onClick={() => handleRequestCancel(order.id)}
                        >
                          Request Cancel
                        </button>
                      ) : order.cancel_requested ? (
                        <span className="cancel-request-label">
                          Pending Review
                        </span>
                      ) : (
                        <span className="cancel-disabled-label">
                          Not Cancellable
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="orders-empty">
                <h4>No orders yet</h4>
                <p>Your recent orders will appear here after checkout.</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-footer">
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenu
