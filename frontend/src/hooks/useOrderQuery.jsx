import {
  adminCancelAndRefundOrder,
  getOrderDetails,
  getOrders,
  rejectCancelOrder,
  updateOrderStatus,
} from '@/api/orderService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

export const useGetOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })
}

export const useGetOrderDetails = (orderId) => {
  return useQuery({
    queryKey: ['order_details', orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId, // Only run this query if orderId is provided
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (response) => {
      console.log('Order status updated successfully:', response.status)
      if (response?.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] })
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      console.error('Failed to update order status:', error)
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, reason }) => adminCancelAndRefundOrder(orderId, reason),
    onSuccess: () => {
      Swal.fire({
        title: 'Order Cancelled',
        text: 'The order has been cancelled and refunded successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      console.error('Failed to cancel order:', error)
      Swal.fire({
        title: 'Oops!',
        text: error?.response?.data?.detail || 'Failed to cancel and refund order.',
        icon: 'error',
      })
    },
  })
}

export const useRejectCancelRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, reason }) => rejectCancelOrder(orderId, reason),
    onSuccess: () => {
      Swal.fire({
        title: 'Cancel Request Rejected',
        text: 'The cancel request has been rejected.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      console.error('Failed to reject cancel request:', error)
      Swal.fire({
        title: 'Oops!',
        text: error?.response?.data?.detail || 'Failed to reject cancel request.',
        icon: 'error',
      })
    },
  })
}
