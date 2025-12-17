import { screen, waitFor, fireEvent } from "@testing-library/react";
import FavMovies from "../../src/components/favMovies.jsx";
import * as testUtils from "../helpers/testUtils.js";
import * as userIdHook from "../../src/hooks/useUserIdFromToken.js";

jest.mock("../../src/components/bananameter.jsx", () => () => <div>BananaMeter</div>);

describe("FavMovies component", () => {
  const moviesMock = [
    { id: 1, title: "Movie 1", poster_url: "url1", release_year: 2000, user_rating: 80 },
    { id: 2, title: "Movie 2", poster_url: "url2", release_year: 2005, user_rating: null },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(userIdHook, "useUserIdFromToken").mockReturnValue("123");
  });

  it("shows loading initially", () => {
    global.fetch = testUtils.mockFetch([]);
    testUtils.renderWithRouter(<FavMovies />);
    expect(screen.getByText(/Loading movies/i)).toBeInTheDocument();
  });

  it("renders movies after fetch", async () => {
    global.fetch = testUtils.mockFetch(moviesMock);

    testUtils.renderWithRouter(<FavMovies />);

    await waitFor(() => {
      expect(screen.getByText("Movie 1")).toBeInTheDocument();
      expect(screen.getByText("Movie 2")).toBeInTheDocument();
      expect(screen.getAllByText("BananaMeter")).toHaveLength(2);
    });
  });

  it("shows empty message when no movies", async () => {
    global.fetch = testUtils.mockFetch([]);

    testUtils.renderWithRouter(<FavMovies />);

    await waitFor(() => {
      expect(screen.getByText(/You have no movies/i)).toBeInTheDocument();
    });
  });

  it("opens context menu on right click and unfavourites", async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(moviesMock) }))
      .mockImplementationOnce(() => Promise.resolve({ ok: true }));

    testUtils.renderWithRouter(<FavMovies />);

    await waitFor(() => screen.getByText("Movie 1"));

    const movieCard = screen.getByText("Movie 1").closest("a");
    fireEvent.contextMenu(movieCard);

    expect(screen.getByText("Unfavourite")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Unfavourite"));

    await waitFor(() => {
      expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
    });
  });
});