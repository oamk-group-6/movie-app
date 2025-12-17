import { screen } from "@testing-library/react";
import HomePage from "../../src/components/homePage.jsx";
import * as testUtils from "../helpers/testUtils.js";

jest.mock("../../src/components/hotNow.jsx", () => () => <div>HotNowComponent</div>);
jest.mock("../../src/components/newReleases.jsx", () => () => <div>NewReleasesComponent</div>);
jest.mock("../../src/components/searchBar.jsx", () => () => <div>SearchBarComponent</div>);

describe("HomePage component", () => {
  it("renders header and sections", () => {
    testUtils.renderWithRouter(<HomePage />);

    expect(screen.getByText("Jotain")).toBeInTheDocument();
    expect(screen.getByText("Top Picks!")).toBeInTheDocument();
    expect(screen.getByText("Now In Theaters")).toBeInTheDocument();

    expect(screen.getByText("SearchBarComponent")).toBeInTheDocument();
    expect(screen.getByText("HotNowComponent")).toBeInTheDocument();
    expect(screen.getByText("NewReleasesComponent")).toBeInTheDocument();
  });
});
