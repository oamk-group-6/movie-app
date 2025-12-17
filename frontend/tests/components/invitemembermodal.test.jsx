import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import InviteMemberModal from "../../src/components/groups/inviteMemberModal.jsx";
import * as testUtils from "../helpers/testUtils.js";

jest.useFakeTimers();

describe("InviteMemberModal component", () => {
  const mockOnClose = jest.fn();
  const mockOnInvite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders modal with input and buttons", () => {
    testUtils.renderWithRouter(
      <InviteMemberModal onClose={mockOnClose} onInvite={mockOnInvite} members={[]} ownerId={1} />
    );
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByText("Send Invite")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows error if sending invite with empty input", () => {
    testUtils.renderWithRouter(
      <InviteMemberModal onClose={mockOnClose} onInvite={mockOnInvite} members={[]} ownerId={1} />
    );
    fireEvent.click(screen.getByText("Send Invite"));
    expect(screen.getByText("Please enter a username.")).toBeInTheDocument();
  });

  it("selects suggestion from dropdown", async () => {
    const members = [{ id: 3, username: "member1" }];
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 2, username: "jane" }, { id: 1, username: "owner" }] });

    testUtils.renderWithRouter(
      <InviteMemberModal onClose={mockOnClose} onInvite={mockOnInvite} members={members} ownerId={1} />
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "ja" } });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => screen.getByText("jane"));
    fireEvent.click(screen.getByText("jane"));

    expect(screen.getByDisplayValue("jane")).toBeInTheDocument();
  });

  it("handles fetch error gracefully", async () => {
    console.error = jest.fn();
    global.fetch.mockRejectedValue(new Error("Failed fetch"));

    testUtils.renderWithRouter(
      <InviteMemberModal onClose={mockOnClose} onInvite={mockOnInvite} members={[]} ownerId={1} />
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "x" } });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => expect(screen.queryByRole("list")).not.toBeInTheDocument());
    expect(console.error).toHaveBeenCalled();
  });
});
