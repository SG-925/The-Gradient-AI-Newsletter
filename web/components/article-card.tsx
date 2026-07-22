"use client";

import { motion } from "framer-motion";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  issueDate: string;
}

export default function ArticleCard({ article, issueDate }: ArticleCardProps) {
  const formattedDate = new Date(
    `${issueDate}T00:00:00`
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.a
      href={`/archive/${issueDate}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <time
            dateTime={issueDate}
            className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
          >
            {formattedDate}
          </time>
          {article.category && (
            <span className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              {article.category}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <span className="relative inline-flex items-center gap-1">
            Read more
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.22 4.22a.75.75 0 011.06 0L12 9.94l-6.72 6.72a.75.75 0 01-1.06-1.06L10.47 9 4.22 4.22a.75.75 0 010-1.06z"
              />
            </svg>
          </span>
        </div>
      </div>
    </motion.a>
  );
}
