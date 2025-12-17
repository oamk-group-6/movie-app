import { screen } from "@testing-library/react";
import UserPage from "../../src/components/userPage.jsx";
import * as testUtils from "../helpers/testUtils.js";
import * as userIdHook from "../../src/hooks/useUserIdFromToken.js";

jest.mock("../../src/components/favMovies.jsx", () => () => <div>FavMoviesComponent</div>);
jest.mock("../../src/components/searchBar.jsx", () => () => <div>SearchBarComponent</div>);
jest.mock("../../src/components/profileSidebar.jsx", () => () => <div>ProfileSidebarComponent</div>);

describe("UserPage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user view when logged in", () => {
    jest.spyOn(userIdHook, "useUserIdFromToken").mockReturnValue("123");

    testUtils.renderWithRouter(<UserPage />);

    expect(screen.getByText("Jotain")).toBeInTheDocument();
    expect(screen.getByText("SearchBarComponent")).toBeInTheDocument();
    expect(screen.getByText("ProfileSidebarComponent")).toBeInTheDocument();
    expect(screen.getByText("FavMoviesComponent")).toBeInTheDocument();
  });

  it("shows message when not logged in", () => {
    jest.spyOn(userIdHook, "useUserIdFromToken").mockReturnValue(null);

    testUtils.renderWithRouter(<UserPage />);

    expect(screen.getByText(/You are not logged in yet/i)).toBeInTheDocument();
  });
});