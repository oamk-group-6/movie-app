export function logout() {
  // remove token from storage
  localStorage.removeItem('token');

  // redirect to signin page
  window.location.href = '/signin';
}
