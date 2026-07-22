"use client";

import { motion } from "framer-motion";
import { NewsletterIssue } from "@/types";

interface HeroSectionProps {
  issue: NewsletterIssue;
}

export default function HeroSection({ issue }: HeroSectionProps) {
  const formattedDate = new Date(`${issue.date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const bulletLines = issue.intro
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith("#") &&
        !line.startsWith("---")
    );

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl dark:shadow-gray-900/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/10" />

      <div className="relative px-6 py-10 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20">
            Featured
          </span>
          <time
            dateTime={issue.date}
            className="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            {formattedDate}
          </time>
        </div>

        <h1 className="max-w-4xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          {issue.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {issue.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-10">
          {bulletLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
              className="flex items-start gap-3 mb-3"
            >
              <svg
                className="mt-1.5 h-4 w-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {line}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <motion.a
            href={`/archive/${issue.date}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-shadow hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:shadow-indigo-500/20"
          >
            Read Full Article
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 011.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 01-1.04-1.08l4.158-4.16H3.75A.75.75 0 013 10z"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}
