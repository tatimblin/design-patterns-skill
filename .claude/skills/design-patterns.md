---
name: design-patterns
description: >
  Evaluate, detect, and recommend GoF design patterns in any codebase. Use when:
  (1) Reviewing code for anti-patterns and structural issues,
  (2) Implementing a specific design pattern (Observer, Strategy, Factory Method, Builder,
  Adapter, Bridge, Prototype, Facade, Abstract Factory, Singleton, Composite, Decorator,
  Flyweight, Proxy, Chain of Responsibility, Command, Iterator, Mediator, Memento, State,
  Template Method, Visitor),
  (3) Evaluating whether a pattern fits the current problem.
  Triggers on: "design pattern", "refactor to pattern", "code smell", "anti-pattern",
  specific pattern names, or requests to improve code structure and architecture.
---

# Design Patterns

## Knowledge Files

- **Pattern files:** `design-patterns/<pattern-name>.md` -- one per GoF pattern (22 total), each with 7 sections: applicability, pros/cons, relationships, premature use, code smell triggers, anti-pattern warnings, structural characteristics
- **Decision tree:** `design-patterns/decision-tree.md` -- maps code smells to candidate patterns with disambiguation guidance
- **Scoring framework:** `design-patterns/scoring/dpvia-conformance.md` -- DPVIA-adapted conformance scoring with Mode A (recommendation) and Mode B (conformance)

## Commands

### review <file-or-directory>

Scan code for structural issues and recommend or validate design patterns.

1. Read the target files
2. Scan for structural hallmarks of known patterns (e.g., clone methods, subscriber lists, delegation to composed objects)
3. **If a pattern is already present:**
   - Read the pattern's knowledge file (`design-patterns/<pattern>.md`)
   - Read `design-patterns/scoring/dpvia-conformance.md`
   - Apply Mode B (conformance scoring) using Section 7 structural characteristics
   - Apply Phase 3 (code context verification) for any violations
   - Report: pattern name, conformance percentage, verdict, any violations or intentional deviations
4. **If no pattern is found:**
   - Read `design-patterns/decision-tree.md`
   - Identify code smells and match to candidate patterns using the decision tree
   - For each candidate, read its knowledge file and apply Mode A (recommendation scoring)
   - Report: the smell, its location, the recommended pattern (highest scoring), score, and rationale
   - Do not recommend patterns scoring 25% or below

### evaluate <pattern-name>

Assess whether a specific pattern fits the current code.

1. Read the target code
2. Read the pattern's knowledge file (`design-patterns/<pattern-name>.md`)
3. Read `design-patterns/scoring/dpvia-conformance.md`
4. **If the code already implements the pattern:**
   - Apply Mode B (conformance scoring) against Section 7 structural characteristics
   - Apply Phase 3 (code context verification) for any violations
   - Verdict with percentage: **correctly applied** (90-100%), **deformed** (60-89%), or **wrong pattern** (below 60%)
   - If wrong pattern, use decision tree to suggest an alternative
5. **If the code does not implement the pattern:**
   - Apply Mode A (recommendation scoring) using Sections 1, 4, 5, 6
   - Verdict: **good fit** (100%), **good fit with concern** (75%), **weak fit** (50%), or **poor fit** (25% or below)
   - Check Section 4 (premature use) -- if conditions apply, note as **premature**

### implement <pattern-name>

Apply a specific design pattern to existing code.

1. Read the target code
2. Read the pattern's knowledge file (`design-patterns/<pattern-name>.md`)
3. Read `design-patterns/scoring/dpvia-conformance.md`
4. **Pre-implementation check:** Apply Mode A (recommendation scoring)
   - If score <= 50%, warn the user and explain why before proceeding
5. Refactor the code to apply the pattern, preserving existing behavior
6. **Post-implementation check:** Apply Mode B (conformance scoring)
   - Target: 90%+ conformance
   - If below 90%, identify missing structural elements and fix
7. Explain what changed and why, including the conformance score

## Examples

The `examples/` directory contains 9 mini-apps covering 8 GoF patterns for testing. Each has `src/` and `README.md`. Answer key at `examples/answer.md`.
