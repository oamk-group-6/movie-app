import { useState, useEffect } from "react";

export function useUserIdFromToken() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // jwt-token sessionStoragesta
    if (!token) return;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      if (payload.userId) setUserId(payload.userId);
    } catch (e) {
      console.error("Invalid JWT", e);
      setUserId(null);
    }
  }, []);

  return userId;
}
