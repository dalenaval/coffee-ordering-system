import api from "./axios";

// export const registerProduct = async (payload) => {
//   const response = await api.post("/products/register", payload);
//   return response.data;
// };

// export const updateProduct = async (id, payload) => {
//   const response = await api.patch(`/products/${id}`, payload);
//   return response.data;
// };

export const getProducts = async (category) => {
  const params =
    category && category?.name !== "all" ? { category_id: category.id } : {};
  console.log("params in getProducts:", params);
  const response = await api.get(`/products/`, { params });
  return response?.data;
};
