export const loginRedirect = (role, navigate) => {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === 'admin') return navigate('/dashboard');
  if (normalizedRole === 'manager') return navigate('/dashboard');
  if (normalizedRole === 'staff') return navigate('/dashboard');
  if (normalizedRole === 'customer') return navigate('/home');

  return navigate('/home');
}
