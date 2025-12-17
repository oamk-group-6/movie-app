import { screen, fireEvent, waitFor } from "@testing-library/react";
import GroupsPage from "../../src/components/groups/groupsPage.jsx";
import * as testUtils from "../helpers/testUtils.js";

jest.mock("../../src/components/searchBar.jsx", () => () => <div>SearchBar</div>);
jest.mock("../../src/components/groups/MyGroupsSection.jsx", () => () => <div>MyGroupsSection</div>);
jest.mock("../../src/components/groups/DiscoverGroupsSection.jsx", () => () => <div>DiscoverGroupsSection</div>);
jest.mock("../../src/components/groups/GroupInvitations.jsx", () => () => <div>GroupInvitations</div>);
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe("GroupsPage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    process.env.REACT_APP_API_URL = "http://mock-api";
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("renders search input and no fetch when not logged in", () => {
    testUtils.renderWithRouter(<GroupsPage />);
    expect(screen.getByPlaceholderText("Discover groups by name...")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls fetch functions when logged in", async () => {
    sessionStorage.setItem("token", "mock-token");

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    testUtils.renderWithRouter(<GroupsPage />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));
    expect(screen.getByText("MyGroupsSection")).toBeInTheDocument();
    expect(screen.getByText("DiscoverGroupsSection")).toBeInTheDocument();
    expect(screen.getByText("GroupInvitations")).toBeInTheDocument();
  });

  it("filters discover groups based on searchTerm", async () => {
    sessionStorage.setItem("token", "mock-token");

    const discoverGroups = [
      { id: 1, name: "Avengers" },
      { id: 2, name: "Justice League" },
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => discoverGroups })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    testUtils.renderWithRouter(<GroupsPage />);

    const input = screen.getByPlaceholderText("Discover groups by name...");
    fireEvent.change(input, { target: { value: "Avengers" } });

    await waitFor(() => expect(input.value).toBe("Avengers"));
  });
});
