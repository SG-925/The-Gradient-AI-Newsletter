"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { NewsletterIssue } from "@/types";
import ArticleCard from "@/components/article-card";
import ScrollReveal from "@/components/scroll-reveal";
import { motion } from "framer-motion";

const PAGE_SIZE = 9;

export default function ArchivePage() {
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetch("/api/issues")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: NewsletterIssue[]) => {
        setIssues(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(issues.map((i) => i.date)));
    return dates.sort((a, b) => b.localeCompare(a));
  }, [issues]);

  const currentDateIndex = useMemo(
    () => (selectedDate ? uniqueDates.indexOf(selectedDate) : -1),
    [selectedDate, uniqueDates]
  );

  const filteredIssues = useMemo(() => {
    let result = issues;

    if (selectedDate) {
      result = result.filter((i) => i.date === selectedDate);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [issues, selectedDate, searchQuery]);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, selectedDate]);

  const paginatedIssues = filteredIssues.slice(0, displayCount);
  const hasMore = displayCount < filteredIssues.length;

  const totalArticles = useMemo(
    () => issues.reduce((sum, i) => sum + i.articles.length, 0),
    [issues]
  );

  const dateRange = useMemo(() => {
    if (uniqueDates.length === 0) return "N/A";
    return `${uniqueDates[uniqueDates.length - 1]} — ${uniqueDates[0]}`;
  }, [uniqueDates]);

  const latestDate = uniqueDates[0] || "N/A";

  const goToPrevDay = useCallback(() => {
    if (currentDateIndex < uniqueDates.length - 1) {
      setSelectedDate(uniqueDates[currentDateIndex + 1]);
    }
  }, [currentDateIndex, uniqueDates]);

  const goToNextDay = useCallback(() => {
    if (currentDateIndex > 0) {
      setSelectedDate(uniqueDates[currentDateIndex - 1]);
    }
  }, [currentDateIndex, uniqueDates]);

  const clearDateFilter = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const skeletonCards = Array.from({ length: PAGE_SIZE });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Archive
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse all past issues of The Gradient
        </p>
      </div>

      {!loading && issues.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Issues
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {issues.length}
            </span>
          </div>
          <div className="hidden h-6 w-px bg-gray-300 dark:bg-gray-700 sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Articles
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {totalArticles}
            </span>
          </div>
          <div className="hidden h-6 w-px bg-gray-300 dark:bg-gray-700 sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Date Range
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {dateRange}
            </span>
          </div>
          <div className="hidden h-6 w-px bg-gray-300 dark:bg-gray-700 sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Latest
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {latestDate}
            </span>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or tags..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>

        {!loading && uniqueDates.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevDay}
              disabled={currentDateIndex >= uniqueDates.length - 1}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Prev
            </button>
            {selectedDate ? (
              <button
                onClick={clearDateFilter}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <span className="ml-1.5 text-gray-400">×</span>
              </button>
            ) : (
              <span className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                All Days
              </span>
            )}
            <button
              onClick={goToNextDay}
              disabled={currentDateIndex <= 0}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skeletonCards.map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 h-40 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="mb-3 h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mb-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mb-4 h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            No issues found
          </h3>
          <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
            {searchQuery
              ? `We couldn't find any issues matching "${searchQuery}". Try adjusting your search.`
              : selectedDate
              ? `There are no issues for this date.`
              : "There are no issues in the archive yet."}
          </p>
          {(searchQuery || selectedDate) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDate(null);
              }}
              className="mt-4 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Clear all filters
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedIssues.map((issue, i) => (
              <ScrollReveal key={issue.date + issue.id} delay={i * 0.05}>
                <ArticleCard issue={issue} />
              </ScrollReveal>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                className="rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
              >
                Load More ({filteredIssues.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
