import api from './axios'

export const getOrders = async () => {
  const response = await api.get('/orders')
  return response.data
}

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`)
  return response.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status })
  return response.data
}

export const getOrderReceipt = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/receipt`)
  return response.data
}

export const requestCancelOrder = async (orderId, reason) => {
  const response = await api.post(`/orders/${orderId}/request-cancel`, {
    reason,
  })
  return response.data
}

export const adminCancelAndRefundOrder = async (orderId, reason) => {
  const response = await api.post(`/orders/${orderId}/admin-cancel-refund`, {
    reason,
  })
  return response.data
}

export const rejectCancelOrder = async (orderId, reason) => {
  const response = await api.post(`/orders/${orderId}/reject-cancel`, {
    reason,
  })
  return response.data
}

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders")
  return response.data
}
