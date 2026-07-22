import { loadConfig } from '../src/config';

async function main() {
  const config = loadConfig();
  console.log('Configuration loaded:', {
    hasOpenAiKey: !!config.openaiApiKey,
    openaiModel: config.openaiModel,
    outputDir: config.outputDir,
    maxArticles: config.maxArticles,
    sourcesCount: config.sources.length,
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
