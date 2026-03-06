# Brainstorm: DPVIA-Based Scoring Framework

**Date:** 2026-03-06
**Status:** Draft
**Depends on:** Design Patterns Skill Enhancement brainstorm (pattern knowledge files)

## What We're Building

A scoring/assessment system for the design patterns skill that adapts the DPVIA conformance scoring framework (Abdelaziz et al., 2019 -- arXiv:1906.01419) to replace the current +1/0/-1 checklist. The system uses binary characteristic matching with Hamming distance to produce a percentage conformance score, backed by a 3-phase pipeline: detection, conformance scoring, and code context verification.

This replaces the current dual-mode scoring checklist in the plan at `docs/plans/2026-03-06-feat-pattern-knowledge-files-plan.md` (Section 3).

## Why This Approach

The DPVIA framework was validated against 5.6M lines of code across 15 open-source projects. Its methodology is:

- **Objective** -- binary present/absent checks, not subjective +1/0/-1 judgments
- **Proven** -- tested at scale with measurable precision and recall
- **Intuitive output** -- percentage conformance score (e.g., "85% conformance") is immediately understandable
- **Extensible** -- works for any pattern by defining characteristics, not pattern-specific heuristics

The current +1/0/-1 checklist has problems: criteria are subjective ("borderline" is undefined), the -5 to +5 scale is arbitrary, and there's no research backing the threshold choices (why is 3 "strong" and 2 "possible"?).

## The 3-Phase Framework

### Phase 1: Detection

Already handled by the existing skill. The `review` command scans for code smells using the decision tree and identifies candidate patterns. The `evaluate` command receives a user-specified pattern. The `implement` command receives a user-specified pattern to apply.

No changes needed here -- detection stays as-is.

### Phase 2: Conformance Scoring

For each candidate pattern, compare the code against the pattern's predefined characteristics using binary matching.

**Characteristic types (language-agnostic adaptation of DPVIA):**

DPVIA uses Java-specific concepts (Abstract class, Interface, Connection.inherits, etc.). We adapt to universal terms:

| DPVIA Concept | Our Adaptation |
|---------------|---------------|
| Abstraction Type (Normal, Abstract, Interface) | **Participant Roles** (e.g., "an abstraction defining the interface", "concrete implementations", "a context that delegates") |
| Connection Type (calls, creates, uses, has, references, inherits) | **Relationships** (e.g., "delegates to", "implements", "composes", "creates", "references") |
| Required / Optional classification | Same -- each characteristic is marked required or optional |

**Example -- Strategy pattern characteristics:**

```
Participant Roles:
  - Strategy (abstraction defining the interface)         [required]
  - ConcreteStrategy (implements the Strategy interface)  [required]
  - Context (uses a Strategy reference)                   [required]

Relationships:
  - ConcreteStrategy implements Strategy                  [required]
  - Context references Strategy (holds a reference)       [required]
  - Context delegates to Strategy (calls strategy method) [required]
  - Context creates ConcreteStrategy                      [optional]
```

**Scoring formula (Hamming distance, same as DPVIA):**

```
ConformanceScore = (1 - HammingDistance / N) * 100

Where:
  N = number of characteristics being compared
  HammingDistance = count of positions where expected != actual
  Expected vector: [1, 1, 1, 1, 1, 1, 0] (1 = characteristic in definition, 0 = not)
  Actual vector:   [1, 1, 0, 1, 1, 1, 0] (1 = present in code, 0 = absent)
```

**Score interpretation:**
- **90-100%:** Good fit / correctly applied
- **60-89%:** Deformed implementation -- pattern is present but has structural issues
- **Below 60%:** Wrong pattern / major violations -- too many required elements missing

**Required vs Optional handling (same as DPVIA):**
- Missing required characteristic = clear violation, counts against score
- Missing optional characteristic = not a violation, but reduces conformance percentage
- Present optional characteristic = increases conformance percentage

**Equal weighting:** All characteristics weighted equally. The DPVIA paper acknowledges this is a limitation but notes that expert-determined weights are a future concern. Equal weights keep our system simple and deterministic.

### Phase 3: Code Context Verification

DPVIA uses Stanford NLP on an IEEE SRS document to verify violations against business logic. We adapt this to use the code itself as the "business logic document."

**What we check:**
- **Class/function names** -- if a "missing" relationship is to a class whose name suggests it's intentionally decoupled (e.g., `LegacyAdapter` wrapping an old API), the violation may be intentional
- **Comments and docstrings** -- explicit notes like "deliberately not using X" or "simplified for this use case" indicate intentional deviation
- **Module structure** -- if pattern participants are in different packages/modules, some relationships may be architecturally justified to be absent
- **README / project docs** -- if available, check for documented design decisions

**Verification outcome:**
- If code context justifies the violation -> **downgrade from violation to "intentional deviation"**, do not count against conformance score
- If no justification found -> **confirmed violation**, counts against score
- Report both confirmed violations and intentional deviations separately in output

## How Each Command Uses the Framework

### `review <file-or-directory>`

1. **Detection:** Scan for code smells using decision tree. Also scan for structural hallmarks of known patterns.
2. **Conformance scoring:** For each candidate pattern, build the expected characteristic vector from the pattern file, build the actual vector from the code, compute Hamming distance.
3. **Verification:** For any violations found, check code context for justification.
4. **Output:** Report pattern name, conformance percentage, violations (if any), and recommendations.

### `evaluate <pattern-name>`

1. **Detection:** User specifies the pattern. Read the code.
2. **Conformance scoring:** Build vectors, compute score.
3. **Verification:** Check violations against code context.
4. **Output:** Verdict based on percentage -- "Good fit (95%)", "Deformed (72% -- missing required element X)", or "Wrong pattern (45% -- 3 of 6 required elements missing)".

### `implement <pattern-name>`

1. **Pre-implementation scoring:** Score the pattern against the current code to confirm it's appropriate.
2. **If score < 60%:** Warn user, explain why, ask for confirmation before proceeding.
3. **Refactor:** Apply the pattern.
4. **Post-implementation scoring:** Re-score the refactored code to verify the implementation is correct (target: 90%+).

## What Changes in the Pattern Knowledge Files

The current plan's 7-section template needs to be updated. The 7th section ("Required Structural Elements") becomes more structured:

**Current (vague):**
```
### Required Structural Elements
- Strategy interface
- Concrete strategy implementations
- Context class
```

**DPVIA-adapted (precise):**
```
### Structural Characteristics

#### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Strategy | Abstraction defining the common interface for all strategies | Yes |
| ConcreteStrategy | Implements a specific strategy using the Strategy interface | Yes |
| Context | Maintains a reference to a Strategy and delegates to it | Yes |

#### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| ConcreteStrategy | Strategy | implements | Yes |
| Context | Strategy | references | Yes |
| Context | Strategy | delegates to | Yes |
| Context | ConcreteStrategy | creates | No |
```

This structured format maps directly to the binary vectors used in Hamming distance scoring.

## Key Decisions

1. **Full DPVIA adaptation** -- Adopt all 3 phases (detection, conformance scoring, verification), not a partial hybrid
2. **Language-agnostic characteristics** -- Participant Roles + Relationships in universal terms, not Java-specific types
3. **Code context verification** -- Use the code itself (names, comments, structure) as the "business logic document" instead of SRS
4. **Equal weighting** -- All characteristics weighted equally, matching DPVIA's default
5. **Percentage output** -- Conformance score as 0-100%, thresholds at 90% (good) and 60% (wrong pattern)
6. **Replaces the +1/0/-1 checklist** -- The entire Section 3 of the plan gets rewritten around this framework
7. **Structured characteristics in pattern files** -- The 7th section uses tabular format (roles + relationships, each marked required/optional) to enable binary vector construction

## Resolved Questions

1. **Should the 60% and 90% thresholds be adjustable?** Decision: Hardcode 90%/60% for now. Adjust later if testing against the 9 example mini-apps reveals issues.
2. **How does the skill build the "actual" vector from code it can only read (not parse)?** Decision: Claude's inference is sufficient. The skill instructs Claude to read the code and check each characteristic for presence/absence. No language-specific heuristics needed -- Claude can determine structural relationships from reading source code.
