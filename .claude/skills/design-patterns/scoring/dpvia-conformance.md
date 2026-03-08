# DPVIA Conformance Scoring Framework

Adapted from Abdelaziz et al., "Identification and Assessment of Software Design Pattern Violations" (2019, arXiv:1906.01419). Uses binary characteristic matching with Hamming distance to produce percentage conformance scores.

## Mode A: Recommendation Scoring

Use when recommending a pattern for code that doesn't have one. For each candidate pattern, check 4 criteria from the pattern's knowledge file:

| # | Check | Source Section | Pass (1) | Fail (0) |
|---|-------|---------------|----------|----------|
| 1 | Code has smells from this pattern's triggers | Section 3: Code Smell Triggers | 1+ smells match | None match |
| 2 | Problem matches applicability | Section 1: Applicability | 1+ items match | No match |
| 3 | No premature use conditions apply | Section 2: Premature Use | None apply | 1+ apply |
| 4 | No anti-pattern warnings for proposed refactor | Section 4: Anti-Pattern Warnings | None match | 1+ match |

**Score:** `(passes / 4) * 100`

| Score | Meaning | Action |
|-------|---------|--------|
| 100% | Strong recommendation | Recommend with confidence |
| 75% | Good recommendation, one concern | Recommend, note the concern |
| 50% | Weak fit | Mention as alternative only |
| 25% or below | Poor fit | Do not recommend |

## Mode B: Conformance Scoring

Use when assessing code that already implements (or attempts to implement) a pattern. Compare against the pattern's Section 5 (Structural Characteristics) using Hamming distance.

### Procedure

1. Read the pattern's **Participant Roles** and **Relationships** tables from Section 5
2. Build the **expected vector**: 1 for each characteristic listed in the tables
3. Build the **actual vector**: scan the code and mark each characteristic as present (1) or absent (0)
4. Compute Hamming distance and conformance score

### Formula

```
ConformanceScore = (1 - HammingDistance / N) * 100

Where:
  N = total number of characteristics (roles + relationships)
  HammingDistance = count of characteristics where expected != actual
```

### Required vs Optional

- Missing **required** characteristic = violation, counts against score
- Missing **optional** characteristic = not a violation, reduces score
- Present **optional** characteristic = increases score

All characteristics weighted equally.

### Score Interpretation

| Score | Verdict | Meaning |
|-------|---------|---------|
| 90-100% | Correctly applied | Pattern is well-implemented |
| 60-89% | Deformed | Pattern is present but has structural issues |
| Below 60% | Wrong pattern / major violations | Too many required elements missing |

## Phase 3: Code Context Verification

Before reporting a conformance violation, check if it's intentional:

1. **Class/function names** -- naming that suggests deliberate decoupling or simplification
2. **Comments and docstrings** -- explicit notes like "deliberately not using X" or "simplified for this use case"
3. **Module structure** -- participants in different packages may justify absent relationships
4. **README / project docs** -- documented design decisions

**If justified:** Report as "intentional deviation" -- do not count against conformance score.
**If not justified:** Confirmed violation -- counts against score.

Report both confirmed violations and intentional deviations separately.

## Per-Command Usage

| Command | No pattern found in code | Pattern found in code |
|---------|------------------------|----------------------|
| `review` | Smell scan -> decision tree -> Mode A on candidates -> recommend highest | Detect structural hallmarks -> Mode B + verification -> report conformance |
| `evaluate` | Mode A on named pattern -> recommendation score | Mode B + verification -> conformance percentage + verdict |
| `implement` | Mode A pre-check (warn if <=50%) -> refactor -> Mode B post-check (target 90%+) | Mode B pre-check -> warn if <60% -> refactor -> Mode B post-check |
