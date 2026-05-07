import { getDashboardSummary } from '@/api/dashboardService'
import { getLowStockProducts, restockProduct } from '@/api/productService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetLowStockProducts = () => {
  return useQuery({
    queryKey: ['low_stock_products'],
    queryFn: getLowStockProducts,
  })
}

export const useGetDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard_summary'],
    queryFn: getDashboardSummary,
  })
}

export const useRestockProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, payload }) => restockProduct(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['low_stock_products'])
      queryClient.invalidateQueries(['dashboard_summary'])
    },
  })
}
