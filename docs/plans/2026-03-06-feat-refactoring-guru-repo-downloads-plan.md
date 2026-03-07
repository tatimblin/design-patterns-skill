---
title: "feat: Local RefactoringGuru Repo Downloads"
type: feat
status: active
date: 2026-03-06
origin: docs/brainstorms/2026-03-06-refactoring-guru-repos-brainstorm.md
---

# Local RefactoringGuru Repo Downloads

## Overview

Add language-specific code examples to the design patterns skill by pulling RefactoringGuru repos into the project as git subtrees. When any skill command is invoked, it detects the primary language of the user's codebase, ensures the matching repo is available locally, and uses it as read-only reference material for concrete, language-specific pattern implementations.

## Problem Statement / Motivation

The pattern knowledge files (from the companion plan) are deliberately language-agnostic -- they describe *when* to use a pattern, not *how* in a specific language. But when the skill recommends or implements a pattern, users benefit from seeing idiomatic examples in their own language.

Without language-specific examples, the skill relies entirely on Claude's training data for implementation details. By pulling the RefactoringGuru repos locally:

- Examples are always available (no web fetches during analysis)
- Examples are authoritative and consistent (curated by RefactoringGuru)
- The skill works offline after first use
- Zero configuration -- language is auto-detected

## Proposed Solution

### Language Detection

Scan the target path for source file extensions and count occurrences:

- **Primary language** = extension with highest file count (excluding non-source files)
- **Ignore extensions:** `.json`, `.yaml`, `.yml`, `.toml`, `.xml`, `.md`, `.txt`, `.lock`, `.sum`, `.mod`
- **Scope:** Detect from the target path (relative to the project root). For single-file targets, scan the file's parent directory. For directory targets, scan that directory recursively.
- **Multi-language projects:** Download repos for all languages with significant presence (>10% of source files AND at least 5 files)
- **Ambiguous `.h` files:** Check for companion `.cpp`/`.c` files. Default to C++ if no companions found.
- **JavaScript handling:** Map `.js`, `.jsx`, `.mjs`, `.cjs` to the TypeScript repo (closest available). Note in output that examples are in TypeScript.

### Git Clone (changed from subtree)

On first use for each language, clone the RefactoringGuru repo:

```bash
git clone --depth 1 https://github.com/RefactoringGuru/design-patterns-<lang>.git \
  .claude/skills/design-patterns/repos/<lang>
```

**Decision change:** The brainstorm specified `git clone` and this plan originally upgraded to `git subtree`. During implementation, `git clone --depth 1` was chosen instead because:
- Clone does not create commits in the user's repo (subtree requires a clean working tree and creates a merge commit)
- Clone is simpler -- no special git state to reason about
- The repos are gitignored and read-only reference material, so tracking them in project history adds no value
- `--depth 1` keeps disk usage minimal (equivalent to subtree's `--squash`)

**Timeout:** 30 seconds. If the clone exceeds this, kill the process, clean up the partial directory, and fall back gracefully.

**Existence check:** Before cloning, check if `.claude/skills/design-patterns/repos/<lang>/` already exists as a directory with files. If it does, skip the clone.

**Precondition:** Verify `git` is available (`which git`). If missing, skip and proceed with language-agnostic analysis.

### Supported Languages (13 repos)

| Repo Name | Language | Extensions |
|-----------|----------|------------|
| `design-patterns-typescript` | TypeScript | `.ts`, `.tsx` |
| `design-patterns-python` | Python | `.py` |
| `design-patterns-java` | Java | `.java` |
| `design-patterns-cpp` | C++ | `.cpp`, `.cc`, `.cxx`, `.h`, `.hpp` |
| `design-patterns-php` | PHP | `.php` |
| `design-patterns-csharp` | C# | `.cs` |
| `design-patterns-swift` | Swift | `.swift` |
| `design-patterns-dart` | Dart | `.dart` |
| `design-patterns-ruby` | Ruby | `.rb` |
| `design-patterns-go` | Go | `.go` |
| `design-patterns-kotlin` | Kotlin | `.kt`, `.kts` |
| `design-patterns-rust` | Rust | `.rs` |
| `design-patterns-delphi` | Delphi | `.pas`, `.dpr` |

**JavaScript fallback:** `.js`/`.jsx`/`.mjs`/`.cjs` -> TypeScript repo.

### Repo Navigation

The skill needs to locate pattern examples within the subtree directories. **This must be verified empirically before writing any skill logic** (see Implementation Order step 1).

Expected structure (based on RefactoringGuru conventions): each repo organizes patterns into directories by pattern name. The implementation step will document the actual layout and produce a mapping from pattern kebab-case names (e.g., `factory-method`) to the directory paths within each repo (e.g., `src/FactoryMethod/`).

If structure varies by language, the skill file will include a per-language path mapping table.

### Output Format

When language-specific examples are available, the skill references them as follows:

- **`review` command:** After recommending a pattern, include "See `.claude/skills/design-patterns/repos/<lang>/src/<PatternName>/` for a <Language> reference implementation."
- **`implement` command:** Read the relevant example files from the subtree and use them as reference when refactoring the user's code. Quote key structural elements (interfaces, class signatures) in the output.
- **`evaluate` command:** Reference the example to compare the user's implementation against the canonical structure.

The skill reads files from the subtree using normal `Read` operations -- the files are part of the working tree like any other file.

### All Three Commands Trigger Detection

Language detection and subtree addition apply to all three commands (`review`, `implement`, `evaluate`), not just `review`. This ensures language-specific examples are available regardless of which command the user invokes first.

### Git History Consideration

Since `git clone` is used instead of `git subtree`, no commits are created in the user's repo. The cloned repos are gitignored and do not affect the project's git history.

## Technical Considerations

- **Disk usage:** Each subtree adds ~1-5 MB of tracked files. A multi-language monorepo triggering 5 subtrees uses ~25 MB. Acceptable.
- **Git history:** Each subtree add creates one squashed commit. This is a one-time cost per language.
- **Network dependency:** Only on first use per language. After that, fully offline.
- **Read-only enforcement:** Instructional only (in the skill markdown). The skill never writes to `repos/`.
- **GitHub rate limiting:** Public repos can be fetched without auth, but rate limits apply. The "subtree add fails" fallback handles this transparently.

## Acceptance Criteria

### Language Detection
- [ ] Correctly identifies the primary language from a directory of source files
- [ ] Ignores non-source extensions (`.json`, `.yaml`, `.md`, etc.)
- [ ] Handles single-file targets by scanning the parent directory
- [ ] Multi-language threshold: >10% AND at least 5 files
- [ ] `.js`/`.jsx`/`.mjs`/`.cjs` maps to TypeScript repo
- [ ] `.h` disambiguation works (checks for `.cpp`/`.c` companions, defaults to C++)

### Repo Subtree Addition
- [ ] `git subtree add --squash` on first use for each detected language
- [ ] 30-second timeout on subtree operations
- [ ] Existence check skips subtree add when directory already has files
- [ ] Verifies `git` availability before attempting subtree add
- [ ] Subtree prefix: `.claude/skills/design-patterns/repos/<lang>`

### Graceful Degradation
- [ ] Network failure -> proceeds with language-agnostic analysis, no blocking
- [ ] Unsupported language -> proceeds without repo, clear message
- [ ] Missing `git` -> proceeds without repo, clear message
- [ ] Permission error -> proceeds without repo, no crash

### Integration
- [ ] All three commands (`review`, `implement`, `evaluate`) trigger language detection
- [ ] Pattern examples from subtree repos are referenced in skill output when available
- [ ] Output format matches the per-command specification above
- [ ] Repos are never written to by the skill

### Testing
- [ ] End-to-end test with the TypeScript example mini-apps: detection identifies TypeScript, subtree added successfully, pattern examples are referenced in output

## Success Metrics

- Language detection correctly identifies TypeScript for the existing 9 example mini-apps
- First invocation adds the subtree; subsequent invocations skip it
- Skill output includes language-specific references from the subtree
- All failure modes degrade gracefully without blocking analysis

## Dependencies & Risks

- **Hard dependency:** Pattern Knowledge Files plan must be complete first (the pattern knowledge files are what the repos supplement)
- **Dependency on RefactoringGuru repos:** If repos are moved, renamed, or deleted, subtree add fails. Mitigation: graceful degradation means the skill still works, just without language-specific examples.
- **Risk: Repo internal structure varies by language.** Different language repos may organize patterns differently. Mitigation: step 1 of implementation verifies structure for 3 repos before any skill logic is written; mapping logic added if needed.
- **Risk: GitHub availability.** Corporate firewalls or rate limits could block fetches. Mitigation: graceful fallback is already specified for all network failures.
- **Risk: Dirty working tree blocks subtree add.** `git subtree add` creates a commit, which requires a clean working tree. Mitigation: the skill should check for uncommitted changes before attempting a subtree add and warn the user if the tree is dirty.

## Implementation Order

1. ~~**Verify repo structure (research gate).**~~ DONE -- Cloned all 13 repos, documented layout in `repo-map.md`. Structure varies by language (PascalCase, snake_case, camelCase, kebab-case, category-prefixed).
2. ~~Add language detection logic to the main skill file~~ DONE -- Added to skill markdown as instructions for Claude
3. ~~Add clone-on-first-use logic with timeout and existence check~~ DONE -- `fetch_repo.py` with 30s timeout, existence check, error handling
4. ~~Add repo navigation logic (using the mapping from step 1)~~ DONE -- `repo-map.md` with per-language path templates
5. ~~Add per-command output format (references to repo files)~~ DONE -- All three commands updated
6. Test end-to-end with the TypeScript example mini-apps

## File Structure

```
.claude/skills/
  design-patterns.md                    # Main skill (updated with detection + subtree logic)
  design-patterns/
    decision-tree.md                    # From companion plan
    *.md                                # Pattern knowledge files (from companion plan)
    repos/                              # RefactoringGuru repos added as git subtrees
      typescript/                       # git subtree of design-patterns-typescript
      python/                           # git subtree of design-patterns-python
      ...                               # Only languages that have been used
```

## Sources & References

- **Origin brainstorm:** [docs/brainstorms/2026-03-06-refactoring-guru-repos-brainstorm.md](docs/brainstorms/2026-03-06-refactoring-guru-repos-brainstorm.md) -- Key decisions: auto-detect language, store in skill directory, read-only reference, graceful degradation. Note: brainstorm specified git clone; this plan upgrades to git subtree for cleaner integration.
- **Companion plan:** [docs/plans/2026-03-06-feat-pattern-knowledge-files-plan.md](docs/plans/2026-03-06-feat-pattern-knowledge-files-plan.md) -- must be implemented first
- RefactoringGuru GitHub: `https://github.com/RefactoringGuru/design-patterns-*`
