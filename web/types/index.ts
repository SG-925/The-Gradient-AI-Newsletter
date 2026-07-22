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

export interface NewsletterIssue {
  id: string;
  title: string;
  date: string;
  intro: string;
  articles: Article[];
  tags: string[];
  featuredImageUrl?: string;
  publishedAt: Date;
}
