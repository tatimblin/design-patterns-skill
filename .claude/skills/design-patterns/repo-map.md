# Repo Path Mapping

How to navigate from a pattern knowledge file (`design-patterns/<pattern>.md`) to the corresponding example code in a cloned RefactoringGuru repo (`repos/<lang>/`).

## Pattern Name Conversions

The knowledge files use **kebab-case** (e.g., `factory-method.md`). Each repo uses a different naming convention for its pattern directories:

| Convention | Conversion from kebab-case | Languages |
|------------|---------------------------|-----------|
| PascalCase | `factory-method` -> `FactoryMethod` | TypeScript, Python, C++, PHP, Swift, C#, Delphi (with category prefix) |
| snake_case | `factory-method` -> `factory_method` | Java, Kotlin, Ruby, Dart |
| camelCase | `factory-method` -> `factoryMethod` | Go |
| kebab-case | `factory-method` -> `factory-method` | Rust |

## Path Templates

Given a pattern kebab-case name (e.g., `strategy`) and the repo root at `repos/<lang>/`, use these templates to find the example code:

| Language | Path template | Example for `strategy` |
|----------|--------------|------------------------|
| **TypeScript** | `repos/typescript/src/<PascalCase>/Conceptual/` | `repos/typescript/src/Strategy/Conceptual/` |
| **Python** | `repos/python/src/<PascalCase>/Conceptual/` | `repos/python/src/Strategy/Conceptual/` |
| **C++** | `repos/cpp/src/<PascalCase>/Conceptual/` | `repos/cpp/src/Strategy/Conceptual/` |
| **PHP** | `repos/php/src/RefactoringGuru/<PascalCase>/Conceptual/` | `repos/php/src/RefactoringGuru/Strategy/Conceptual/` |
| **Swift** | `repos/swift/Sources/<PascalCase>/Conceptual/` | `repos/swift/Sources/Strategy/Conceptual/` |
| **Java** | `repos/java/src/refactoring_guru/<snake_case>/example/` | `repos/java/src/refactoring_guru/strategy/example/` |
| **Kotlin** | `repos/kotlin/src/main/kotlin/refactoring_guru/<snake_case>/example/` | `repos/kotlin/src/main/kotlin/refactoring_guru/strategy/example/` |
| **Ruby** | `repos/ruby/src/<snake_case>/conceptual/` | `repos/ruby/src/strategy/conceptual/` |
| **Go** | `repos/go/<camelCase>/` | `repos/go/strategy/` |
| **C#** | `repos/csharp/<PascalCase>.Conceptual/` | `repos/csharp/Strategy.Conceptual/` |
| **Rust** | `repos/rust/<category>/<kebab-case>/` | `repos/rust/behavioral/strategy/` |
| **Dart** | `repos/dart/patterns/<snake_case>/` | `repos/dart/patterns/strategy/` |
| **Delphi** | `repos/delphi/<Category>.<PascalCase>/` | `repos/delphi/Behavoral.Strategy/` |

## Rust and Delphi Category Prefixes

Both Rust and Delphi organize patterns by GoF category (Creational, Structural, Behavioral). Use the pattern's standard GoF classification as the category subdirectory/prefix.

- **Rust:** `behavioral/strategy/`, `creational/builder/`, `structural/adapter/`
- **Delphi:** `Behavioral.Strategy/`, `Creational.AbstractFactory/`, `Structural.Adapter/` (note: the repo misspells "Behavioral" as "Behavoral" for Strategy)

## Fallback

If the expected path does not exist, list the repo root directory to discover the actual layout. Repo structures may evolve over time.
