import { screen, waitFor } from "@testing-library/react";
import BananaMeter from "../../src/components/bananameter.jsx";
import * as testUtils from "../helpers/testUtils.js";

describe("BananaMeter component", () => {
  const movieId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct rating from API", async () => {
    global.fetch = testUtils.mockFetch({ average: 75 });

    const { container } = testUtils.renderWithRouter(<BananaMeter movieId={movieId} />);

    await waitFor(() => {
      expect(screen.getByText(/Bananameter: 75%/i)).toBeInTheDocument();

      const fill = container.querySelector(".movie-average-fill");
      expect(fill).toHaveStyle("width: 75%");
    });
  });

  it("handles fetch errors gracefully", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject("API error"));
    console.error = jest.fn();

    testUtils.renderWithRouter(<BananaMeter movieId={movieId} />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("API error");
      expect(screen.getByText(/Bananameter: 0%/i)).toBeInTheDocument();
    });
  });
});