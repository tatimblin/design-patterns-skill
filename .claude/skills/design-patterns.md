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

## Commands

### review <file-or-directory>

Scan code for anti-patterns and recommend design pattern refactors.

1. Read the target files
2. Identify structural code smells:
   - Growing switch/if-else chains → Strategy, State, Command
   - Tight coupling between components → Observer, Mediator
   - Inheritance explosion (M × N subclasses) → Bridge
   - Telescoping constructors (many optional params) → Builder
   - Incompatible interfaces with inline conversion → Adapter
   - Duplicated object creation with conditional logic → Factory Method, Abstract Factory
   - Complex subsystem orchestration → Facade
3. For each finding, report: the smell, its location, the recommended pattern, and the rationale

### implement <pattern-name>

Apply a specific design pattern to existing code.

1. Read the target code
2. Verify the pattern is appropriate (check for the code smells it addresses)
3. Refactor the code to apply the pattern, preserving existing behavior
4. Explain what changed and why

### evaluate <pattern-name>

Assess whether a pattern fits the current problem.

1. Read the target code
2. Check applicability: does the code exhibit problems this pattern solves?
3. Check for premature use: is the codebase too simple to justify the pattern's complexity?
4. Verdict: **good fit**, **premature**, or **wrong pattern** — with rationale

## Examples

The `examples/` directory contains 9 mini-apps covering 8 GoF patterns for testing. Each has `src/` and `README.md`. Answer key at `examples/answer.md`.
