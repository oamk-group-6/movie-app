export function logout() {
  // remove token from storage
  sessionStorage.removeItem('token');

  // redirect to signin page
  window.location.href = '/login';
}
