import { useQuery } from "@tanstack/react-query";
import { getOptionGroups } from "@/api/optionGroupService";

export const useGetOptionGroups = () => {
  return useQuery({
    queryKey: ["optionGroups"],
    queryFn: getOptionGroups,
  });
};
