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
- **Repo path mapping:** `design-patterns/repo-map.md` -- maps pattern names to example code paths within each language's RefactoringGuru repo

## Language-Specific Examples

RefactoringGuru repos provide concrete, idiomatic code examples for each pattern in 13 languages. These are cloned on first use and stored at `design-patterns/repos/<lang>/`.

### Setup (runs once per language, at the start of any command)

1. **Determine the language.** Scan the target path for source files and identify the primary language by file extension count.
   - **Ignore** non-source extensions: `.json`, `.yaml`, `.yml`, `.toml`, `.xml`, `.md`, `.txt`, `.lock`, `.sum`, `.mod`
   - **Extension mapping:** `.ts`/`.tsx` -> typescript, `.py` -> python, `.java` -> java, `.cpp`/`.cc`/`.cxx`/`.hpp` -> cpp, `.php` -> php, `.cs` -> csharp, `.swift` -> swift, `.dart` -> dart, `.rb` -> ruby, `.go` -> go, `.kt`/`.kts` -> kotlin, `.rs` -> rust, `.pas`/`.dpr` -> delphi
   - **JavaScript:** `.js`/`.jsx`/`.mjs`/`.cjs` -> use the TypeScript repo (closest available). Note in output that examples are in TypeScript.
   - **`.h` files:** Check for companion `.cpp`/`.c` files. Default to C++ if no companions found.
   - **Single-file targets:** Scan the file's parent directory.
   - **Multi-language projects:** If multiple languages each have >10% of source files AND at least 5 files, fetch repos for all of them.
2. **Fetch the repo.** Run `python3 design-patterns/fetch_repo.py <language>` from the skill directory. This clones the RefactoringGuru repo into `design-patterns/repos/<lang>/`. If it already exists, the script skips the clone.
3. **If the fetch fails** (network error, unsupported language, timeout), proceed without language-specific examples. Never block analysis on a failed fetch.

### Using the examples

After fetching, read `design-patterns/repo-map.md` to find the path from a pattern name to its example code in `repos/<lang>/`. Read the example files and use them as concrete reference material when analyzing, recommending, or implementing patterns.

## Commands

### review <file-or-directory>

Scan code for structural issues and recommend or validate design patterns.

1. Read the target files
2. **Fetch language-specific examples** (see Language-Specific Examples above)
3. Scan for structural hallmarks of known patterns (e.g., clone methods, subscriber lists, delegation to composed objects)
4. **If a pattern is already present:**
   - Read the pattern's knowledge file (`design-patterns/<pattern>.md`)
   - Read `design-patterns/scoring/dpvia-conformance.md`
   - Apply Mode B (conformance scoring) using Section 7 structural characteristics
   - Apply Phase 3 (code context verification) for any violations
   - If language-specific examples are available, compare the user's implementation against the canonical example
   - Report: pattern name, conformance percentage, verdict, any violations or intentional deviations
   - Include: "See `design-patterns/repos/<lang>/<path>/` for a <Language> reference implementation."
5. **If no pattern is found:**
   - Read `design-patterns/decision-tree.md`
   - Identify code smells and match to candidate patterns using the decision tree
   - For each candidate, read its knowledge file and apply Mode A (recommendation scoring)
   - Report: the smell, its location, the recommended pattern (highest scoring), score, and rationale
   - If language-specific examples are available, reference them in the recommendation
   - Do not recommend patterns scoring 25% or below

### evaluate <pattern-name>

Assess whether a specific pattern fits the current code.

1. Read the target code
2. **Fetch language-specific examples** (see Language-Specific Examples above)
3. Read the pattern's knowledge file (`design-patterns/<pattern-name>.md`)
4. Read `design-patterns/scoring/dpvia-conformance.md`
5. **If the code already implements the pattern:**
   - Apply Mode B (conformance scoring) against Section 7 structural characteristics
   - Apply Phase 3 (code context verification) for any violations
   - If language-specific examples are available, compare the user's implementation against the canonical example
   - Verdict with percentage: **correctly applied** (90-100%), **deformed** (60-89%), or **wrong pattern** (below 60%)
   - If wrong pattern, use decision tree to suggest an alternative
6. **If the code does not implement the pattern:**
   - Apply Mode A (recommendation scoring) using Sections 1, 4, 5, 6
   - Verdict: **good fit** (100%), **good fit with concern** (75%), **weak fit** (50%), or **poor fit** (25% or below)
   - Check Section 4 (premature use) -- if conditions apply, note as **premature**

### implement <pattern-name>

Apply a specific design pattern to existing code.

1. Read the target code
2. **Fetch language-specific examples** (see Language-Specific Examples above)
3. Read the pattern's knowledge file (`design-patterns/<pattern-name>.md`)
4. Read `design-patterns/scoring/dpvia-conformance.md`
5. If language-specific examples are available, read the example files from the repo (use `design-patterns/repo-map.md` for path lookup). Use these as a concrete reference for idiomatic structure.
6. **Pre-implementation check:** Apply Mode A (recommendation scoring)
   - If score <= 50%, warn the user and explain why before proceeding
7. Refactor the code to apply the pattern, preserving existing behavior. Follow the structure from the language-specific example where applicable.
8. **Post-implementation check:** Apply Mode B (conformance scoring)
   - Target: 90%+ conformance
   - If below 90%, identify missing structural elements and fix
9. Explain what changed and why, including the conformance score

## Examples

The `examples/` directory contains 9 mini-apps covering 8 GoF patterns for testing. Each has `src/` and `README.md`. Answer key at `examples/answer.md`.
