# Singleton

## 1. Applicability
- A class must have exactly one instance accessible to all clients (e.g., shared database connection, configuration registry)
- You need stricter control over global variables, with lazy initialization and thread-safe access
- A single coordination point is required for system-wide actions such as logging or caching
- The sole instance should be extensible by subclassing, allowing clients to use the extended instance without modifying their code

## 2. Premature Use
- Reaching for Singleton simply to avoid passing dependencies explicitly; prefer dependency injection instead
- Assuming "I only need one right now" is the same as "the system must enforce exactly one"; most cases do not require enforcement
- Using Singleton to share mutable state across modules when an event bus or mediator would decouple them better

## 3. Code Smell Triggers
- Multiple classes importing or referencing `getInstance()` (or equivalent) scattered throughout the codebase
- Tests that require specific setup/teardown ordering because of hidden shared state
- A Singleton accumulating unrelated responsibilities because it is the "easy place to put things"
- Difficulty running tests in parallel due to global Singleton state interference
- Circular dependency chains that route through the Singleton

## 4. Anti-Pattern Warnings
- **God Object:** Singleton becomes a dumping ground for unrelated concerns because it is universally accessible
- **Hidden Dependencies:** Classes that silently depend on a Singleton are harder to understand, reuse, and test
- **Immortal State:** Singleton instances typically live for the entire application, making cleanup, reset, and reconfiguration difficult
- **Concurrency Hazards:** Naive implementations introduce race conditions; even "safe" implementations add contention bottlenecks
- **Test Pollution:** Shared mutable Singleton state leaks across test cases, producing flaky and order-dependent test suites

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Singleton | Declares a static method that returns the same instance of itself; hides the constructor to prevent external instantiation | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Client | Singleton | Calls static access method to obtain the sole instance | Yes |
| Singleton | Singleton (instance) | Creates and caches its own unique instance | Yes |
