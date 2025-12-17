import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import CreateGroupPage from "../../src/components/groups/createGroupPage.jsx";
import * as testUtils from "../helpers/testUtils.js";

jest.useFakeTimers();

describe("CreateGroupPage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  it("renders form inputs", () => {
    testUtils.renderWithRouter(<CreateGroupPage />);
    
    expect(screen.getByPlaceholderText("Name of the group")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description of the group...(max 250 characters)")).toBeInTheDocument();
    expect(screen.getByText("Create Group")).toBeInTheDocument();

    const avatarInput = document.querySelector(".avatar-input");
    expect(avatarInput).toBeInTheDocument();
  });

  it("shows error if name is empty", async () => {
    testUtils.renderWithRouter(<CreateGroupPage />);
    const form = document.querySelector(".create-group-form");

    fireEvent.submit(form);

    await waitFor(() => expect(screen.getByText("Group name is required.")).toBeInTheDocument());
  });

  it("submits form successfully", async () => {
    const mockData = { id: 1, name: "Test Group" };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

    testUtils.renderWithRouter(<CreateGroupPage />);
    const form = document.querySelector(".create-group-form");
    const nameInput = screen.getByPlaceholderText("Name of the group");
    const descInput = screen.getByPlaceholderText("Description of the group...(max 250 characters)");

    fireEvent.change(nameInput, { target: { value: "Test Group" } });
    fireEvent.change(descInput, { target: { value: "Test description" } });

    fireEvent.submit(form);

    await waitFor(() => expect(screen.getByText("Group created successfully!")).toBeInTheDocument());

    await act(async () => {
      jest.advanceTimersByTime(800);
    });
  });

  it("handles fetch error", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    testUtils.renderWithRouter(<CreateGroupPage />);
    const form = document.querySelector(".create-group-form");
    const nameInput = screen.getByPlaceholderText("Name of the group");

    fireEvent.change(nameInput, { target: { value: "Test Group" } });
    fireEvent.submit(form);

    await waitFor(() => expect(screen.getByText("Error creating group.")).toBeInTheDocument());
    expect(console.error).toHaveBeenCalled();
  });

  it("handles avatar file input", () => {
    testUtils.renderWithRouter(<CreateGroupPage />);
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    const input = document.querySelector(".avatar-input");
    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);

    expect(input.files[0]).toBe(file);
  });
});