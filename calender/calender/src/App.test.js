// App.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import Calender from "./components/calender";

jest.mock("./components/calender");

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Calender.mockImplementation(({ date }) => (
      <div data-testid="mock-calendar">Mock Calendar: {date}</div>
    ));
  });

  it("should render without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("mock-calendar")).toBeInTheDocument();
  });

  it("should render the page-center wrapper div", () => {
    const { container } = render(<App />);
    const pageCenter = container.querySelector(".page-center");
    expect(pageCenter).toBeInTheDocument();
  });

  it("should render Calender component", () => {
    render(<App />);
    expect(Calender).toHaveBeenCalled();
  });

  it("should render Calender inside page-center div", () => {
    const { container } = render(<App />);
    const pageCenter = container.querySelector(".page-center");
    const calendar = screen.getByTestId("mock-calendar");
    expect(pageCenter).toContainElement(calendar);
  });
});

describe("App Component - Integration Tests", () => {
  beforeEach(() => {
    jest.unmock("./components/calender");
  });

  it("should match snapshot", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });
});