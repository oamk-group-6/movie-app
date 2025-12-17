import { render, screen, fireEvent } from "@testing-library/react";
import MyGroupsSection from "../../src/components/groups/MyGroupsSection.jsx";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderComponent = (props) =>
  render(
    <BrowserRouter>
      <MyGroupsSection {...props} />
    </BrowserRouter>
  );

describe("MyGroupsSection component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows login message when user is not logged in", () => {
    renderComponent({
      loggedIn: false,
      groups: [],
    });

    expect(screen.getByText("My Groups")).toBeInTheDocument();
    expect(
      screen.getByText("Log in to see your groups.")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("You are not a member of any groups yet.")
    ).not.toBeInTheDocument();
  });

  it("shows empty state when logged in but has no groups", () => {
    renderComponent({
      loggedIn: true,
      groups: [],
    });

    expect(screen.getByText("My Groups")).toBeInTheDocument();
    expect(
      screen.getByText("You are not a member of any groups yet.")
    ).toBeInTheDocument();
  });

  it("renders a list of groups with correct info", () => {
    const groups = [
      {
        id: 1,
        name: "Chess Club",
        member_count: 12,
        avatar_url: "/avatars/chess.png",
      },
      {
        id: 2,
        name: "Movie Fans",
        member_count: 42,
        avatar_url: "/avatars/movies.png",
      },
    ];

    renderComponent({
      loggedIn: true,
      groups,
    });

    expect(screen.getByText("Chess Club")).toBeInTheDocument();
    expect(screen.getByText("12 members")).toBeInTheDocument();

    expect(screen.getByText("Movie Fans")).toBeInTheDocument();
    expect(screen.getByText("42 members")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button", {
      name: /view group/i,
    });

    expect(buttons).toHaveLength(2);
  });


  it("navigates to group page when clicking View Group", () => {
    const groups = [
      {
        id: 5,
        name: "React Devs",
        member_count: 99,
        avatar_url: "/avatars/react.png",
      },
    ];

    renderComponent({
      loggedIn: true,
      groups,
    });

    fireEvent.click(
      screen.getByRole("button", { name: /view group/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/groups/5");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("renders correct image src and alt text", () => {
    const groups = [
      {
        id: 3,
        name: "Photography",
        member_count: 7,
        avatar_url: "/avatars/photo.png",
      },
    ];

    renderComponent({
      loggedIn: true,
      groups,
    });

    const img = screen.getByAltText("Photography Avatar");

    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("/avatars/photo.png")
    );
  });
});