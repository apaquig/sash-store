import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const domain = site ? new URL(site).origin : 'https://sashastore.com';
  const sitemapUrl = `${domain}/sitemap-index.xml`;
  const llmsUrl = `${domain}/llms.txt`;

  const content = `# Robots.txt for Sasha Store - Optimized for Google, Bing, and AI Search Engines (GEO)

User-agent: *
Allow: /

# Explicit AI Crawlers Permitted for LLM Indexing (Generative Engine Optimization)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

# Sitemaps and AI Knowledge Graph
Sitemap: ${sitemapUrl}
# LLMs Text File: ${llmsUrl}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
