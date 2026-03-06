---
title: "feat: Pattern Knowledge Files and Decision Tree"
type: feat
status: completed
date: 2026-03-06
origin: docs/brainstorms/2026-03-06-design-patterns-skill-brainstorm.md
---

# Pattern Knowledge Files and Decision Tree

## Goal

Give the design patterns skill structured knowledge so it can recommend, evaluate, and validate GoF patterns using a research-backed scoring methodology instead of hardcoded smell mappings.

## What We're Building

Four deliverables:

1. **22 pattern knowledge files** -- one per GoF pattern, language-agnostic
2. **1 decision tree** -- maps code smells to candidate patterns
3. **1 scoring file** -- DPVIA-adapted conformance scoring (separate, swappable)
4. **Updated main skill file** -- references the above

## Pattern Knowledge Files

**Location:** `.claude/skills/design-patterns/<pattern-name>.md`

**Template (7 sections):**

| # | Section | Purpose |
|---|---------|---------|
| 1 | Applicability | When to use this pattern |
| 2 | Pros/Cons | Trade-offs |
| 3 | Relationships | Related patterns, common confusions |
| 4 | Premature Use | When it's over-engineering |
| 5 | Code Smell Triggers | Smells that indicate this pattern is needed |
| 6 | Anti-Pattern Warnings | What misuse looks like |
| 7 | Structural Characteristics | Participant roles + relationships (tables, required/optional) |

**Section 7 format:**

```markdown
#### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Strategy | Abstraction defining the common interface | Yes |
| ConcreteStrategy | Implements the Strategy interface | Yes |
| Context | Holds a Strategy reference and delegates to it | Yes |

#### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| ConcreteStrategy | Strategy | implements | Yes |
| Context | Strategy | references | Yes |
| Context | Strategy | delegates to | Yes |
| Context | ConcreteStrategy | creates | No |
```

**Source:** Fetch each pattern's refactoring.guru page via WebFetch. Adapt into the template.

**Standard:** Match the Strategy example in the brainstorm for sections 1-6 depth.

## Decision Tree

**Location:** `.claude/skills/design-patterns/decision-tree.md`

Maps code smells to candidate patterns with disambiguation.

- Every GoF pattern reachable from at least one smell entry
- Each entry: smell description, 2-3 candidate patterns, disambiguation guidance
- Example: "Growing conditional -> Strategy (algorithms selected at runtime) vs State (state-dependent behavior with internal transitions) vs Command (discrete operations that could be queued)"

## Scoring Framework

**Location:** `.claude/skills/design-patterns/scoring/dpvia-conformance.md`

Separate file so alternative scoring approaches can be added later. The main skill references whichever scoring file is active.

### Two Scoring Modes

**Mode A -- Recommendation Scoring** (code without a pattern)

Used when the skill needs to recommend a pattern. For each candidate, check 4 things from the pattern's knowledge file:

| Check | Pass (1) | Fail (0) |
|-------|----------|----------|
| Code has smells from this pattern's triggers (section 5) | 1+ smells match | None match |
| Problem matches applicability (section 1) | 1+ items match | No match |
| No premature use conditions apply (section 4) | None apply | 1+ apply |
| No anti-pattern warnings for proposed refactor (section 6) | None match | 1+ match |

Score = `(passes / 4) * 100`. Highest score wins.

- **100%:** Strong recommendation
- **75%:** Good recommendation, one concern
- **50%:** Weak, mention as alternative only
- **25% or below:** Do not recommend

**Mode B -- Conformance Scoring** (code with an existing pattern)

Used when the skill assesses code that already implements a pattern. Compare against section 7 (Structural Characteristics) using Hamming distance:

```
ConformanceScore = (1 - HammingDistance / N) * 100
```

For each role and relationship in the pattern's tables, mark present (1) or absent (0). Missing required = violation. Missing optional = reduces score but isn't a violation.

- **90-100%:** Correctly applied
- **60-89%:** Deformed -- structural issues present
- **Below 60%:** Wrong pattern or major violations

### Code Context Verification (Phase 3)

Before reporting a conformance violation, check if it's intentional:

- Class/function names suggesting deliberate decoupling
- Comments noting intentional deviation
- Module structure justifying absent relationships

If justified, report as "intentional deviation" and don't count against score.

### Per-Command Usage

| Command | No pattern found | Pattern found |
|---------|-----------------|---------------|
| `review` | Smell scan -> decision tree -> Mode A on candidates -> recommend highest | Detect hallmarks -> Mode B + verification -> report conformance |
| `evaluate` | Mode A on named pattern -> recommendation score | Mode B + verification -> conformance percentage + verdict |
| `implement` | Mode A pre-check (warn if <=50%) -> refactor -> Mode B post-check (target 90%+) | Mode B pre-check -> warn if <60% -> refactor -> Mode B post-check |

## Main Skill File Updates

- Reference `scoring/dpvia-conformance.md` for all scoring
- `review`: use decision tree + scoring; add correct-pattern validation path
- `evaluate`: report score + verdict; "wrong pattern" suggests alternative
- `implement`: gate on score; post-implementation verification
- Remove inline smell-to-pattern mapping

## Implementation Order

| Step | What | Notes |
|------|------|-------|
| 1 | Create directories | `.claude/skills/design-patterns/` and `scoring/` |
| 2 | Write `scoring/dpvia-conformance.md` | Scoring framework first -- pattern files depend on its format |
| 3 | Write 9 priority pattern files | Observer, Strategy, Factory Method, Builder, Adapter, Bridge, Prototype, Facade, Abstract Factory |
| 4 | Write `decision-tree.md` | After pattern files so smells can cross-reference |
| 5 | Test against 9 examples | Verify with `examples/answer.md` |
| 6 | Write remaining 13 pattern files | Singleton, Composite, Decorator, Flyweight, Proxy, Chain of Responsibility, Command, Iterator, Mediator, Memento, State, Template Method, Visitor |
| 7 | Update decision tree | Add smell entries for 13 new patterns |
| 8 | Update main skill file | Wire everything together |
| 9 | Final validation | All 9 test cases pass |

## Acceptance Criteria

- [x] 22 pattern files with 7-section template, structural characteristics in tabular format
- [x] Decision tree with every pattern reachable from at least one smell
- [x] Scoring file with Mode A (recommendation) and Mode B (conformance) documented
- [x] Main skill file references scoring file, decision tree, and pattern files
- [x] `review` correct for all 9 test cases (5 needs-pattern, 2 wrong-pattern, 2 correct-pattern)
- [x] `evaluate` produces scores and distinguishes good fit / deformed / premature / wrong pattern
- [x] `implement` gates on low scores and verifies post-implementation quality
- [x] Correct-pattern examples (shape-editor, home-automation) produce 90%+ conformance

## Risks

- **Threshold tuning:** 90%/60% thresholds may need adjustment after testing. Scoring file separation makes this a one-file change.
- **Context window:** Reading scoring file + decision tree + pattern files per invocation. Keep pattern files ~50-70 lines, decision tree entries ~3-5 lines.
- **Refactoring.guru availability:** Fall back to Claude's training knowledge if WebFetch fails.

## File Structure

```
.claude/skills/
  design-patterns.md                    # Main skill file
  design-patterns/
    decision-tree.md                    # Smell -> pattern routing
    scoring/
      dpvia-conformance.md              # Active scoring framework
    observer.md                         # 22 pattern knowledge files
    strategy.md
    factory-method.md
    ... (19 more)
```

## Sources

- **Brainstorms:** [design-patterns-skill](docs/brainstorms/2026-03-06-design-patterns-skill-brainstorm.md), [dpvia-scoring](docs/brainstorms/2026-03-06-dpvia-scoring-framework-brainstorm.md)
- **Research:** Abdelaziz et al., "Identification and Assessment of Software Design Pattern Violations" (2019, [arXiv:1906.01419](https://arxiv.org/abs/1906.01419))
- **Source material:** refactoring.guru
- **Test suite:** `examples/` (9 mini-apps) with `examples/answer.md`
