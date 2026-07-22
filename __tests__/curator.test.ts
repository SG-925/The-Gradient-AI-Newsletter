import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Article } from '../src/types';
import { scoreArticle, curate, CuratedArticle } from '../src/curator/curator';
import { DEFAULT_RULES, loadRules } from '../src/curator/rules';

describe('curator', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  function makeArticle(overrides: Partial<Article> = {}): Article {
    return {
      id: `article-${Math.random()}`,
      title: 'Test Article',
      url: 'https://example.com/article',
      publishedAt: new Date(),
      sourceId: 'source-1',
      sourceName: 'TechCrunch AI',
      ...overrides,
    };
  }

  describe('scoreArticle', () => {
    it('should produce a score between 0 and 1', () => {
      const article = makeArticle();
      const result = scoreArticle(article, DEFAULT_RULES);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    describe('source priority weighting', () => {
      it('should score high-priority sources higher than low-priority sources', () => {
        const high = makeArticle({ sourceName: 'OpenAI Blog', title: 'AI News' });
        const low = makeArticle({ sourceName: 'Reddit r/artificial', title: 'AI News' });
        const rules = loadRules({ sourcePriorities: undefined });

        const highResult = scoreArticle(high, rules);
        const lowResult = scoreArticle(low, rules);

        expect(highResult.scoreDetails.source).toBeGreaterThan(lowResult.scoreDetails.source);
      });

      it('should assign the correct source weight for matched sources', () => {
        const openai = makeArticle({ sourceName: 'OpenAI Blog' });
        const result = scoreArticle(openai, DEFAULT_RULES);
        expect(result.scoreDetails.source).toBeCloseTo(5 / 5, 2);
      });
    });

    describe('recency weighting', () => {
      it('should score newer articles higher than older ones', () => {
        const now = Date.now();
        const recent = makeArticle({ publishedAt: new Date(now - 1000 * 60 * 60), title: 'AI News' });
        const older = makeArticle({ publishedAt: new Date(now - 1000 * 60 * 60 * 24 * 3), title: 'AI News' });
        const rules = loadRules({ recencyHalfLifeHours: 168 });

        const recentResult = scoreArticle(recent, rules);
        const olderResult = scoreArticle(older, rules);

        expect(recentResult.scoreDetails.recency).toBeGreaterThan(olderResult.scoreDetails.recency);
      });

      it('should score a fresh article close to 1.0 for recency', () => {
        const article = makeArticle({ publishedAt: new Date() });
        const result = scoreArticle(article, DEFAULT_RULES);
        expect(result.scoreDetails.recency).toBeGreaterThan(0.99);
      });
    });

    describe('keyword matching', () => {
      it('should boost score for articles containing high-impact AI keywords', () => {
        const keywordArticle = makeArticle({ title: 'GPT-4 and Claude transform LLM capabilities' });
        const neutralArticle = makeArticle({ title: 'Local bakery opens downtown' });

        const keywordResult = scoreArticle(keywordArticle, DEFAULT_RULES);
        const neutralResult = scoreArticle(neutralArticle, DEFAULT_RULES);

        expect(keywordResult.scoreDetails.keywords).toBeGreaterThan(neutralResult.scoreDetails.keywords);
      });

      it('should match keywords case-insensitively', () => {
        const upper = makeArticle({ title: 'GPT-5 BREAKTHROUGH FOR LLM RESEARCH' });
        const lower = makeArticle({ title: 'gpt-5 breakthrough for llm research' });
        const rules = loadRules({ keywordRanges: undefined });

        const upperResult = scoreArticle(upper, rules);
        const lowerResult = scoreArticle(lower, rules);

        expect(upperResult.scoreDetails.keywords).toBeCloseTo(lowerResult.scoreDetails.keywords, 2);
      });

      it('should return 0 keyword score when no keywords match', () => {
        const article = makeArticle({ title: 'Weather forecast for tomorrow', description: 'Sunny with a chance of rain' });
        const result = scoreArticle(article, DEFAULT_RULES);
        expect(result.scoreDetails.keywords).toBe(0);
      });
    });

    describe('engagement', () => {
      it('should increase score for articles with high engagement', () => {
        const highEngagement = makeArticle({
          title: 'AI News',
        } as any);
        (highEngagement as any).metadata = { commentCount: 1000 };

        const noEngagement = makeArticle({ title: 'AI News' });

        const highResult = scoreArticle(highEngagement, DEFAULT_RULES);
        const neutralResult = scoreArticle(noEngagement, DEFAULT_RULES);

        expect(highResult.scoreDetails.engagement).toBeGreaterThan(neutralResult.scoreDetails.engagement);
      });

      it('should score articles without engagement data as 0', () => {
        const article = makeArticle({ title: 'AI News' });
        const result = scoreArticle(article, DEFAULT_RULES);
        expect(result.scoreDetails.engagement).toBe(0);
      });
    });

    it('should attach scoreDetails to the returned article', () => {
      const article = makeArticle();
      const result = scoreArticle(article, DEFAULT_RULES);
      expect(result.scoreDetails).toBeDefined();
      expect(result.scoreDetails.source).toBeDefined();
      expect(result.scoreDetails.recency).toBeDefined();
      expect(result.scoreDetails.keywords).toBeDefined();
      expect(result.scoreDetails.engagement).toBeDefined();
    });
  });

  describe('curate', () => {
    it('should return articles sorted by score descending', () => {
      const articles = [
        makeArticle({ title: 'Bakery opens', id: 'low' }),
        makeArticle({ title: 'GPT-5 announced by OpenAI', id: 'high' }),
        makeArticle({ title: 'Weather', id: 'mid' }),
      ];

      const result = curate(articles);
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
      }
    });

    it('should enforce the max stories limit', () => {
      const articles = Array.from({ length: 10 }, (_, i) =>
        makeArticle({ id: `article-${i}`, title: `GPT news ${i}` })
      );

      const result = curate(articles);
      expect(result.length).toBeLessThanOrEqual(DEFAULT_RULES.maxStories);
    });

    it('should enforce max stories from custom rules', () => {
      const articles = Array.from({ length: 10 }, (_, i) =>
        makeArticle({ id: `article-${i}`, title: `GPT news ${i}` })
      );

      const result = curate(articles, { rules: { maxStories: 3 } });
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should filter articles below the minimum score threshold', () => {
      const articles = [
        makeArticle({ title: 'GPT-5 released', id: '1' }),
        makeArticle({ title: 'Boring local news', id: '2' }),
        makeArticle({ title: 'LLM breakthroughs everywhere', id: '3' }),
      ];

      const defaultResult = curate(articles, { rules: { maxStories: 10 } });
      const filteredResult = curate(articles, {
        rules: { minScoreThreshold: 0.5, maxStories: 10 },
      });

      expect(filteredResult.length).toBeLessThanOrEqual(defaultResult.length);
    });

    it('should return an empty array when all articles score below the threshold', () => {
      const articles = [
        makeArticle({ title: 'Dog wins contest' }),
        makeArticle({ title: 'Local restaurant review' }),
      ];

      const result = curate(articles, {
        rules: { minScoreThreshold: 10, maxStories: 10 },
      });
      expect(result).toHaveLength(0);
    });

    it('should return an empty array for an empty input array', () => {
      const result = curate([]);
      expect(result).toHaveLength(0);
    });

    it('should handle articles with identical scores', () => {
      const articles = [
        makeArticle({ title: 'GPT AI News', id: '1' }),
        makeArticle({ title: 'Claude LLM Update', id: '2' }),
      ];

      const result = curate(articles, { rules: { maxStories: 2 } });
      expect(result).toHaveLength(2);
    });
  });
});
