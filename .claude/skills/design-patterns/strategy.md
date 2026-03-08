# Strategy

## 1. Applicability
- Multiple algorithms or behaviors need to be interchangeable at runtime
- A class has a growing conditional that selects between different logic paths
- You want to isolate algorithm implementation details from the code that uses them
- Several related classes differ only in how they perform a specific behavior
- An algorithm uses data or logic the client should not be exposed to

## 2. Premature Use
- Only two algorithms that are unlikely to grow — a simple conditional is clearer
- The conditional logic is simple and contained in one place with no duplication
- No runtime switching is needed and the behavior is fixed at compile time
- The varying behavior is a few lines of code, not a meaningful algorithm

## 3. Code Smell Triggers
- Growing if/else or switch chain selecting between algorithm variants
- Duplicated logic across branches with only the core operation differing
- New "types" or "modes" require editing the same method repeatedly
- Parameter flags (booleans, enums) controlling which algorithm path to follow
- Parallel class hierarchies where subclasses differ only in one behavior

## 4. Anti-Pattern Warnings
- Strategy interface with only one implementation (premature abstraction with no real variation)
- Context class that directly references or instantiates concrete strategies (defeats decoupling)
- Strategies that depend on context internals (tight coupling through back-references or shared state)
- Overly granular strategies that fragment simple logic across many tiny classes
- Strategy interface bloated with methods only some implementations need (violates Interface Segregation)

## 5. Structural Characteristics

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
