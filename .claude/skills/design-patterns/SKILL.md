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

- **Pattern files:** `<pattern-name>.md` -- one per GoF pattern (22 total), each with 5 sections: applicability, premature use, code smell triggers, anti-pattern warnings, structural characteristics
- **Decision tree:** `decision-tree.md` -- maps code smells to candidate patterns with disambiguation guidance
- **Scoring framework:** `scoring/dpvia-conformance.md` -- DPVIA-adapted conformance scoring with Mode A (recommendation) and Mode B (conformance)
- **Repo path mapping:** `repo-map.md` -- maps pattern names to example code paths within each language's RefactoringGuru repo

## Language-Specific Examples

When you need a concrete code example of a pattern, look for it in `repos/<lang>/`. Use `repo-map.md` to find the path from a pattern name to the example files.

If the repo for the language you need is not there, fetch it:

```
python3 .claude/skills/design-patterns/fetch_repo.py <language>
```

This clones the matching RefactoringGuru repo into `repos/<lang>/`. The language argument is one of: typescript, python, java, cpp, php, csharp, swift, dart, ruby, go, kotlin, rust, delphi. For JavaScript codebases, use `typescript` (closest available).

If the fetch fails, proceed without the example. Never block analysis on a failed fetch.

## Commands

### review <file-or-directory>

Scan code for structural issues and recommend or validate design patterns.

1. Read the target files
2. Scan for structural hallmarks of known patterns (e.g., clone methods, subscriber lists, delegation to composed objects)
3. **If a pattern is already present:**
   - Read the pattern's knowledge file (`<pattern>.md`)
   - Read `scoring/dpvia-conformance.md`
   - Apply Mode B (conformance scoring) using Section 5 structural characteristics
   - Apply Phase 3 (code context verification) for any violations
   - Look up the language-specific example (see Language-Specific Examples) and compare against the canonical implementation
   - Report: pattern name, conformance percentage, verdict, any violations or intentional deviations
4. **If no pattern is found:**
   - Read `decision-tree.md`
   - Identify code smells and match to candidate patterns using the decision tree
   - For each candidate, read its knowledge file and apply Mode A (recommendation scoring)
   - Report: the smell, its location, the recommended pattern (highest scoring), score, and rationale
   - Do not recommend patterns scoring 25% or below

### evaluate <pattern-name>

Assess whether a specific pattern fits the current code.

1. Read the target code
2. Read the pattern's knowledge file (`<pattern-name>.md`)
3. Read `scoring/dpvia-conformance.md`
4. **If the code already implements the pattern:**
   - Apply Mode B (conformance scoring) against Section 5 structural characteristics
   - Apply Phase 3 (code context verification) for any violations
   - Look up the language-specific example (see Language-Specific Examples) and compare against the canonical implementation
   - Verdict with percentage: **correctly applied** (90-100%), **deformed** (60-89%), or **wrong pattern** (below 60%)
   - If wrong pattern, use decision tree to suggest an alternative
5. **If the code does not implement the pattern:**
   - Apply Mode A (recommendation scoring) using Sections 1, 2, 3, 4
   - Verdict: **good fit** (100%), **good fit with concern** (75%), **weak fit** (50%), or **poor fit** (25% or below)
   - Check Section 2 (premature use) -- if conditions apply, note as **premature**

### implement <pattern-name>

Apply a specific design pattern to existing code.

1. Read the target code
2. Read the pattern's knowledge file (`<pattern-name>.md`)
3. Read `scoring/dpvia-conformance.md`
4. Look up the language-specific example (see Language-Specific Examples) and use it as a concrete reference for idiomatic structure
5. **Pre-implementation check:** Apply Mode A (recommendation scoring)
   - If score <= 50%, warn the user and explain why before proceeding
6. Refactor the code to apply the pattern, preserving existing behavior. Follow the structure from the language-specific example where applicable.
7. **Post-implementation check:** Apply Mode B (conformance scoring)
   - Target: 90%+ conformance
   - If below 90%, identify missing structural elements and fix
8. Explain what changed and why, including the conformance score

### advise <context>

Quickly surface 1–3 pattern recommendations without full DPVIA analysis. Designed for sub-agent use.

`<context>` is either a file path or a prose description of the problem being designed.

1. Determine input mode:
   - If `<context>` is a valid file path, read the file (**file mode**)
   - Otherwise, treat as a prose description (**prose mode**)
2. Read `decision-tree.md`
3. Identify up to 5 candidate patterns from the decision tree:
   - **File mode:** scan for structural hallmarks matching Section 3 (code smell triggers) in each pattern file
   - **Prose mode:** match stated intent against Section 1 (applicability) in each pattern file
4. For each candidate, read its knowledge file and apply partial Mode A scoring:
   - **File mode:** evaluate all 4 criteria (Sections 1–4)
   - **Prose mode:** evaluate Sections 1 & 2 only; compute score over available criteria
5. Keep top 1–3 candidates scoring above 25%
6. **If recommendations found:** emit Pattern Radar (name, score, one-line rationale per entry), then suggest `design-patterns evaluate <pattern-name>` for full scoring
7. **If no candidates above 25%:** emit "No strong pattern matches found."

Do NOT: fetch language repos, run Mode B conformance scoring, apply Phase 3 verification, or read all 22 pattern files.

Output format:
```
Pattern Radar:
• <PatternName> (Mode A: <score>%) — <one-line rationale>
• <PatternName> (Mode A: <score>%) — <one-line rationale>

For full scoring: `design-patterns evaluate <pattern-name> <file>`
```

## Examples

The `examples/` directory contains 9 mini-apps covering 8 GoF patterns for testing. Each has `src/` and `README.md`. Answer key at `examples/answer.md`.
