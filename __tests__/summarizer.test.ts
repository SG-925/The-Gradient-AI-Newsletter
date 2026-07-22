import { describe, it, expect, vi, beforeEach } from 'vitest';
import { summarizeArticle, setHttpClient } from '../src/summarizer/summarizer';
import { Article } from '../src/types';
import axios from 'axios';

const mockPost = vi.fn();

const createBaseArticle = (overrides: Partial<Article> = {}): Article => ({
  id: '1',
  title: 'OpenAI announces new GPT-5 model with breakthrough reasoning capabilities',
  url: 'https://example.com/gpt5-announcement',
  description:
    'OpenAI has unveiled GPT-5, its most advanced AI model to date. The new model demonstrates significant improvements in reasoning, mathematics, and coding benchmarks. Early testers report a 40% improvement over GPT-4 on complex problem-solving tasks.',
  content:
    'GPT-5 was trained on a diverse dataset and features a new architecture. The model achieves state-of-the-art results on MMLU, HumanEval, and GSM8K benchmarks. OpenAI claims it is 3x more efficient than its predecessor. The API is priced at $30 per million tokens.',
  publishedAt: new Date('2024-01-01'),
  sourceId: 'openai-blog',
  sourceName: 'OpenAI Blog',
  category: 'AI',
  ...overrides,
});

describe('summarizer', () => {
  beforeEach(() => {
    mockPost.mockReset();
    setHttpClient({
      post: mockPost,
    } as unknown as typeof axios);
  });

  describe('fallback mode', () => {
    it('should return a summary when no API key is configured', async () => {
      const article = createBaseArticle();
      const summary = await summarizeArticle(article);

      expect(summary).toMatchObject({
        headline: expect.any(String),
        intro: expect.any(String),
        body: expect.any(String),
        sourceUrl: article.url,
      });
    });

    it('should truncate headline longer than 80 characters', async () => {
      const article = createBaseArticle({
        title: 'A'.repeat(100),
      });
      const summary = await summarizeArticle(article);

      expect(summary.headline.length).toBeLessThanOrEqual(80);
      expect(summary.headline.endsWith('...')).toBe(true);
    });

    it('should keep headline intact when under 80 characters', async () => {
      const article = createBaseArticle({
        title: 'Short headline',
      });
      const summary = await summarizeArticle(article);

      expect(summary.headline).toBe('Short headline');
    });

    it('should generate intro from first 1-2 sentences of description', async () => {
      const article = createBaseArticle({
        description:
          'First sentence. Second sentence. Third sentence. Fourth sentence.',
      });
      const summary = await summarizeArticle(article);

      expect(summary.intro).toContain('First sentence.');
      expect(summary.intro).toContain('Second sentence.');
      expect(summary.intro).not.toContain('Fourth sentence.');
    });

    it('should include source citation in body', async () => {
      const article = createBaseArticle();
      const summary = await summarizeArticle(article);

      expect(summary.body).toContain(article.url);
    });

    it('should include What happened and Key stats sections in fallback body', async () => {
      const article = createBaseArticle();
      const summary = await summarizeArticle(article);

      expect(summary.body).toContain('What happened:');
      expect(summary.body).toContain('Key stats:');
    });

    it('should handle articles with empty description and content', async () => {
      const article = createBaseArticle({
        description: '',
        content: '',
      });
      const summary = await summarizeArticle(article);

      expect(summary.headline).toBeTruthy();
      expect(summary.intro).toBeTruthy();
      expect(summary.body).toBeTruthy();
      expect(summary.sourceUrl).toBe(article.url);
    });

    it('should use title-based intro when no description is available', async () => {
      const article = createBaseArticle({
        description: '',
        content: '',
      });
      const summary = await summarizeArticle(article);

      expect(summary.intro).toContain(article.title);
    });
  });

  describe('LLM mode', () => {
    it('should call OpenAI API when an API key is provided', async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  headline: 'GPT-5 unveiled with breakthrough reasoning',
                  intro: 'OpenAI just dropped its most powerful model yet.',
                  body: '**What happened:** OpenAI launched GPT-5.\n**Why it matters:** It sets a new bar.\n**Key stats:** 40% improvement.\n**Source:** https://example.com/gpt5',
                }),
              },
            },
          ],
        },
      });

      const article = createBaseArticle();
      const summary = await summarizeArticle(article, {
        openaiApiKey: 'test-key',
        openaiModel: 'gpt-4o',
        openaiTemperature: 0.5,
      });

      expect(mockPost).toHaveBeenCalledTimes(1);
      const callArg = mockPost.mock.calls[0]![0]!;
      expect(callArg).toBe('https://api.openai.com/v1/chat/completions');
      expect(mockPost.mock.calls[0]![1]).toMatchObject({
        model: 'gpt-4o',
        temperature: 0.5,
      });

      expect(summary.headline).toBe('GPT-5 unveiled with breakthrough reasoning');
      expect(summary.intro).toBe('OpenAI just dropped its most powerful model yet.');
      expect(summary.body).toContain('OpenAI launched GPT-5');
      expect(summary.sourceUrl).toBe(article.url);
    });

    it('should enforce max 80 character headline from LLM response', async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  headline: 'A'.repeat(200),
                  intro: 'Test intro.',
                  body: '**What happened:** ...',
                }),
              },
            },
          ],
        },
      });

      const article = createBaseArticle();
      const summary = await summarizeArticle(article, {
        openaiApiKey: 'test-key',
      });

      expect(summary.headline.length).toBeLessThanOrEqual(80);
      expect(summary.headline.endsWith('...')).toBe(true);
    });

    it('should throw when OpenAI returns invalid JSON', async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: 'not valid json',
              },
            },
          ],
        },
      });

      const article = createBaseArticle();

      await expect(
        summarizeArticle(article, {
          openaiApiKey: 'test-key',
        })
      ).rejects.toThrow('Failed to parse OpenAI response as JSON');
    });

    it('should handle missing message content gracefully', async () => {
      mockPost.mockResolvedValueOnce({
        data: {},
      });

      const article = createBaseArticle();

      await expect(
        summarizeArticle(article, {
          openaiApiKey: 'test-key',
        })
      ).rejects.toThrow('Failed to parse OpenAI response as JSON');
    });
  });

  describe('length constraints', () => {
    it('should enforce fallback headline length for long titles', async () => {
      const article = createBaseArticle({
        title: 'A'.repeat(150),
      });

      const summary = await summarizeArticle(article);

      expect(summary.headline.length).toBeLessThanOrEqual(80);
    });

    it('should not truncate short headlines', async () => {
      const article = createBaseArticle({
        title: 'Short title',
      });

      const summary = await summarizeArticle(article);

      expect(summary.headline).toBe('Short title');
    });
  });

  describe('citation formatting', () => {
    it('should always include the article URL as sourceUrl', async () => {
      const article = createBaseArticle();
      const summary = await summarizeArticle(article);

      expect(summary.sourceUrl).toBe(article.url);
    });

    it('should include URL in LLM mode body', async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  headline: 'Test headline',
                  intro: 'Test intro.',
                  body: '**Source:** https://example.com/gpt5-announcement',
                }),
              },
            },
          ],
        },
      });

      const article = createBaseArticle();
      const summary = await summarizeArticle(article, {
        openaiApiKey: 'test-key',
      });

      expect(summary.body).toContain(article.url);
    });
  });

  describe('edge cases', () => {
    it('should handle articles with minimal content', async () => {
      const article = createBaseArticle({
        description: '',
        content: '',
        title: 'Tiny article',
      });

      const summary = await summarizeArticle(article);

      expect(summary.headline).toBe('Tiny article');
      expect(summary.intro).toContain('Tiny article');
      expect(summary.body).toBeTruthy();
    });

    it('should use default model and temperature from config', async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  headline: 'Test',
                  intro: 'Test',
                  body: '**What happened:** Test',
                }),
              },
            },
          ],
        },
      });

      const article = createBaseArticle();
      await summarizeArticle(article, {
        openaiApiKey: 'test-key',
      });

      expect(mockPost.mock.calls[0]![1]).toMatchObject({
        model: 'gpt-4o-mini',
        temperature: 0.7,
      });
    });
  });
});
