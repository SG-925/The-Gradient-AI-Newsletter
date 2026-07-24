"use client";

import { useState, useEffect } from "react";
import { NewsletterIssue } from "@/types";
import ArticleCard from "@/components/article-card";
import { motion } from "framer-motion";

export default function Home() {
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [loading, setLoading] = useState(true);

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

  const latestIssues = issues.slice(0, 3);
  const hasIssues = issues.length > 0;

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
          >
            The Gradient
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-400"
          >
            AI insights, delivered daily.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <a
              href="/archive"
              className="inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Browse Archive
            </a>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Latest Issues
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
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
        ) : !hasIssues ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 text-4xl">📰</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No issues yet
            </h3>
            <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
              Our latest AI insights will appear here. Check back soon or
              subscribe to never miss an update.
            </p>
            <a
              href="/archive"
              className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              View Full Archive
            </a>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestIssues.map((issue, i) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <ArticleCard issue={issue} />
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <a
                href="/archive"
                className="inline-block rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
              >
                View Full Archive
              </a>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
