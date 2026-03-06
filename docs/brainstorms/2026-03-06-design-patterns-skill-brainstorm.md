# Brainstorm: Design Patterns Skill Enhancement

**Date:** 2026-03-06
**Status:** Draft
**Depends on:** Nothing (this is the first phase)

## Goal

Enhance the existing skill at `.claude/skills/design-patterns.md` with structured pattern knowledge so it can systematically:

1. **Evaluate** whether a design pattern is appropriate for a given codebase
2. **Detect** code smells that indicate a pattern is needed
3. **Warn** when a pattern is being misused or applied prematurely
4. **Recommend** the right pattern by mapping problems to solutions

## Architecture

### Pattern Knowledge Files (22 files)

One markdown file per GoF pattern in `.claude/skills/design-patterns/`, each following a six-section template focused on **decision-making** (not implementation):

1. **Applicability** — When to use this pattern (problem indicators, use cases)
2. **Pros/Cons** — Trade-offs of applying the pattern
3. **Relationships** — Related patterns, common combinations, patterns it's confused with
4. **Premature Use** — When applying this pattern is over-engineering
5. **Code Smell Triggers** — Specific smells that signal this pattern might help
6. **Anti-Pattern Warnings** — What misuse looks like, common mistakes

**Why language-agnostic:** Pattern descriptions use universal terms so the skill works across any codebase. Language-specific examples come from a separate phase (see refactoring-guru-repos brainstorm).

**Why decision-making only:** No structural diagrams or implementation steps. Claude already knows how to implement patterns. What it needs is the judgment layer — when to use them, when not to, and what misuse looks like.

### Decision Tree (1 file)

A separate `decision-tree.md` maps code smells directly to candidate patterns with disambiguation guidance. This keeps the main skill file concise while providing systematic routing from problem to solution.

### Main Skill File Updates

When this brainstorm is implemented, update `.claude/skills/design-patterns.md` to:

- Reference the decision tree in the `review` command (e.g., "Read `design-patterns/decision-tree.md` to map smells to candidates")
- Reference individual pattern files in `evaluate` and `implement` commands (e.g., "Read `design-patterns/<pattern>.md` for evaluation criteria")
- Remove the inline smell→pattern mapping from `review` (it moves to the decision tree)

## File Structure

```
.claude/skills/
  design-patterns.md                    # Main skill file (commands + references)
  design-patterns/
    decision-tree.md                    # Code smell → candidate patterns mapping
    factory-method.md                   # Pattern knowledge files (22 total)
    abstract-factory.md
    builder.md
    prototype.md
    singleton.md
    adapter.md
    bridge.md
    composite.md
    decorator.md
    facade.md
    flyweight.md
    proxy.md
    chain-of-responsibility.md
    command.md
    iterator.md
    mediator.md
    memento.md
    observer.md
    state.md
    strategy.md
    template-method.md
    visitor.md
```

## Pattern Catalog

### Creational (5)
- Factory Method
- Abstract Factory
- Builder
- Prototype
- Singleton

### Structural (7)
- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Flyweight
- Proxy

### Behavioral (10)
- Chain of Responsibility
- Command
- Iterator
- Mediator
- Memento
- Observer
- State
- Strategy
- Template Method
- Visitor

## Template Example: Strategy

Filled-in example showing what a completed pattern knowledge file looks like:

### Applicability

- Multiple algorithms or behaviors need to be interchangeable at runtime
- A class has a growing conditional (switch/if-else) that selects between different logic paths
- You want to isolate algorithm implementation details from the code that uses them

### Pros/Cons

**Pros:** Open/closed principle — add new strategies without modifying context; eliminates conditional logic; strategies are independently testable

**Cons:** Clients must be aware of different strategies; overkill if only 2–3 strategies that rarely change; additional classes and interfaces

### Relationships

- **Often confused with:** State (both wrap behavior behind an interface, but State transitions internally while Strategy is set externally)
- **Combines well with:** Factory Method (to create strategies), Template Method (strategies can use template method internally)
- **Alternative to:** Command (when the "strategy" is a one-shot operation)

### Premature Use

- Only 2 algorithms that are unlikely to grow
- The conditional logic is simple and contained in one place
- No runtime switching needed — the choice is fixed at compile/deploy time

### Code Smell Triggers

- Growing `if/else if` or `switch` chain selecting between algorithm variants
- Duplicated logic across branches with only the core operation differing
- New "types" or "modes" require editing the same method

### Anti-Pattern Warnings

- Strategy interface with only one implementation (premature abstraction)
- Context class that "knows" about concrete strategies (defeats the purpose)
- Strategies that depend on context internals (tight coupling through back-references)

## Decision Tree Format Example

Each entry maps a specific code smell to candidate patterns with disambiguation guidance:

```markdown
## Growing Conditional Logic

**Smell:** Expanding `switch`/`if-else` chain selecting between behaviors

**Candidates:**
- **Strategy** — branches represent interchangeable algorithms selected at runtime
- **State** — branches represent state-dependent behavior and transitions between states
- **Command** — branches represent discrete operations that could be queued, logged, or undone

## Tight Coupling to Multiple Dependents

**Smell:** A class directly calls methods on several other classes that react to its changes

**Candidates:**
- **Observer** — dependents need notification of state changes
- **Mediator** — multiple objects interact in complex ways; centralize coordination
```

## Implementation Order

1. Create the `.claude/skills/design-patterns/` directory
2. Write the decision tree (`decision-tree.md`) — defines the smell→pattern routing used by the `review` command
3. Write the 22 pattern knowledge files using the six-section template. Prioritize patterns covered by the existing examples first: Observer, Strategy, Factory Method, Builder, Adapter, Bridge, Prototype, Facade, Abstract Factory
4. Update the main skill file to reference pattern files and decision tree (see "Main Skill File Updates" above)
5. Test against the 9 example mini-apps using `examples/answer.md` as expected output

## Existing Test Suite

9 example apps covering 8 patterns with answer key at `examples/answer.md`:

- **Needs pattern:** order-notifications (Observer), payment-processing (Strategy), document-export (Factory Method), user-profile (Builder), weather-dashboard (Adapter)
- **Wrong pattern:** ui-theme-components (Abstract Factory), alert-dispatch (Bridge)
- **Correct pattern:** shape-editor (Prototype), home-automation (Facade)

## Key Decisions

1. **Enhance existing skill** — Build on the three commands (review, implement, evaluate), don't replace
2. **Language-agnostic** — Pattern knowledge in universal terms; language-specific examples from external repos (separate brainstorm)
3. **Flat directory** — All pattern files in one directory, no subdirectories
4. **Decision tree separate from patterns** — Keeps routing logic centralized and the main skill file concise
5. **Decision-making focus only** — No structural diagrams or implementation steps in pattern files
6. **Source material** — Use refactoring.guru as the primary source for pattern knowledge, adapted into the six-section template
