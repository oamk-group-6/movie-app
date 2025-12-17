import { screen, waitFor } from "@testing-library/react";
import NewReleases from "../../src/components/newReleases.jsx";
import * as testUtils from "../helpers/testUtils.js";

jest.mock("../../src/components/bananameter.jsx", () => () => <div>BananaMeter</div>);

describe("NewReleases component", () => {
  const moviesMock = [
    { id: 1, poster_url: "url1" },
    { id: 2, poster_url: "url2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders movies fetched from API", async () => {
    global.fetch = testUtils.mockFetch(moviesMock);

    const { container } = testUtils.renderWithRouter(<NewReleases />);

    await waitFor(() => {
      expect(screen.getAllByText("BananaMeter")).toHaveLength(2);

      const imgs = container.querySelectorAll("img");
      expect(imgs).toHaveLength(2);
      expect(imgs[0]).toHaveAttribute("src", "url1");
      expect(imgs[1]).toHaveAttribute("src", "url2");
    });
  });

  it("handles fetch errors gracefully", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject("API error"));
    console.error = jest.fn();

    testUtils.renderWithRouter(<NewReleases />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("API error");
    });
  });
});