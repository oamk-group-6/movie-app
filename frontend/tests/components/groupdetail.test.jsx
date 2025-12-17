import { screen, fireEvent, waitFor } from "@testing-library/react";
import GroupDetails from "../../src/components/groups/groupDetail.jsx";
import * as testUtils from "../helpers/testUtils.js";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "1" }),
}));

describe("GroupDetails component", () => {
  const groupMock = { id: 1, name: "Test Group", avatar_url: "/avatar.png", description: "A test group", owner_id: 123 };
  const membersMock = [{ id: 123, username: "owner", role: "owner" }, { id: 2, username: "member", role: "member" }];
  const commentsMock = [{ username: "member", content: "Hello!" }];
  const favouritesMock = [{ id: 1, title: "Movie 1", poster_url: "/poster1.png" }];
  const joinRequestsMock = [{ id: 1, user_id: 3, username: "requester" }];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => groupMock })
      .mockResolvedValueOnce({ ok: true, json: async () => membersMock })
      .mockResolvedValueOnce({ ok: true, json: async () => commentsMock })
      .mockResolvedValueOnce({ ok: true, json: async () => favouritesMock })
      .mockResolvedValueOnce({ ok: true, json: async () => joinRequestsMock });

    window.confirm = jest.fn(() => true);
  });

  it("handles leave group confirmation", async () => {
    testUtils.renderWithRouter(<GroupDetails />);
    await waitFor(() => screen.getByText("Leave Group"));

    const leaveBtn = screen.getByText("Leave Group");
    fireEvent.click(leaveBtn);

    expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to leave this group?");
  });
});
