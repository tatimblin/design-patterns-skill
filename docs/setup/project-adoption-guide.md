# Proactive Design Pattern Advisor — Project Adoption Guide

Enable the design-pattern-advisor in your own project so GoF pattern insights surface automatically during planning, implementation, and code review.

## Prerequisites

- This skill accessible to Claude Code (clone this repo or copy `.claude/skills/design-patterns/` into your project's `.claude/skills/`)

That's it. No other plugins required.

---

## Standalone setup (no plugins required)

### Step 1 — Copy the agent file

```bash
mkdir -p .claude/agents
cp /path/to/design-patterns-skill/.claude/agents/design-pattern-advisor.md .claude/agents/
```

The agent fires automatically when you create new classes, discuss structural design, or refactor complex code — in any Claude Code conversation, with no other tools installed.

### Step 2 — Add a CLAUDE.md instruction (recommended)

Add this to your project's `CLAUDE.md` to reinforce when the agent fires:

```markdown
When designing new classes, services, or refactoring structural code, proactively run
the design-pattern-advisor agent to surface GoF pattern opportunities.
```

This ensures the agent triggers during planning discussions and mid-implementation, not just after code is written.

### Verification smoke test

```
design-patterns advise "I need to add multiple payment processors with different fee structures"
```

Expected output:

```
Pattern Radar:
• Strategy (Mode A: 75%) — Multiple interchangeable algorithms with the same interface; extract each processor into a Strategy

For full scoring: `design-patterns evaluate strategy <file>`
```

---

## Optional: compound-engineering integration

If you use the [compound-engineering plugin](https://github.com/EveryInc/compound-engineering-plugin), you can register the advisor as a review agent so `ce:review` and `ce:work` automatically run it during quality checks.

Copy `compound-engineering.local.md` from this repo into your project root:

```bash
cp /path/to/design-patterns-skill/compound-engineering.local.md .
```

Or if you already have a `compound-engineering.local.md`, add `design-pattern-advisor` to the `review_agents` list:

```yaml
---
review_agents:
  - design-pattern-advisor   # add this line
  - your-existing-agent
---
```

---

## Opting out

- **Disable proactive agent:** Remove `.claude/agents/design-pattern-advisor.md`
- **Disable CE integration only:** Remove `design-pattern-advisor` from `compound-engineering.local.md`
- **Disable completely:** Remove both files

---

## How the three layers work

| Layer | File | Requires CE? | Triggers During |
|-------|------|--------------|-----------------|
| A — Proactive agent | `.claude/agents/design-pattern-advisor.md` | No | Any conversation: new classes, refactoring, design discussions |
| B — CE integration | `compound-engineering.local.md` | Yes | `ce:review` and `ce:work` quality phase |
| C — Direct command | Built into the skill | No | Explicitly: `design-patterns advise <file-or-description>` |

All three layers use the same `advise` command, returning a lightweight **Pattern Radar** (1–3 recommendations with name, score, rationale) rather than a full conformance report.
