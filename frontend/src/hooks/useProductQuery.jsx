import { getProducts } from '@/api/productService'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useGetProduct = (category = 'all') => {
  return useQuery({
    queryKey: ['getProducts', category],
    queryFn: () => getProducts(category),
    placeholderData: keepPreviousData,
  })
}
