# Changelog

All notable changes to the Swaps MCP plugin are documented here.

## [1.0.0] - 2026-05-13

### Added

- Initial public Claude Code marketplace wrapper for `@agent.swaps/mcp-server@1.0.1`.
- Marketplace manifest for `/plugin marketplace add swapsapp/swaps-codex-plugin`.
- MCP server config exposing `swaps_quote`, `swaps_taxonomy`, `swaps_providers_for_corridor`, `swaps_explain_choice`, and `swaps_corridors`.
- Skill instructions that keep agents anchored to live Swaps MCP results and prevent invented provider claims.
- Local smoke test for MCP handshake, taxonomy, and live quote.
