import api from "./axios";

export const getSystemControls = async () => {
  const response = await api.get("/system-control");
  return response.data;
};

export const updateSystemControl = async (id, payload) => {
  const response = await api.put(`/system-control/${id}`, payload);
  return response.data;
};
