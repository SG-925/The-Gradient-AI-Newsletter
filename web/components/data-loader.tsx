import { readIssuesFromMarkdown } from "@/lib/posts";

interface DataLoaderProps {
  children: (data: {
    issues: Awaited<ReturnType<typeof readIssuesFromMarkdown>>;
  }) => React.ReactNode;
}

export default async function DataLoader({ children }: DataLoaderProps) {
  const issues = await readIssuesFromMarkdown();
  return <>{children({ issues })}</>;
}
