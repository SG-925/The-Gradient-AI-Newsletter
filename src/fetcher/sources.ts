import { Source } from '../types';

export const DEFAULT_SOURCES: Source[] = [
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch AI',
    feedUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'Industry News',
    priorityWeight: 5,
    enabled: true,
  },
  {
    id: 'arstechnica-ai',
    name: 'Ars Technica AI',
    feedUrl: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    category: 'Industry News',
    priorityWeight: 4,
    enabled: true,
  },
  {
    id: 'arxiv-csai',
    name: 'arXiv cs.AI',
    feedUrl: 'https://rss.arxiv.org/rss/cs.AI',
    category: 'Research',
    priorityWeight: 4,
    enabled: true,
  },
  {
    id: 'arxiv-cslg',
    name: 'arXiv cs.LG',
    feedUrl: 'https://rss.arxiv.org/rss/cs.LG',
    category: 'Research',
    priorityWeight: 4,
    enabled: true,
  },
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    feedUrl: 'https://openai.com/blog/rss.xml',
    category: 'Company Blog',
    priorityWeight: 5,
    enabled: true,
  },
  {
    id: 'anthropic-blog',
    name: 'Anthropic Blog',
    feedUrl: 'https://www.anthropic.com/rss.xml',
    category: 'Company Blog',
    priorityWeight: 5,
    enabled: true,
  },
  {
    id: 'google-ai-blog',
    name: 'Google AI Blog',
    feedUrl: 'https://blog.google/technology/ai/rss/',
    category: 'Company Blog',
    priorityWeight: 5,
    enabled: true,
  },
  {
    id: 'reddit-artificial',
    name: 'Reddit r/artificial',
    feedUrl: 'https://www.reddit.com/r/artificial/.rss',
    category: 'Community',
    priorityWeight: 2,
    enabled: true,
  },
  {
    id: 'reddit-machinelearning',
    name: 'Reddit r/MachineLearning',
    feedUrl: 'https://www.reddit.com/r/MachineLearning/.rss',
    category: 'Community',
    priorityWeight: 3,
    enabled: true,
  },
];

export function getEnabledSources(sources: Source[]): Source[] {
  return sources.filter((source: Source) => source.enabled);
}
