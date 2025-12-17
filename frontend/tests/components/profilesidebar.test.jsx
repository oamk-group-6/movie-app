import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProfileSidebar from "../../src/components/profileSidebar.jsx";
import * as testUtils from "../helpers/testUtils.js";

jest.useFakeTimers();
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mocked-url");
});

afterAll(() => {
  global.URL.createObjectURL.mockReset();
});
describe("ProfileSidebar component", () => {
  const userId = "123";
  const profileMock = {
    username: "user1",
    email: "user1@test.com",
    bio: "My bio",
    avatar_url: "/avatar.png"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_API_URL = "http://localhost";
  });

  it("renders loading state initially", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => new Promise(() => {}) // never resolves
    });

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders profile data after fetch", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => profileMock
    });

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByDisplayValue("user1"));

    expect(screen.getByDisplayValue("user1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("user1@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("My bio")).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toHaveAttribute("src", expect.stringContaining("/avatar.png"));
  });

  it("edits username, email and bio fields", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => profileMock
    });

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByDisplayValue("user1"));

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "newUser" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "new@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Short bio"), { target: { value: "New bio" } });

    expect(screen.getByDisplayValue("newUser")).toBeInTheDocument();
    expect(screen.getByDisplayValue("new@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New bio")).toBeInTheDocument();
  });

  it("saves profile successfully", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => profileMock }) // fetch profile
      .mockResolvedValueOnce({ ok: true, json: async () => ({ username: "savedUser" }) }); // save

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByDisplayValue("user1"));

    fireEvent.click(screen.getByText("Save Profile"));

    await waitFor(() => screen.getByText("Profile saved successfully."));
  });

  it("shows error on profile save failure", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => profileMock }) // fetch profile
      .mockResolvedValueOnce({ ok: false, text: async () => "Failed" }); // save fails

    console.error = jest.fn();
    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByDisplayValue("user1"));

    fireEvent.click(screen.getByText("Save Profile"));

    await waitFor(() => screen.getByText("Failed to save profile."));
    expect(console.error).toHaveBeenCalled();
  });

  it("shows error on avatar upload failure", async () => {
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => profileMock }) // fetch profile
      .mockResolvedValueOnce({ ok: false, text: async () => "Upload failed" }); // upload fails

    console.error = jest.fn();
    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByAltText("Profile"));

    const fileInput = document.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, "files", { value: [file] });
    fireEvent.change(fileInput);

    fireEvent.click(screen.getByText("Save Picture"));

    await waitFor(() => screen.getByText("Failed to upload image."));
    expect(console.error).toHaveBeenCalled();
  });

  it("deletes profile picture successfully", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => profileMock }) // fetch profile
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // delete picture

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByAltText("Profile"));

    fireEvent.click(screen.getByText("Delete Picture"));
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => screen.getByText("Profile picture deleted successfully."));
    expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();
  });

  it("handles profile fetch error gracefully", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    console.error = jest.fn();

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);

    await waitFor(() => screen.getByText("Failed to fetch user data"));
    expect(console.error).toHaveBeenCalled();
  });

  it("deletes account successfully", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => profileMock }) // fetch profile
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // delete account

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByDisplayValue("user1"));
    fireEvent.click(screen.getByText("Delete Account"));
    const holdBtn = screen.getByText(/Hold 3 seconds to delete/i);

    jest.useFakeTimers();
    fireEvent.mouseDown(holdBtn);
    act(() => { jest.advanceTimersByTime(3000); });
    fireEvent.mouseUp(holdBtn);

  });

  it("handles delete account failure", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => profileMock }) // fetch profile
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Failed" }) });

    console.error = jest.fn();

    testUtils.renderWithRouter(<ProfileSidebar userId={userId} />);
    await waitFor(() => screen.getByDisplayValue("user1"));

    fireEvent.click(screen.getByText("Delete Account"));
    const holdBtn = screen.getByText(/Hold 3 seconds to delete/i);

    jest.useFakeTimers();
    fireEvent.mouseDown(holdBtn);
    act(() => { jest.advanceTimersByTime(3000); });
    fireEvent.mouseUp(holdBtn);

    await waitFor(() => screen.getByText(/Failed to delete account/i));
    expect(console.error).toHaveBeenCalled();
  });
});