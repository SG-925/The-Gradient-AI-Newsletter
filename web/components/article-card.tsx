"use client";

import Link from "next/link";
import { NewsletterIssue } from "@/types";

interface ArticleCardProps {
  issue: NewsletterIssue;
}

export default function ArticleCard({ issue }: ArticleCardProps) {
  const formattedDate = new Date(issue.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleCount = issue.articles.length;

  return (
    <Link
      href={`/archive/${issue.date}`}
      className="group block h-full rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:shadow-gray-900/30"
    >
      {issue.featuredImageUrl && (
        <div className="mb-4 overflow-hidden rounded-xl">
          <img
            src={issue.featuredImageUrl}
            alt={issue.title}
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <time
          dateTime={issue.date}
          className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          {formattedDate}
        </time>
        <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {articleCount} {articleCount === 1 ? "article" : "articles"}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-200">
        {issue.title}
      </h3>

      {issue.intro && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {issue.intro}
        </p>
      )}

      {issue.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {issue.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
