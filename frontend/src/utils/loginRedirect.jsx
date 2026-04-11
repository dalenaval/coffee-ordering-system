export const loginRedirect = (role, navigate) => {
  if (role === 'admin') return navigate('/dashboard')
  if (role === 'staff') return navigate('/staff')
  return navigate('/home')
}
