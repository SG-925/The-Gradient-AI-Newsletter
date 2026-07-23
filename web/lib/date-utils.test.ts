import { describe, it, expect } from "vitest";

/**
 * Date formatting and sorting utility tests.
 */

function formatIssueDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function sortDatesNewestFirst(dates: string[]): string[] {
  return [...dates].sort((a, b) => b.localeCompare(a));
}

describe("date formatting utilities", () => {
  it("formats a date string into a long readable format", () => {
    const result = formatIssueDate("2024-01-15");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2024");
    expect(result).toContain("Monday");
  });

  it("handles leap year dates correctly", () => {
    const result = formatIssueDate("2024-02-29");
    expect(result).toContain("February");
    expect(result).toContain("29");
    expect(result).toContain("2024");
  });

  it("handles year boundaries", () => {
    const result = formatIssueDate("2023-12-31");
    expect(result).toContain("December");
    expect(result).toContain("31");
    expect(result).toContain("2023");
  });

  it("formats the first day of the year", () => {
    const result = formatIssueDate("2024-01-01");
    expect(result).toContain("January");
    expect(result).toContain("1");
    expect(result).toContain("2024");
  });
});

describe("date sorting utilities", () => {
  it("sorts dates from newest to oldest", () => {
    const dates = ["2024-01-01", "2024-03-15", "2024-02-10"];
    const sorted = sortDatesNewestFirst(dates);
    expect(sorted).toEqual(["2024-03-15", "2024-02-10", "2024-01-01"]);
  });

  it("returns a new array without mutating the original", () => {
    const dates = ["2024-02-01", "2024-01-01"];
    const original = [...dates];
    sortDatesNewestFirst(dates);
    expect(dates).toEqual(original);
  });

  it("handles a single date", () => {
    const dates = ["2024-06-15"];
    const sorted = sortDatesNewestFirst(dates);
    expect(sorted).toEqual(["2024-06-15"]);
  });

  it("handles identical dates by keeping them in stable order", () => {
    const dates = ["2024-01-01", "2024-01-01", "2024-01-01"];
    const sorted = sortDatesNewestFirst(dates);
    expect(sorted).toHaveLength(3);
    expect(sorted.every((d) => d === "2024-01-01")).toBe(true);
  });
});
