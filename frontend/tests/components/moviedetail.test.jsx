import { screen, fireEvent, waitFor } from "@testing-library/react";
import MovieDetail from "../../src/components/movieDetail.jsx";
import * as testUtils from "../helpers/testUtils.js";
import * as userHook from "../../src/hooks/useUserIdFromToken";

jest.mock("../../src/components/searchBar.jsx", () => () => <div>SearchBarComponent</div>);
jest.mock("../../src/components/reviews.jsx", () => () => <div>ReviewsComponent</div>);
jest.mock("../../src/components/bananameter.jsx", () => () => <div>BananaMeterComponent</div>);

describe("MovieDetail component", () => {
  const movieMock = {
    id: 1,
    title: "Movie 1",
    release_year: 2025,
    runtime: 120,
    genre: "Action",
    poster_url: "url1",
    description: "Description here",
  };

  const userFavouritesMock = [{ id: 1 }];
  const userGroupsMock = [{ id: 10, name: "Group1" }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading initially", () => {
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(movieMock) });
    testUtils.renderWithRouter(<MovieDetail />, { route: "/movies/1" });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders movie details after fetch", async () => {
    jest.spyOn(userHook, "useUserIdFromToken").mockReturnValue("123");

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(movieMock) }) // movie
      .mockResolvedValueOnce({ json: () => Promise.resolve(userFavouritesMock) }) // favourites
      .mockResolvedValueOnce({ json: () => Promise.resolve(userGroupsMock) }) // groups
      .mockResolvedValue({ json: () => Promise.resolve({ isFavourite: false }) }); // group status

    testUtils.renderWithRouter(<MovieDetail />, { route: "/movies/1" });

    await waitFor(() => expect(screen.getByText("Movie 1")).toBeInTheDocument());

    expect(screen.getByText(/2025\s*•\s*120\s*min/)).toBeInTheDocument();
    expect(screen.getByText(/Action/)).toBeInTheDocument();
    expect(screen.getByText(/Description here/)).toBeInTheDocument();
    expect(screen.getByText("SearchBarComponent")).toBeInTheDocument();
    expect(screen.getByText("ReviewsComponent")).toBeInTheDocument();
    expect(screen.getByText("BananaMeterComponent")).toBeInTheDocument();
  });

  it("toggles favourite when no groups", async () => {
    jest.spyOn(userHook, "useUserIdFromToken").mockReturnValue("123");

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(movieMock) }) // movie
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) }) // favourites
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) }) // groups
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) }); // POST favourite

    testUtils.renderWithRouter(<MovieDetail />, { route: "/movies/1" });

    await waitFor(() => screen.getByText("Movie 1"));

    const favButton = screen.getByTitle("Add to favourites");
    fireEvent.click(favButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/favourites"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("opens favourite menu when user has groups", async () => {
    jest.spyOn(userHook, "useUserIdFromToken").mockReturnValue("123");

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(movieMock) })
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(userGroupsMock) })
      .mockResolvedValue({ json: () => Promise.resolve({ isFavourite: false }) });

    testUtils.renderWithRouter(<MovieDetail />, { route: "/movies/1" });

    await waitFor(() => screen.getByText("Movie 1"));

    const favButton = screen.getByTitle("Add to favourites");
    fireEvent.click(favButton);

    expect(screen.getByText("Add to my favourites")).toBeInTheDocument();
    expect(screen.getByText("Add to group: Group1")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByText("Add to my favourites")).not.toBeInTheDocument();
  });

  it("handles fetch errors gracefully", async () => {
    jest.spyOn(userHook, "useUserIdFromToken").mockReturnValue("123");
    global.fetch = jest.fn().mockRejectedValue("API error");
    console.error = jest.fn();

    testUtils.renderWithRouter(<MovieDetail />, { route: "/movies/1" });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});