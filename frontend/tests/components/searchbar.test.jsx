import { screen, fireEvent } from "@testing-library/react";
import * as testUtils from "../helpers/testUtils.js";
import * as logoutModule from "../../src/components/login/logout.jsx";

const getItemMock = jest.fn();
Object.defineProperty(window, "sessionStorage", {
  value: {
    getItem: getItemMock,
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

describe("SearchBar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login/signup when not logged in", async () => {
    getItemMock.mockReturnValue(null);
    const { default: SearchBar } = await import("../../src/components/searchBar.jsx");

    testUtils.renderWithRouter(<SearchBar />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText(/No account/i)).toBeInTheDocument();
    expect(screen.queryByText(/Hei user/i)).not.toBeInTheDocument();
  });
});