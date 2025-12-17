import { screen, waitFor, fireEvent, within } from "@testing-library/react";
import Reviews from "../../src/components/reviews.jsx";
import * as testUtils from "../helpers/testUtils.js";

const renderWithRouterAndParams = (id) =>
  testUtils.renderWithRouter(<Reviews />, { route: `/movies/${id}` });

describe("Reviews component", () => {
  const apiResponse = {
    ratings: [
      { username: "User1", rating: 80, review: "Great!", created_at: "2025-01-01" },
      { username: "User2", rating: 60, review: "Good", created_at: "2025-01-02" },
    ],
    totalCount: 2,
    totalPages: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows 'No reviews' message when empty", async () => {
    global.fetch = testUtils.mockFetch({ ratings: [], totalCount: 0, totalPages: 0 });

    renderWithRouterAndParams(1);

    await waitFor(() => {
      expect(screen.getByText(/No reviews for this movie/i)).toBeInTheDocument();
    });
  });

  it("handles fetch errors gracefully", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject("API error"));
    console.error = jest.fn();

    renderWithRouterAndParams(1);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("API error");
    });
  });

  it("loads more reviews on 'Show more' click", async () => {
    const page1 = {
      ratings: [{ username: "User1", rating: 80, review: "Great!", created_at: "2025-01-01" }],
      totalCount: 2,
      totalPages: 2
    };
    const page2 = {
      ratings: [{ username: "User2", rating: 60, review: "Good", created_at: "2025-01-02" }],
      totalCount: 2,
      totalPages: 2
    };

    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(page1) }))
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(page2) }));

    renderWithRouterAndParams(1);

    await waitFor(() => screen.getByText(/User1/));
    expect(screen.getByText(/User1/).closest(".rating-box").textContent)
      .toMatch(/User1.*1[/.]1[/.]2025.*Great!/);

    fireEvent.click(screen.getByText(/Show more/i));

    await waitFor(() => screen.getByText(/User2/));
    expect(screen.getByText(/User2/).closest(".rating-box").textContent)
      .toMatch(/User2.*2[/.]1[/.]2025.*Good/);

    expect(screen.getByText(/User1/).closest(".rating-box").textContent)
      .toMatch(/User1.*1[/.]1[/.]2025.*Great!/);
  });
});