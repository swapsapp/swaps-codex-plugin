import { readFile } from 'node:fs/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function firstText(result) {
  return result?.content?.find?.((item) => item.type === 'text')?.text ?? '';
}

async function main() {
  const plugin = JSON.parse(await readFile(new URL('../.claude-plugin/plugin.json', import.meta.url), 'utf8'));
  const marketplace = JSON.parse(await readFile(new URL('../.claude-plugin/marketplace.json', import.meta.url), 'utf8'));
  const mcp = JSON.parse(await readFile(new URL('../.mcp.json', import.meta.url), 'utf8'));

  assert(plugin.name === 'swaps-mcp', 'plugin name mismatch');
  assert(marketplace.plugins?.[0]?.source === './', 'marketplace source must point to plugin root');
  assert(mcp.mcpServers?.swaps?.command === 'npx', 'MCP command must be npx');

  const swaps = mcp.mcpServers.swaps;
  const transport = new StdioClientTransport({
    command: swaps.command,
    args: swaps.args,
    env: { ...process.env, ...(swaps.env ?? {}) },
  });
  const client = new Client({ name: 'swaps-codex-plugin-smoke', version: '1.0.0' }, { capabilities: {} });

  try {
    await client.connect(transport);

    const tools = await client.listTools();
    const toolNames = tools.tools.map((tool) => tool.name).sort();
    const expected = [
      'swaps_corridors',
      'swaps_explain_choice',
      'swaps_providers_for_corridor',
      'swaps_quote',
      'swaps_taxonomy',
    ];
    assert(JSON.stringify(toolNames) === JSON.stringify(expected), `unexpected tools: ${toolNames.join(', ')}`);

    const taxonomyResult = await client.callTool({ name: 'swaps_taxonomy', arguments: {} });
    const taxonomy = JSON.parse(firstText(taxonomyResult));
    assert(taxonomy._meta?.providerCount >= 6, 'taxonomy provider count must be >= 6');

    const quoteResult = await client.callTool({
      name: 'swaps_quote',
      arguments: {
        from: 'USD',
        to: 'BTC',
        amount: '100',
        country: 'US',
        side: 'buy',
        method: 'card',
      },
    });
    const quote = JSON.parse(firstText(quoteResult));
    assert(quote.winner?.providerId, 'quote winner.providerId is required');
    assert(quote._meta?.quoteId, 'quote _meta.quoteId is required');

    console.log(
      JSON.stringify(
        {
          status: 'pass',
          tools: toolNames,
          providerCount: taxonomy._meta.providerCount,
          quoteId: quote._meta.quoteId,
          winner: quote.winner.providerId,
        },
        null,
        2
      )
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
