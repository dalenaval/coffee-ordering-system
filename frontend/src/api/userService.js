import api from './axios'

export const registerUser = async (payload) => {
  const response = await api.post('/users/register', payload)
  return response.data
}

export const loginUser = async (payload) => {
  const response = await api.post('/users/login', payload)
  return response.data
}

export const getUsers = async () => {
  const response = await api.get('/users')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get(`/users/me`)
  return response.data
}

export const verifyEmail = async (payload) => {
  const response = await api.post('/users/verify', payload)
  return response.data
}
