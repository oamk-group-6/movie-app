import { screen, fireEvent, waitFor } from "@testing-library/react";
import GroupInvitations from "../../src/components/groups/GroupInvitations.jsx";
import * as testUtils from "../helpers/testUtils.js";

describe("GroupInvitations component", () => {
  let mockSetInvites;
  let mockRefresh;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockSetInvites = jest.fn();
    mockRefresh = jest.fn();
  });

  it("shows login message when not logged in", () => {
    testUtils.renderWithRouter(
      <GroupInvitations
        invites={[]}
        setInvites={mockSetInvites}
        loggedIn={false}
      />
    );

    expect(screen.getByText("Log in to view invitations.")).toBeInTheDocument();
  });

  it("shows 'no invitations' message when invites array empty", () => {
    testUtils.renderWithRouter(
      <GroupInvitations
        invites={[]}
        setInvites={mockSetInvites}
        loggedIn={true}
        refreshMyGroups={mockRefresh}
        refreshDiscoverGroups={mockRefresh}
        refreshInvitations={mockRefresh}
      />
    );

    expect(screen.getByText("No invitations at the moment.")).toBeInTheDocument();
  });

  it("renders invitations and handles accept/decline", async () => {
    const invites = [
      { id: 1, group_name: "Test Group 1" },
      { id: 2, group_name: "Test Group 2" },
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // accept
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // decline

    testUtils.renderWithRouter(
      <GroupInvitations
        invites={invites}
        setInvites={mockSetInvites}
        loggedIn={true}
        refreshMyGroups={mockRefresh}
        refreshDiscoverGroups={mockRefresh}
        refreshInvitations={mockRefresh}
      />
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/accept"),
      expect.objectContaining({ method: "POST" })
    ));
    expect(mockSetInvites).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalledTimes(3);

    fireEvent.click(buttons[3]);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/decline"),
      expect.objectContaining({ method: "POST" })
    ));
  });
});