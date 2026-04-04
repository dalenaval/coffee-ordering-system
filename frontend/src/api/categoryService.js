import api from "./axios";

export const getCategories = async () => {
  const response = await api.get("/categories/");
  console.log("response in category service:", response.data);
  return response?.data;
};
