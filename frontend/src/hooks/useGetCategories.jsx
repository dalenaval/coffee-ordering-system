import { getCategories } from "@/api/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
