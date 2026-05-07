import api from "./axios";

export const getOptionItems = async () => {
  const response = await api.get("/option-items/");
  return response?.data;
};
