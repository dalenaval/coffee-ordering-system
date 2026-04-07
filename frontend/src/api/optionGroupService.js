import api from "./axios";

export const getOptionGroups = async () => {
  const response = await api.get("option-groups/");
  return response?.data;
};
