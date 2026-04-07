import { getProductAttributes } from "@/api/productAttributes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetProductAttributes = (productId) => {
  return useQuery({
    queryKey: ["productAttributes", productId],
    queryFn: () => getProductAttributes(productId),
    placeholderData: keepPreviousData,
  });
};
