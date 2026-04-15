import api from "./axios";

export const getStaffSchedules = async () => {
  const response = await api.get("/staff-scheduling");
  return response.data;
};

export const createStaffSchedule = async (payload) => {
  const response = await api.post("/staff-scheduling", payload);
  return response.data;
};

export const updateStaffSchedule = async (id, payload) => {
  const response = await api.put(`/staff-scheduling/${id}`, payload);
  return response.data;
};

export const deleteStaffSchedule = async (id) => {
  const response = await api.delete(`/staff-scheduling/${id}`);
  return response.data;
};

