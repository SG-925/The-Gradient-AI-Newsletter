import { describe, it, expect } from "vitest";

/**
 * Data fetching and API response transformation tests.
 */

type NewsletterIssue = {
  id: string;
  title: string;
  date: string;
  intro: string;
  articles: Array<{ title: string; description?: string }>;
  tags: string[];
  publishedAt: string;
};

function filterValidIssues(issues: (NewsletterIssue | null | undefined)[]): NewsletterIssue[] {
  return issues.filter((issue): issue is NewsletterIssue => issue !== null && issue !== undefined);
}

function getReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / 200;
  return Math.max(1, Math.round(minutes));
}

function renderIntro(html: string): string {
  return html
    .replace(/^<p>/g, '<p class="text-xl leading-relaxed text-gray-700 dark:text-gray-300">')
    .replace(/^<p[^>]*>\s*<\/p>/, "");
}

describe("data fetching utilities", () => {
  describe("filterValidIssues", () => {
    it("filters out null and undefined values", () => {
      const issues: (NewsletterIssue | null | undefined)[] = [
        { id: "1", title: "Valid", date: "2024-01-01", intro: "", articles: [], tags: [], publishedAt: "2024-01-01T00:00:00Z" },
        null,
        undefined,
      ];
      const result = filterValidIssues(issues);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("returns all valid issues when none are null", () => {
      const issues: NewsletterIssue[] = [
        { id: "1", title: "Issue 1", date: "2024-01-01", intro: "", articles: [], tags: [], publishedAt: "2024-01-01T00:00:00Z" },
        { id: "2", title: "Issue 2", date: "2024-01-02", intro: "", articles: [], tags: [], publishedAt: "2024-01-02T00:00:00Z" },
      ];
      const result = filterValidIssues(issues);
      expect(result).toHaveLength(2);
    });

    it("returns empty array for empty input", () => {
      const result = filterValidIssues([]);
      expect(result).toEqual([]);
    });
  });

  describe("getReadTime", () => {
    it("calculates read time for a long text", () => {
      const longText = Array(400).fill("word").join(" ");
      const result = getReadTime(longText);
      expect(result).toBe(2);
    });

    it("returns at least 1 minute for any non-empty text", () => {
      const result = getReadTime("hello world");
      expect(result).toBeGreaterThanOrEqual(1);
    });

    it("returns 1 for very short text", () => {
      const result = getReadTime("hi");
      expect(result).toBe(1);
    });

    it("handles empty string", () => {
      const result = getReadTime("");
      expect(result).toBe(1);
    });
  });

  describe("renderIntro", () => {
    it("adds custom class to opening paragraph tags", () => {
      const html = "<p>Hello world</p>";
      const result = renderIntro(html);
      expect(result).toContain('class="text-xl leading-relaxed text-gray-700 dark:text-gray-300"');
    });

    it("removes empty paragraph tags", () => {
      const html = "<p></p>";
      const result = renderIntro(html);
      expect(result).not.toContain("<p>");
      expect(result).not.toContain("</p>");
    });

    it("preserves non-empty paragraph tags that are not empty", () => {
      const html = "<p>Some intro text here</p>";
      const result = renderIntro(html);
      expect(result).toContain("Some intro text here");
      expect(result).toContain('class="text-xl leading-relaxed text-gray-700 dark:text-gray-300"');
    });
  });
});
