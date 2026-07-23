# The Gradient AI Newsletter

A Node.js TypeScript project that automatically aggregates, curates, and publishes a daily AI newsletter from RSS feeds and other sources.

## Overview

The Gradient AI Newsletter pipeline:

1. **Fetch** — Aggregates articles from RSS feeds (TechCrunch AI, Ars Technica, arXiv, OpenAI Blog, Anthropic Blog, Google AI Blog, relevant subreddits, etc.).
2. **Curate** — Ranks and deduplicates articles using source priority, recency, and relevance keywords.
3. **Summarize** — Generates concise, engaging summaries using an LLM (OpenAI) or a rule-based fallback.
4. **Publish** — Formats the issue as Markdown and/or HTML and writes it to the `posts/` directory.

## Web Frontend

The `web/` directory contains a Next.js 14 frontend for browsing newsletter issues.

### Setup

```bash
cd web
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js dev server on port 3000 |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint on the web app |
| `npm run test` | Run Vitest unit tests |

### Running Locally

```bash
# From the project root
cd web

# Start the dev server with hot reloading
npm run dev

# Open http://localhost:3000 in your browser
```

The dev server reads issues from the `../posts/` directory and serves them via API routes at `/api/issues` and `/api/issues/[date]`.

### Running Tests

```bash
cd web
npm run test
```

Tests cover markdown frontmatter parsing, date sorting, date formatting, API response filtering, and read-time estimation.

### Dark / Light Mode

The frontend uses `next-themes` for persistent theme switching. User preference is stored in `localStorage` and synchronized with the system preference. Toggle the theme via the icon in the navbar.

### Responsive Layout

The layout is responsive using Tailwind CSS breakpoints:

- **Mobile** (< 768px): Single-column grid, hamburger menu navigation, theme toggle visible inline
- **Tablet** (768px – 1024px): Two-column card grid, horizontal nav links
- **Desktop** (> 1024px): Three-column card grid, full horizontal nav, max-width container at `max-w-7xl`

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Base URL used by API routes for self-referencing fetches (default: `http://localhost:3000`) |

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
