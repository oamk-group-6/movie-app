import { screen, fireEvent, waitFor } from "@testing-library/react";
import DiscoverGroupsSection from "../../src/components/groups/DiscoverGroupsSection.jsx";
import * as testUtils from "../helpers/testUtils.js";

describe("DiscoverGroupsSection component", () => {
  const groupsMock = [
    { id: 1, name: "Group 1", avatar_url: "/avatar1.png", member_count: 10, has_pending_request: false, has_pending_invite: false },
    { id: 2, name: "Group 2", avatar_url: "/avatar2.png", member_count: 5, has_pending_request: true, has_pending_invite: false },
    { id: 3, name: "Group 3", avatar_url: "/avatar3.png", member_count: 7, has_pending_request: false, has_pending_invite: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_API_URL = "http://localhost";
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  it("shows login message when not logged in", () => {
    testUtils.renderWithRouter(<DiscoverGroupsSection groups={[]} loggedIn={false} />);
    expect(screen.getByText("Log in to discover groups.")).toBeInTheDocument();
  });

  it("disables button for groups with pending request", () => {
    testUtils.renderWithRouter(<DiscoverGroupsSection groups={groupsMock} loggedIn={true} />);
    const btn = screen.getByText(/Request Sent!/i);
    expect(btn).toBeDisabled();
  });

  it("disables button for groups with pending invite", () => {
    testUtils.renderWithRouter(<DiscoverGroupsSection groups={groupsMock} loggedIn={true} />);
    const btn = screen.getByText(/Check Invitations/i);
    expect(btn).toBeDisabled();
  });

  it("handles fetch error when sending join request", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed" })
    });

    testUtils.renderWithRouter(<DiscoverGroupsSection groups={[groupsMock[0]]} loggedIn={true} />);
    const btn = screen.getByText("Send Invite");
    fireEvent.click(btn);

    await waitFor(() => screen.getByText("Failed to send."));
    expect(screen.getByText("Failed to send.")).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("prevents double clicking on send invite button", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    testUtils.renderWithRouter(<DiscoverGroupsSection groups={[groupsMock[0]]} loggedIn={true} />);
    const btn = screen.getByText("Send Invite");

    fireEvent.click(btn);
    fireEvent.click(btn);

    await waitFor(() => expect(btn).toHaveTextContent("Request Sent!"));
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});