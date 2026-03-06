# Strategy

## 1. Applicability
- Multiple algorithms or behaviors need to be interchangeable at runtime
- A class has a growing conditional that selects between different logic paths
- You want to isolate algorithm implementation details from the code that uses them
- Several related classes differ only in how they perform a specific behavior
- An algorithm uses data or logic the client should not be exposed to

## 2. Pros/Cons
**Pros:**
- Swaps algorithms at runtime without modifying the context
- Isolates algorithm implementation details behind a stable interface
- Replaces inheritance-based behavior variation with composition
- Open/Closed Principle: new strategies added without changing existing code
- Each strategy is independently testable

**Cons:**
- Clients must be aware of different strategies to select the right one
- Adds extra classes and interfaces for each algorithm variant
- Functional languages can achieve the same effect with simple lambdas, making the full pattern heavyweight

## 3. Relationships
- **Often confused with:** State (both wrap behavior behind an interface, but State transitions internally while Strategy is set externally by the client)
- **Often confused with:** Template Method (both vary an algorithm, but Template Method uses inheritance with a fixed skeleton while Strategy uses composition with fully replaceable algorithms)
- **Combines well with:** Factory Method (to encapsulate strategy creation and hide concrete strategy selection from the client)
- **Combines well with:** Composite (strategies can operate over composite structures uniformly)
- **Alternative to:** Command (when the "strategy" is a one-shot operation rather than an ongoing behavioral policy)
- **Alternative to:** Template Method (when you prefer composition over inheritance for varying behavior)

## 4. Premature Use
- Only two algorithms that are unlikely to grow — a simple conditional is clearer
- The conditional logic is simple and contained in one place with no duplication
- No runtime switching is needed and the behavior is fixed at compile time
- The varying behavior is a few lines of code, not a meaningful algorithm

## 5. Code Smell Triggers
- Growing if/else or switch chain selecting between algorithm variants
- Duplicated logic across branches with only the core operation differing
- New "types" or "modes" require editing the same method repeatedly
- Parameter flags (booleans, enums) controlling which algorithm path to follow
- Parallel class hierarchies where subclasses differ only in one behavior

## 6. Anti-Pattern Warnings
- Strategy interface with only one implementation (premature abstraction with no real variation)
- Context class that directly references or instantiates concrete strategies (defeats decoupling)
- Strategies that depend on context internals (tight coupling through back-references or shared state)
- Overly granular strategies that fragment simple logic across many tiny classes
- Strategy interface bloated with methods only some implementations need (violates Interface Segregation)

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Strategy | Declares the interface common to all algorithm variants | Yes |
| ConcreteStrategy | Implements a specific algorithm behind the Strategy interface | Yes |
| Context | Maintains a reference to a Strategy and delegates algorithmic work to it | Yes |
| Client | Creates a ConcreteStrategy and configures the Context with it | No |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Context | Strategy | Delegates to (composition) | Yes |
| ConcreteStrategy | Strategy | Implements | Yes |
| Client | Context | Configures with a strategy | No |
| Client | ConcreteStrategy | Instantiates | No |
