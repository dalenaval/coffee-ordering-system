import api from "./axios";

export const getProductAttributes = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response?.data;
};
