import { Source } from '../types';

export interface SourcePriorityRule {
  sourceNameSubstring: string;
  weight: number;
}

export interface KeywordRule {
  pattern: RegExp;
  weight: number;
}

export interface CuratorRules {
  sourcePriorities: SourcePriorityRule[];
  keywordRanges: KeywordRule[];
  minScoreThreshold: number;
  maxStories: number;
  recencyHalfLifeHours: number;
  engagementWeight: number;
}

export const DEFAULT_SOURCE_PRIORITIES: SourcePriorityRule[] = [
  { sourceNameSubstring: 'OpenAI Blog', weight: 5 },
  { sourceNameSubstring: 'Anthropic Blog', weight: 5 },
  { sourceNameSubstring: 'Google AI Blog', weight: 5 },
  { sourceNameSubstring: 'TechCrunch AI', weight: 4 },
  { sourceNameSubstring: 'arXiv', weight: 4 },
  { sourceNameSubstring: 'Ars Technica', weight: 3 },
  { sourceNameSubstring: 'Reddit', weight: 2 },
];

export const DEFAULT_KEYWORD_RANGES: KeywordRule[] = [
  { pattern: /\b(GPT|Claude|Gemini|Llama|Diffusion|LLM|Transformer)\b/i, weight: 3 },
  { pattern: /\b(AGI|OpenAI|Google AI|Meta AI)\b/i, weight: 2 },
  { pattern: /\b(NLP|reinforcement learning|multimodal|RAG|fine-tuning|prompt engineering)\b/i, weight: 2 },
  { pattern: /\b(neural network|machine learning|deep learning|artificial intelligence)\b/i, weight: 1 },
];

export const DEFAULT_RULES: CuratorRules = {
  sourcePriorities: DEFAULT_SOURCE_PRIORITIES,
  keywordRanges: DEFAULT_KEYWORD_RANGES,
  minScoreThreshold: 0.2,
  maxStories: 5,
  recencyHalfLifeHours: 168,
  engagementWeight: 1.0,
};

export function loadRules(overrides?: Partial<CuratorRules>): CuratorRules {
  return {
    sourcePriorities: overrides?.sourcePriorities ?? DEFAULT_SOURCE_PRIORITIES,
    keywordRanges: overrides?.keywordRanges ?? DEFAULT_KEYWORD_RANGES,
    minScoreThreshold: overrides?.minScoreThreshold ?? DEFAULT_RULES.minScoreThreshold,
    maxStories: overrides?.maxStories ?? DEFAULT_RULES.maxStories,
    recencyHalfLifeHours: overrides?.recencyHalfLifeHours ?? DEFAULT_RULES.recencyHalfLifeHours,
    engagementWeight: overrides?.engagementWeight ?? DEFAULT_RULES.engagementWeight,
  };
}
