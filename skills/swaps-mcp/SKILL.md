---
name: swaps-mcp
description: Use the Swaps MCP tools for live crypto on-ramp/off-ramp quotes, provider taxonomy, corridor candidates, routing explanations, and curated corridor ordering.
---

# Swaps MCP

Use this skill when the user asks Claude Code or Codex to reason about Swaps provider quotes, fiat-to-crypto routes, provider choice, country/payment-method support, or agent-facing Swaps surfaces.

## Source Of Truth

- Prefer MCP tools from the `swaps` server over memory or static docs.
- Treat `swaps_quote` as the quote source of truth for route ranking.
- Treat the inline `explain` payload from `swaps_quote` as preferred evidence.
- Use `swaps_explain_choice` only when a prior `quoteId` must be re-explained.
- Do not invent provider support, country coverage, payment methods, fees, licenses, limits, or risk verdicts.
- Swaps operates through licensed local partners while pursuing its own VASP/MSB license; do not claim Swaps itself is licensed.

## Tools

- `swaps_quote`: live quote and ranked alternatives.
- `swaps_taxonomy`: provider taxonomy for provider-type reasoning.
- `swaps_providers_for_corridor`: candidate providers for country/method.
- `swaps_explain_choice`: post-hoc explanation by `quoteId`.
- `swaps_corridors`: curated top corridor ordering.

## Operating Rules

- State when a result is live-tool-derived versus inferred.
- For money-flow conclusions, include concrete inputs: amount, from, to, country, side, and payment method.
- If a quote or explanation fails, report the tool error and do not silently fall back to stale assumptions.
- For checkout/redirect claims, this MCP server is not enough; verify the app flow separately.
