---
date: 2026-03-08
topic: proactive-design-patterns-advisor
status: brainstorm
---

# Proactive Design Patterns Advisor

## What We're Building

The `design-patterns` skill is currently reactive — it only runs when a user explicitly types `/design-patterns` or when Claude's description routing fires on pattern-keyword requests. The goal is to make it **preemptive**: automatically surfacing GoF pattern insights during planning, implementation, and review workflows, running as a background sub-agent without requiring explicit invocation.

The result should feel like a pattern-aware pair programmer that speaks up when it's relevant, not one that has to be summoned.

## Context: What Already Exists

- **`compound-engineering.local.md`** — a settings file that `ce:review` and `ce:work` both read. The `review_agents` list in its frontmatter controls which sub-agents run during quality checks. This is an integration hook we can use without modifying any plugin code.
- **`agents/` directory** — Claude Code supports `.md` files in `.claude/agents/` that define sub-agents with proactive triggering via `<example>` blocks. Agents here fire automatically based on routing signals.
- **`pattern-recognition-specialist`** agent (in the CE plugin) — already detects patterns but at a surface level (naming, duplication, structural anti-patterns). It does NOT apply DPVIA scoring, GoF conformance checking, or the deep knowledge files this skill has.
- **Plugin is read-only** — `ce:work`, `ce:plan`, and `ce:review` live in a cached read-only directory and cannot be modified directly.

## Why This Approach (Layered System)

No single mechanism covers all three phases (planning, implementation, review). A layered approach is more robust and each layer adds independent value:

| Layer | Mechanism | Triggers During | Reliability |
|-------|-----------|-----------------|-------------|
| A | Agent file (proactive routing) | Any workflow — planning, implementation, review | Medium (fuzzy) |
| B | `compound-engineering.local.md` | `ce:review` + `ce:work` quality phase | High (explicit) |
| C | `advise` command in SKILL.md | When explicitly called by other agents/skills | Very high (deterministic) |

## Key Decisions

- **Layer C first (foundation)**: Add an `advise <context>` command to SKILL.md optimized for sub-agent use. Fast mode: skips full DPVIA scoring, returns top 1-3 pattern recommendations with rationale. This gives both A and B something reliable to call.

- **Layer B next (CE integration)**: Create `compound-engineering.local.md` in this repo with `design-patterns` registered as a `review_agent`. This integrates with `ce:review` and `ce:work` for free, with no routing ambiguity.

- **Layer A last (broad coverage)**: Create `.claude/agents/design-pattern-advisor.md` with 4-6 `<example>` blocks covering proactive scenarios: after structural code is written, during planning discussions about class design, before committing new services/classes.

- **Scope the agent carefully**: The agent should NOT fire on trivial changes (bug fixes, config changes, UI tweaks). Examples should make it fire on: new classes/services with dependencies, refactoring discussions, "how should I structure this" questions.

- **Output format for sub-agent mode**: Return a short advisory block (3-5 bullets max) rather than a full conformance report. Deep analysis is for explicit `/design-patterns review` use.

## Resolved Questions

- **Agent scope**: Per-project opt-in. The agent file and CLAUDE.md instruction live in individual project repos, not globally. Prevents noise in unrelated projects.
- **Advisory output format**: "Pattern Radar" — brief mode by default. Returns 1-3 pattern recommendations with name, fit score, one-line rationale. Designed to embed cleanly in other skill outputs without dominating them.

- **Setup mechanism**: Ship a setup template — a `compound-engineering.local.md` template and CLAUDE.md snippet that users copy into their projects to opt in. Low-friction, no automation needed.
- **Relationship to `pattern-recognition-specialist`**: Complementary. The CE agent runs broad structural checks (naming, duplication, anti-patterns). The design-patterns advisor runs deep GoF analysis with DPVIA scoring. Both run during `ce:review` and serve different purposes.

## Next Steps

→ `/ce:plan` for implementation details across the three layers
