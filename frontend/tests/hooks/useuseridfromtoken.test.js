import { renderHook } from '@testing-library/react';
import { useUserIdFromToken } from "../../src/hooks/useUserIdFromToken.js";

describe("useUserIdFromToken hook", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns null if no token in sessionStorage", () => {
    const { result } = renderHook(() => useUserIdFromToken());
    expect(result.current).toBeNull();
  });

  it("returns userId from a valid JWT", () => {
    const payload = { userId: 123 };
    const base64Payload = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const token = `header.${base64Payload}.signature`;
    sessionStorage.setItem("token", token);

    const { result } = renderHook(() => useUserIdFromToken());
    expect(result.current).toBe(123);
  });

  it("returns null if token is invalid", () => {
    sessionStorage.setItem("token", "invalid.token.value");
    const { result } = renderHook(() => useUserIdFromToken());
    expect(result.current).toBeNull();
  });
});