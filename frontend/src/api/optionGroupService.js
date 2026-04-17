import api from "./axios";

export const getEmployees = async () => {
  const response = await api.get("/employees");
  return response.data;
};
