import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../../src/components/register/register.jsx";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../src/components/searchBar.jsx", () => () => (
  <div data-testid="search-bar">SearchBar</div>
));

const renderRegister = () =>
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

describe("Register component (new tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: "" };
  });

  it("renders register form with inputs and SearchBar", () => {
    renderRegister();

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByText("Create Your Account")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email@address.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••••••")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("submits form successfully and sends correct payload", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Registered" }),
    });

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText("username"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByPlaceholderText("email@address.com"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "john",
            email: "john@test.com",
            password: "password123",
          }),
        })
      );
    });

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("shows backend validation error message", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Username already exists" }),
    });

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText("username"), {
      target: { value: "existingUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("email@address.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Username already exists")
      ).toBeInTheDocument();
    });
  });

  it("shows generic error on network failure", async () => {
    global.fetch = jest.fn().mockRejectedValue("Network error");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText("username"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByPlaceholderText("email@address.com"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Server error. Try again later.")
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Register error:",
      "Network error"
    );

    consoleSpy.mockRestore();
  });

  it("toggles password visibility when clicking eye icon", () => {
    renderRegister();

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

    renderRegister();

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});