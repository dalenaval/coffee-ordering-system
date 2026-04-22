import { getMenuList } from '@/api/productService'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useGetProduct = (category = 'all') => {
  return useQuery({
    queryKey: ['getMenuList', category],
    queryFn: () => getMenuList(category),
    placeholderData: keepPreviousData,
  })
}
