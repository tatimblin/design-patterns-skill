---
title: "feat: Proactive Design Pattern Advisor"
type: feat
status: completed
date: 2026-03-08
origin: docs/brainstorms/2026-03-08-proactive-design-patterns-advisor-brainstorm.md
---

# feat: Proactive Design Pattern Advisor

## Overview

Make the `design-patterns` skill proactive — surfacing GoF pattern insights automatically during planning, implementation, and review workflows rather than requiring explicit invocation. Implemented as a three-layer system where each layer operates independently and adds complementary value.

## Problem Statement

The skill currently requires explicit invocation (`/design-patterns review <file>`). Developers miss pattern opportunities during the most critical moments — while designing classes, mid-implementation, and during code review — because the tool only speaks when asked.

## Proposed Solution

Three independent layers, each covering a different activation surface (see brainstorm: `docs/brainstorms/2026-03-08-proactive-design-patterns-advisor-brainstorm.md`):

| Layer | What | Triggers During | Reliability |
|-------|------|-----------------|-------------|
| **C** | `advise` command added to SKILL.md | Explicitly called by agents/skills | Very high — deterministic |
| **B** | `compound-engineering.local.md` registration | `ce:review` + `ce:work` quality phase | High — config-driven |
| **A** | `.claude/agents/design-pattern-advisor.md` | Planning, new class creation, refactoring | Medium — routing-based |

Build order: C → A → B. Each layer depends on the prior one.

## Technical Approach

### Architecture

```
Developer workflow
       |
  ┌────┴────────────────────────────────────┐
  │                                          │
  ▼                                          ▼
Layer A                                  Layer B
.claude/agents/                    compound-engineering.local.md
design-pattern-advisor.md  ──────►  review_agents: [design-pattern-advisor]
  │                                          │
  │  both call                               │
  ▼                                          ▼
Layer C: SKILL.md `advise <context>` command
  │
  ├── Reads decision-tree.md
  ├── Reads up to 3 pattern knowledge files (top candidates only)
  └── Returns Pattern Radar (1–3 recommendations)
```

**Key architectural decision:** `compound-engineering.local.md`'s `review_agents` list accepts **agent identifiers** (the `name:` field from `.claude/agents/*.md` files). The agent file (Layer A) is what gets registered there (Layer B), so both layers share the same code path through `advise`.

### Phase 1: Layer C — `advise` Command

**File to modify:** `.claude/skills/design-patterns/SKILL.md`

Add a fourth command section `### advise <context>` after the existing `implement` command.

**Command behavior — two input modes:**

| Input Type | Detection | Behavior |
|------------|-----------|----------|
| File path | `<context>` is a valid file path | Read file; use code scanning for smell detection (Mode A criterion 1 is evaluatable) |
| Prose description | `<context>` is natural language | Skip smell detection; match on applicability criteria only (Sections 1 & 2) |

**Processing steps (both modes):**
1. Read `decision-tree.md`
2. Identify candidate patterns from decision tree (top 3–5 matches based on context)
3. For each candidate: read its pattern knowledge file; apply **partial Mode A** scoring:
   - File mode: all 4 criteria evaluatable
   - Prose mode: Sections 1 & 2 only (applicability + premature use check); score out of available criteria
4. Rank candidates by score; keep top 1–3 scoring above 25%
5. Emit **Pattern Radar** (see output format below)
6. If zero candidates above 25%: emit "No strong pattern matches found."

**Do NOT do in `advise` mode:**
- Fetch language-specific repos (no `fetch_repo.py` call)
- Run Mode B conformance scoring
- Apply Phase 3 code context verification
- Read all 22 pattern files (read only top N candidates)

**Pattern Radar output format:**
```
Pattern Radar:
• <PatternName> (Mode A: <score>%) — <one-line rationale>
• <PatternName> (Mode A: <score>%) — <one-line rationale>

For full scoring: `design-patterns evaluate <pattern-name> <file>`
```

**Example output:**
```
Pattern Radar:
• Strategy (Mode A: 75%) — Multiple if/else branches selecting interchangeable algorithms; extract each into a Strategy object
• Observer (Mode A: 50%) — Cross-object notifications that would decouple if using a subscriber list

For full scoring: `design-patterns evaluate strategy src/processor.ts`
```

**SKILL.md entry (add after `### implement <pattern-name>` section):**

```markdown
### advise <context>

Quickly surface 1–3 pattern recommendations without full DPVIA analysis. Designed for sub-agent use.

`<context>` is either a file path or a prose description of the problem being designed.

1. Determine input mode:
   - If `<context>` is a valid file path, read the file (file mode)
   - Otherwise, treat as a prose description (prose mode)
2. Read `decision-tree.md`
3. Identify up to 5 candidate patterns from the decision tree:
   - File mode: scan for structural hallmarks matching Section 3 (code smell triggers)
   - Prose mode: match stated intent against Section 1 (applicability)
4. For each candidate, read its knowledge file and apply partial Mode A scoring:
   - File mode: evaluate all 4 criteria
   - Prose mode: evaluate Sections 1 & 2 only; compute score over available criteria
5. Keep top 1–3 candidates scoring above 25%
6. **If recommendations found:** Emit Pattern Radar (name, score, one-line rationale per entry), then suggest `design-patterns evaluate <pattern-name>` for full scoring
7. **If no candidates above 25%:** Emit "No strong pattern matches found."

Do NOT: fetch language repos, run Mode B, apply Phase 3 verification, or read all 22 pattern files.
```

---

### Phase 2: Layer A — Proactive Agent File

**Files to create:**
- `.claude/agents/` directory
- `.claude/agents/design-pattern-advisor.md`

**Agent frontmatter:**
```yaml
---
name: design-pattern-advisor
description: >
  Use this agent when a developer is making structural design decisions that would
  benefit from GoF pattern guidance. Fires proactively on: new classes or services
  with multiple collaborators, refactoring discussions, "how should I structure this"
  questions, class/interface design conversations.
  Do NOT fire on: bug fixes, configuration file changes, UI/CSS tweaks, simple data
  transformations, or when the user has already explicitly run design-patterns review
  or evaluate in this conversation.
model: inherit
---
```

**Agent body — what the agent does when triggered:**
1. Identify the file(s) being discussed or the prose description of the design problem
2. Call the design-patterns skill: `design-patterns advise <file-or-description>`
3. Surface the Pattern Radar output inline

**Example blocks (6 total — 4 proactive triggers, 1 explicit, 1 negative/no-fire):**

```markdown
<example>
Context: User just created a new TypeScript class with multiple injected collaborators and conditional behavior
user: "I've added the OrderProcessor class that handles payment, inventory, and notification differently based on order type"
assistant: "Let me check for pattern opportunities in this new class."
<commentary>
New class with multiple collaborators and type-based branching is a strong signal for Strategy, Chain of Responsibility, or Facade patterns. Fire the design-pattern-advisor to check.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to surface any pattern recommendations."
</example>

<example>
Context: User is asking how to structure code before writing it
user: "I need to add support for multiple notification channels (email, SMS, push). How should I structure this?"
assistant: "Before we design it, let me check which pattern fits this problem."
<commentary>
"How should I structure" + multiple interchangeable implementations is a textbook Strategy or Observer trigger. Fire proactively.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to recommend the best structural approach."
</example>

<example>
Context: User is refactoring code that has grown messy
user: "This service is getting really complex — it does too many things and I want to clean it up"
assistant: "Let me surface pattern options for the refactor."
<commentary>
"Too many things" and complexity complaints are classic God Object / Facade pattern signals. Fire to give structured refactoring guidance.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to identify patterns that could simplify this."
</example>

<example>
Context: User wrote a new abstract base class and several subclasses
user: "I've added a Document base class with PdfDocument, WordDocument, and HtmlDocument subclasses that each override the render pipeline steps"
assistant: "Let me check if a Template Method pattern applies here."
<commentary>
Abstract base class + subclasses overriding steps in a pipeline is the canonical Template Method trigger. Fire the advisor.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to evaluate the structural fit."
</example>

<example>
Context: User explicitly requests pattern analysis
user: "Can you check if any design patterns apply to this code?"
assistant: "I'll use the design-pattern-advisor agent to analyze it."
<commentary>
Explicit pattern analysis request. Fire the advisor.
</commentary>
</example>

<example>
Context: User is fixing a null pointer bug in an existing method
user: "I'm getting a null reference error in the getUserById method — I need to add a null check"
assistant: "Let me look at that method and fix the null check."
<commentary>
Bug fix to a single method with no structural change. Do NOT fire the design-pattern-advisor — this is a targeted bug fix, not a structural design decision.
</commentary>
</example>
```

---

### Phase 3: Layer B — `compound-engineering.local.md` Integration

**File to create:** `compound-engineering.local.md` (project root)

This file is read by `ce:review` and `ce:work` (from the compound-engineering plugin). The `review_agents` YAML frontmatter list controls which agents run during quality checks. Registering `design-pattern-advisor` here means both commands automatically invoke it alongside other review agents.

**File content:**
```markdown
---
review_agents:
  - design-pattern-advisor
---

## Design Patterns Review Context

When running the `design-pattern-advisor` agent, focus on:
- New classes and services added or significantly modified by the PR
- Code that shows signs of structural complexity (multiple conditionals, God objects, tight coupling)
- Ignore: configuration files, migrations, test fixtures, and trivial getter/setter code
```

The markdown body is passed to the agent as additional instructions per the ce:review protocol.

---

### Phase 4: Setup Templates

**File to create:** `docs/setup/project-adoption-guide.md`

This guide gives users everything they need to enable the proactive advisor in their own projects.

**Content to include:**
1. **Prerequisites:** compound-engineering plugin must be installed; design-patterns-skill must be accessible (either cloned or copied)
2. **Step 1 — Agent file:** Copy `.claude/agents/design-pattern-advisor.md` into your project's `.claude/agents/` directory
3. **Step 2 — CE integration:** Copy `compound-engineering.local.md` template into your project root (or merge `review_agents` key if file already exists)
4. **Step 3 — CLAUDE.md snippet (optional):** If you want the agent to fire during non-CE workflows, add this to your project `CLAUDE.md`:
   ```
   When designing new classes, services, or refactoring structural code, proactively run the design-pattern-advisor agent to surface GoF pattern opportunities.
   ```
5. **Verification smoke test:** Run `design-patterns advise "I need to add multiple payment processors"` — should return a Pattern Radar with Strategy at ≥75%.
6. **Opting out:** Remove the agent file or remove `design-pattern-advisor` from `review_agents` to disable.

---

## System-Wide Impact

### Interaction Graph

- Layer C is a pure read — it reads knowledge files and returns text. No state mutation.
- Layer A fires via Claude's agent routing — adds latency to responses in trigger scenarios (estimated: 1–3 additional seconds to surface Pattern Radar)
- Layer B fires in parallel with other review agents during `ce:review` — does not block other agents; adds 1 additional sub-agent call to the parallel batch
- `ce:work` quality check phase includes Layer B as one of N review agents — adds marginal cost to quality check

### Error Propagation

- If `decision-tree.md` is missing or unreadable, `advise` should fall back to `review` behavior (full DPVIA) with a warning, not silently produce empty output
- If a candidate pattern file is unreadable, skip that candidate and continue; do not abort the entire `advise` call
- If the agent file is present but the skill is not installed: graceful failure — the agent calls `design-patterns advise` which will fail; agent should handle this by noting the skill is unavailable

### State Lifecycle Risks

None — all three layers are read-only operations producing advisory text. No persistent state is modified.

### API Surface Parity

- The existing `review`, `evaluate`, `implement` commands are unchanged
- `advise` is additive — it does not replace any existing command
- Layer A and Layer B call `advise` internally; users can also call it directly

### Integration Test Scenarios

1. **Prose input → Pattern Radar:** `design-patterns advise "building a plugin system where each plugin implements the same interface"` → should recommend Strategy or Template Method
2. **File input → Pattern Radar:** `design-patterns advise examples/payment-processing/src/index.ts` → should surface ≥1 pattern recommendation
3. **No-pattern scenario:** `design-patterns advise "fixing a typo in a user's display name"` → should return "No strong pattern matches found"
4. **CE integration:** `ce:review` with `compound-engineering.local.md` in place → Pattern Radar appears in review output alongside other review agents
5. **Escalation flow:** After Pattern Radar recommends Strategy, user runs `design-patterns evaluate strategy <file>` → full DPVIA report is produced

---

## Acceptance Criteria

### Functional Requirements

- [x] `advise <context>` command exists in SKILL.md with documented file-mode and prose-mode paths
- [x] `advise` returns Pattern Radar format: name, Mode A score, one-line rationale, 1–3 entries
- [x] `advise` does NOT call `fetch_repo.py`, does NOT run Mode B, does NOT read all 22 pattern files
- [x] `advise` returns "No strong pattern matches found" when no candidates score above 25%
- [x] `advise` ends with escalation suggestion linking to `evaluate` or `review`
- [x] `.claude/agents/design-pattern-advisor.md` exists with `name: design-pattern-advisor`
- [x] Agent file contains ≥4 `<example>` blocks including at least one negative (no-fire) example
- [x] Agent fires on: new class creation with multiple collaborators, refactoring discussions, "how should I structure" questions
- [x] Agent does NOT fire on: bug fixes to single methods, config file changes, UI-only tweaks
- [x] `compound-engineering.local.md` exists at project root with `design-pattern-advisor` in `review_agents`
- [x] `docs/setup/project-adoption-guide.md` exists with 5-step adoption instructions and smoke test

### Quality Gates

- [x] The `advise` command section in SKILL.md follows the existing command style (imperative numbered list, bold branch labels, inline score thresholds)
- [x] The agent file follows Claude Code agent format (YAML frontmatter with `name:`, `description:`, `model:`, then body with `<example>` blocks)
- [x] Pattern Radar output is ≤8 lines — embeddable without dominating the host output
- [x] All three layers are described in `docs/setup/project-adoption-guide.md`

---

## Dependencies & Prerequisites

- Compound-engineering plugin v2.x+ installed (for `ce:review` and `ce:work` to read `compound-engineering.local.md`)
- 22 pattern knowledge files, `decision-tree.md`, and `scoring/dpvia-conformance.md` present (already exist)
- `.claude/agents/` directory must be created (does not exist yet)

---

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Layer A fires too aggressively | Noisy, users disable it | 1 negative example + specific trigger descriptions in frontmatter |
| Layer B slows `ce:review` | Frustrating UX | `advise` is fast-mode by design; reads ≤3 knowledge files |
| `review_agents` format mismatch | Silent Layer B failure | Verify against compound-engineering plugin docs before writing |
| Skill not installed in user project | All layers fail silently | Setup guide includes prerequisite check + smoke test |

---

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-03-08-proactive-design-patterns-advisor-brainstorm.md](../brainstorms/2026-03-08-proactive-design-patterns-advisor-brainstorm.md)
  - Key decisions carried forward: per-project opt-in scope (not global); Pattern Radar brief output format; layered C→A→B build order; complementary (not replacement) relationship with `pattern-recognition-specialist`

### Internal References

- Skill entrypoint: `.claude/skills/design-patterns/SKILL.md`
- Scoring framework: `.claude/skills/design-patterns/scoring/dpvia-conformance.md`
- Decision tree: `.claude/skills/design-patterns/decision-tree.md`
- Existing agent example from CE plugin: `/Users/ttimblin/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.38.1/agents/review/pattern-recognition-specialist.md`
- `ce:review` source (shows `review_agents` consumption): `/Users/ttimblin/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.38.1/commands/ce/review.md:64-82`
- `ce:work` source (shows quality phase): `/Users/ttimblin/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.38.1/commands/ce/work.md:194`

### External References

- Agent triggering examples guide: `/Users/ttimblin/.claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/agent-development/references/triggering-examples.md`
