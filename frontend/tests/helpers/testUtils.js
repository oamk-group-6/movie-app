import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

export const mockFetch = (data, ok = true) => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    })
  );
};

export const mockUserIdHook = (userId) => jest.fn(() => userId);

export const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};
