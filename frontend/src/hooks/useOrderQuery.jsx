import { getOrderDetails, getOrders, updateOrderStatus } from '@/api/orderService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      console.error('Failed to update order status:', error)
    },
  })
}
