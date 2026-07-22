# The Gradient AI Newsletter

A Node.js TypeScript project that automatically aggregates, curates, and publishes a daily AI newsletter from RSS feeds and other sources.

## Overview

The Gradient AI Newsletter pipeline:

1. **Fetch** — Aggregates articles from RSS feeds (TechCrunch AI, Ars Technica, arXiv, OpenAI Blog, Anthropic Blog, Google AI Blog, relevant subreddits, etc.).
2. **Curate** — Ranks and deduplicates articles using source priority, recency, and relevance keywords.
3. **Summarize** — Generates concise, engaging summaries using an LLM (OpenAI) or a rule-based fallback.
4. **Publish** — Formats the issue as Markdown and/or HTML and writes it to the `posts/` directory.

## Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the pipeline once
npm run dev

# Run tests
npm run test

# Lint
npm run lint
```

## Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
OUTPUT_DIR=posts
```

## Architecture

```
.
├── src/
│   ├── types/          # TypeScript interfaces (Article, Source, NewsletterIssue)
│   ├── config/         # Configuration loader (env vars + optional config.json)
│   ├── fetcher/        # RSS aggregation and deduplication (pending)
│   ├── curator/        # Scoring and ranking algorithm (pending)
│   ├── summarizer/     # LLM and fallback summarization (pending)
│   ├── publisher/      # Markdown/HTML formatting and file writing (pending)
│   └── cli/            # Orchestrator and CLI wiring (pending)
├── scripts/
│   └── run.ts          # Entry point
├── posts/              # Generated newsletter issues
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run dev` | Build and run the orchestrator |
| `npm run test` | Run unit tests with Vitest |
| `npm run lint` | Run ESLint on `src/` |

## License

MIT
