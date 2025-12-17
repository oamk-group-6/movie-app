import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../src/components/login/login.jsx";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../src/components/searchBar.jsx", () => () => (
  <div data-testid="search-bar">SearchBar</div>
));

const renderLogin = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

describe("Login component (new tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders login form and SearchBar", () => {
    renderLogin();

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("email@address.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••••••")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /log in/i })
    ).toBeInTheDocument();
  });

  it("logs in successfully and stores token", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        token: "fake-jwt-token",
      }),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("email@address.com"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "user@test.com",
            password: "password123",
          }),
        })
      );
    });

    expect(sessionStorage.getItem("token")).toBe("fake-jwt-token");
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });

  it("shows backend error on invalid credentials", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        error: "Invalid email or password",
      }),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("email@address.com"), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid email or password")
      ).toBeInTheDocument();
    });

    expect(sessionStorage.getItem("token")).toBeNull();
  });

  it("shows generic error on fetch failure", async () => {
    global.fetch = jest.fn().mockRejectedValue("Network error");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("email@address.com"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Server error. Try again later.")
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Login error:",
      "Network error"
    );

    expect(sessionStorage.getItem("token")).toBeNull();
    consoleSpy.mockRestore();
  });

  it("toggles password visibility when clicking eye icon", () => {
    renderLogin();

    const passwordInput =
      screen.getByPlaceholderText("••••••••••••");

    expect(passwordInput).toHaveAttribute("type", "password");

    const eyeIcon = passwordInput.parentElement.querySelector(
      ".password-eye"
    );

    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("does not submit form when required fields are empty", () => {
    global.fetch = jest.fn();

    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});