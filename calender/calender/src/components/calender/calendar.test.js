import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Calendar from ".";
import { CreateMonthGrid } from "./month-grid";

jest.mock("./month-grid");

describe("Calendar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Header Rendering", () => {
    it("should render the calendar with correct month and year", () => {
      CreateMonthGrid.mockReturnValue([
        [null, null, null, 1, 2, 3, 4],
        [5, 6, 7, 8, 9, 10, 11],
      ]);

      render(<Calendar date="2024-03-15" />);

      const header = screen.getByTestId("calendar-header");
      expect(header).toHaveTextContent("March 2024");
    });

    it("should format different months correctly", () => {
      CreateMonthGrid.mockReturnValue([[1, 2, 3, 4, 5, 6, 7]]);

      render(<Calendar date="2024-12-25" />);

      const header = screen.getByTestId("calendar-header");
      expect(header).toHaveTextContent("December 2024");
    });
  });

  describe("Weekday Labels", () => {
    it("should render all seven weekday labels", () => {
      CreateMonthGrid.mockReturnValue([[1, 2, 3, 4, 5, 6, 7]]);

      render(<Calendar date="2024-03-15" />);

      expect(screen.getByText("Sun")).toBeInTheDocument();
      expect(screen.getByText("Mon")).toBeInTheDocument();
      expect(screen.getByText("Tue")).toBeInTheDocument();
      expect(screen.getByText("Wed")).toBeInTheDocument();
      expect(screen.getByText("Thu")).toBeInTheDocument();
      expect(screen.getByText("Fri")).toBeInTheDocument();
      expect(screen.getByText("Sat")).toBeInTheDocument();
    });

    it("should render weekday labels in correct order", () => {
      CreateMonthGrid.mockReturnValue([[1, 2, 3, 4, 5, 6, 7]]);

      render(<Calendar date="2024-03-15" />);

      const weekdays = screen
        .getAllByText(/Sun|Mon|Tue|Wed|Thu|Fri|Sat/)
        .map((el) => el.textContent);

      expect(weekdays).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    });
  });

  describe("Calendar Grid", () => {
    it("should call CreateMonthGrid with the correct date", () => {
      CreateMonthGrid.mockReturnValue([[1, 2, 3, 4, 5, 6, 7]]);

      const testDate = "2024-03-15";
      render(<Calendar date={testDate} />);

      expect(CreateMonthGrid).toHaveBeenCalledWith(new Date(testDate));
    });

    it("should render all days from the grid", () => {
      const mockGrid = [
        [null, null, null, 1, 2, 3, 4],
        [5, 6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17, 18],
      ];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-15" />);

      const grid = screen.getByTestId("calendar-grid");
      const cells = grid.querySelectorAll(".calendar-cell");

      expect(cells).toHaveLength(21);
    });

    it("should render empty cells for null values", () => {
      const mockGrid = [[null, null, null, 1, 2, 3, 4]];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-01" />);

      const grid = screen.getByTestId("calendar-grid");
      const cells = grid.querySelectorAll(".calendar-cell");

      expect(cells[0]).toHaveTextContent("");
      expect(cells[1]).toHaveTextContent("");
      expect(cells[2]).toHaveTextContent("");
      expect(cells[3]).toHaveTextContent("1");
    });
  });

  describe("Active Day Highlighting", () => {
    it("should highlight the active day with correct class", () => {
      const mockGrid = [
        [null, null, null, 1, 2, 3, 4],
        [5, 6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17, 18],
      ];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-15" />);

      const grid = screen.getByTestId("calendar-grid");
      const cells = grid.querySelectorAll(".calendar-cell");

      const activeCells = Array.from(cells).filter((cell) =>
        cell.classList.contains("calendar-cell-active")
      );

      expect(activeCells).toHaveLength(1);
      expect(activeCells[0]).toHaveTextContent("15");
    });

    it("should set aria-current attribute on active day", () => {
      const mockGrid = [[1, 2, 3, 4, 5, 6, 7]];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-05" />);

      const grid = screen.getByTestId("calendar-grid");
      const cells = grid.querySelectorAll(".calendar-cell");

      const activeCell = Array.from(cells).find((cell) =>
        cell.hasAttribute("aria-current")
      );

      expect(activeCell).toHaveAttribute("aria-current", "date");
      expect(activeCell).toHaveTextContent("5");
    });

    it("should only highlight one day as active", () => {
      const mockGrid = [
        [1, 2, 3, 4, 5, 6, 7],
        [8, 9, 10, 11, 12, 13, 14],
      ];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-10" />);

      const grid = screen.getByTestId("calendar-grid");
      const activeCells = grid.querySelectorAll('[aria-current="date"]');

      expect(activeCells).toHaveLength(1);
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on calendar container", () => {
      CreateMonthGrid.mockReturnValue([[1, 2, 3, 4, 5, 6, 7]]);

      render(<Calendar date="2024-03-15" />);

      const calendar = screen.getByLabelText("Calendar");
      expect(calendar).toBeInTheDocument();
    });

    it("should not set aria-current on non-active days", () => {
      const mockGrid = [[1, 2, 3, 4, 5, 6, 7]];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-05" />);

      const grid = screen.getByTestId("calendar-grid");
      const cells = grid.querySelectorAll(".calendar-cell");

      const nonActiveCells = Array.from(cells).filter(
        (cell) => cell.textContent !== "5"
      );

      nonActiveCells.forEach((cell) => {
        expect(cell).not.toHaveAttribute("aria-current");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle first day of month", () => {
      const mockGrid = [[null, null, null, null, 1, 2, 3]];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-01" />);

      const grid = screen.getByTestId("calendar-grid");
      const activeCell = grid.querySelector('[aria-current="date"]');

      expect(activeCell).toHaveTextContent("1");
    });

    it("should handle last day of month", () => {
      const mockGrid = [
        [26, 27, 28, 29, 30, 31, null],
      ];
      CreateMonthGrid.mockReturnValue(mockGrid);

      render(<Calendar date="2024-03-31" />);

      const grid = screen.getByTestId("calendar-grid");
      const activeCell = grid.querySelector('[aria-current="date"]');

      expect(activeCell).toHaveTextContent("31");
    });

    it("should handle leap year dates", () => {
      CreateMonthGrid.mockReturnValue([[26, 27, 28, 29, null, null, null]]);

      render(<Calendar date="2024-02-29" />);

      const header = screen.getByTestId("calendar-header");
      expect(header).toHaveTextContent("February 2024");

      const grid = screen.getByTestId("calendar-grid");
      const activeCell = grid.querySelector('[aria-current="date"]');
      expect(activeCell).toHaveTextContent("29");
    });
  });
});