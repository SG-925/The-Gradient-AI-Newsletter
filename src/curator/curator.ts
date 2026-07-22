import { Article } from '../types';
import { CuratorRules, loadRules } from './rules';

export interface CuratedArticle extends Article {
  score: number;
  scoreDetails: {
    source: number;
    recency: number;
    keywords: number;
    engagement: number;
  };
}

export interface CuratorOptions {
  rules?: Partial<CuratorRules>;
}

const MAX_SOURCE_WEIGHT = 5;
const MAX_KEYWORD_WEIGHT = 6;

function getSourceWeight(article: Article, rules: CuratorRules): number {
  for (const rule of rules.sourcePriorities) {
    if (article.sourceName.includes(rule.sourceNameSubstring)) {
      return rule.weight;
    }
  }
  return 1;
}

function getRecencyScore(publishedAt: Date, halfLifeHours: number): number {
  const now = new Date();
  const ageMs = now.getTime() - publishedAt.getTime();
  const ageHours = ageMs / (1000 * 60 * 60);

  if (ageHours < 0) {
    return 1;
  }

  return Math.exp(-Math.LN2 * ageHours / halfLifeHours);
}

function getKeywordScore(article: Article, rules: CuratorRules): number {
  const text = [article.title, article.description ?? '', article.content ?? ''].join(' ');
  let totalWeight = 0;

  for (const rule of rules.keywordRanges) {
    const matches = text.match(rule.pattern);
    if (matches) {
      totalWeight += matches.length * rule.weight;
    }
  }

  return Math.min(totalWeight / MAX_KEYWORD_WEIGHT, 1);
}

function getEngagementScore(article: Article): number {
  const metadata = (article as any).metadata as { commentCount?: number; engagementScore?: number } | undefined;
  const raw = metadata?.commentCount ?? metadata?.engagementScore ?? 0;

  if (raw <= 0) {
    return 0;
  }

  return Math.min(Math.log10(raw + 1) / 3, 1);
}

export function scoreArticle(article: Article, rules: CuratorRules): CuratedArticle {
  const sourceRaw = article.sourceName ? getSourceWeight(article, rules) : 1;
  const sourceScore = Math.min(sourceRaw / MAX_SOURCE_WEIGHT, 1);
  const recencyScore = getRecencyScore(article.publishedAt, rules.recencyHalfLifeHours);
  const keywordScore = getKeywordScore(article, rules);
  const engagementScore = getEngagementScore(article);

  const score =
    0.25 * sourceScore +
    0.35 * recencyScore +
    0.3 * keywordScore +
    0.1 * engagementScore;

  return {
    ...article,
    score,
    scoreDetails: {
      source: sourceScore,
      recency: recencyScore,
      keywords: keywordScore,
      engagement: engagementScore,
    },
  };
}

export function curate(articles: Article[], options: CuratorOptions = {}): CuratedArticle[] {
  const rules = loadRules(options.rules);

  const scored = articles.map((article) => scoreArticle(article, rules));

  const filtered = scored.filter((item) => item.score >= rules.minScoreThreshold);

  filtered.sort((a, b) => b.score - a.score);

  return filtered.slice(0, rules.maxStories);
}
