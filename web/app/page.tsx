import HeroSection from "@/components/hero-section";
import ArticleCard from "@/components/article-card";
import { readIssuesFromMarkdown } from "@/lib/posts";
import { NewsletterIssue, Article } from "@/types";

function getLatestIssue(): NewsletterIssue | null {
  const issues = readIssuesFromMarkdown();
  return issues[0] || null;
}

export default function Home() {
  const latestIssue = getLatestIssue();

  if (!latestIssue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          The Gradient
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Loading today&apos;s edition...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <HeroSection issue={latestIssue} />

        {latestIssue.articles.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestIssue.articles.map((article: Article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  issueDate={latestIssue.date}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}


