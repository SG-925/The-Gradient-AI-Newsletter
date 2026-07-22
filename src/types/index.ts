export interface Article {
  id: string;
  title: string;
  url: string;
  description?: string;
  content?: string;
  publishedAt: Date;
  sourceId: string;
  sourceName: string;
  category?: string;
  author?: string;
}

export interface Source {
  id: string;
  name: string;
  feedUrl: string;
  category: string;
  priorityWeight: number;
  enabled: boolean;
}

export interface NewsletterIssue {
  id: string;
  title: string;
  date: string;
  intro: string;
  articles: Article[];
  tags: string[];
  featuredImageUrl?: string;
}
