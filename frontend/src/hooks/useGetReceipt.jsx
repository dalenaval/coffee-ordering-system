import { getOrderReceipt } from '@/api/orderService'
import { useQuery } from '@tanstack/react-query'

export const useGetReceipt = (orderId) => {
  return useQuery({
    queryKey: ['receipt', orderId],
    queryFn: () => getOrderReceipt(orderId),
    enabled: orderId,
  })
}
