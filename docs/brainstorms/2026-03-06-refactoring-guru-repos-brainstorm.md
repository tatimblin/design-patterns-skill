# Brainstorm: Local RefactoringGuru Repo Downloads

**Date:** 2026-03-06
**Status:** Draft
**Depends on:** Design Patterns Skill Enhancement brainstorm (pattern knowledge files should exist first)

## Goal

Add language-specific code examples to the skill by auto-downloading RefactoringGuru repos from GitHub. When the skill is invoked, it detects the primary language of the user's codebase, ensures the matching repo is available locally, and uses it as read-only reference material for concrete, language-specific pattern implementations.

## Why This Approach

- **Local reference eliminates web dependency** — no `WebFetch` calls during analysis; faster and works offline
- **Language-specific examples** complement the language-agnostic pattern knowledge files
- **Auto-detection** means zero configuration — the skill works in any supported language
- **Lazy download** avoids fetching all 13 repos upfront; only downloads what's needed
- **Shallow clone** keeps disk usage minimal

## Available Repos

| Repo | Language | Extensions |
|------|----------|------------|
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

## File Structure

```
.claude/skills/
  design-patterns.md                    # Main skill (updated with repo download logic)
  design-patterns/
    decision-tree.md                    # Code smell → candidate patterns mapping
    factory-method.md                   # Pattern knowledge files (22 total)
    ...
    repos/                              # Downloaded RefactoringGuru repos (gitignored)
      typescript/                       # git clone --depth 1 of design-patterns-typescript
      python/                           # git clone --depth 1 of design-patterns-python
      ...                               # Only languages that have been used
```

## Skill Flow

1. User invokes `/design-patterns review <file-or-directory>`
2. Skill scans the target for file extensions to detect primary language
3. If the corresponding RefactoringGuru repo isn't in `repos/<lang>/`, clone it:
   `git clone --depth 1 https://github.com/RefactoringGuru/design-patterns-<lang>.git .claude/skills/design-patterns/repos/<lang>/`
4. Skill proceeds with analysis, reading pattern implementations from the local repo as needed
5. Recommendations include language-specific code examples drawn from the downloaded repo

## Language Detection Heuristics

Scan the target directory for source file extensions and count occurrences:

- **Primary language** = extension with the highest file count (excluding non-source files)
- **Ignore:** `.json`, `.yaml`, `.yml`, `.toml`, `.xml`, `.md`, `.txt`, `.lock`, `.sum`, `.mod`
- **Ambiguous extensions:** `.h` could be C or C++ — check for companion `.cpp`/`.c` files to disambiguate
- **Multi-language projects:** Download repos for all languages with significant presence (>10% of source files)
- **Scope:** Detect from the target path, not the entire repo. When analyzing `services/api/`, detect from that subtree.

## Error Handling

- **Clone fails (network error):** Proceed without language-specific examples. Fall back to language-agnostic pattern knowledge files. Do not block the analysis.
- **Repo doesn't exist for language:** Note that no RefactoringGuru repo is available for the detected language and proceed without it.
- **Unsupported language detected:** Proceed with pattern knowledge files only. The 13 repos cover the most common languages.
- **Permission errors:** If `repos/` can't be created or written to, proceed without local repos.

## Edge Cases

- **No source files in target:** Ask the user to specify the file or directory to analyze.
- **Only config/markup files:** Skip language detection; proceed with language-agnostic analysis.
- **Mixed frontend/backend (e.g., `.ts` + `.py`):** Download both repos. Use the repo matching the file currently being analyzed.
- **Monorepo with many languages:** Detect per-directory rather than whole-repo. When analyzing a subtree, detect from that subtree.

## Key Decisions

1. **Auto-detect language** — Scan for file extensions, no `--lang` flag needed
2. **Store in skill directory** — Clone into `.claude/skills/design-patterns/repos/<lang>/`
3. **Lazy download** — Only clone on first use for each language
4. **Shallow clone** — `git clone --depth 1` to minimize disk usage
5. **Read-only reference** — Never copy or scaffold code from repos into the user's project
6. **Gitignore repos** — Add `repos/` to `.gitignore`; each user downloads on first use
7. **No update mechanism** — One-time shallow clone is sufficient; repos rarely change
8. **Graceful degradation** — Every failure mode falls back to working without repos; never block analysis

## Implementation Order

1. Add `repos/` to `.gitignore` in the skill directory
2. Add language detection logic to the main skill file
3. Add clone-on-first-use logic to the main skill file
4. Update each command to reference the local repo when available
5. Test with the example mini-apps (TypeScript) to verify the flow end-to-end
