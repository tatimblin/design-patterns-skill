# Prototype

## 1. Applicability
- When object creation is expensive (database calls, network requests, complex computation) and a similar object already exists
- When you need to create objects without coupling to their concrete classes, only knowing an interface
- When you want to reduce the number of subclasses that only differ in how they initialize their objects
- When the system should be independent of how its products are created, composed, and represented
- When object configurations are limited to a few combinations and cloning presets is simpler than manual construction

## 2. Premature Use
- When object construction is already cheap and straightforward -- cloning adds indirection for no benefit
- When the domain objects are simple value objects with no shared or nested references
- When the language or framework already provides lightweight construction (e.g., data classes, record types)
- When objects are rarely reused or duplicated during the application lifecycle

## 3. Code Smell Triggers
- Large blocks of setup code repeated across similar object instantiations
- Factory methods that differ only in field values assigned after construction
- Subclass explosion driven solely by preset configurations rather than behavioral differences
- Frequent serialization/deserialization used as a poor-man's cloning mechanism
- Client code tightly coupled to concrete classes solely for construction purposes

## 4. Anti-Pattern Warnings
- Implementing only shallow copy when the object graph contains mutable shared references, leading to unintended side-effects
- Storing prototypes in a global mutable registry without thread-safety, causing race conditions
- Overriding clone without calling the parent clone, silently dropping inherited state
- Using Prototype to avoid understanding object construction rather than to genuinely reduce cost or coupling
- Neglecting to update the clone method when new fields are added to the class, resulting in silent data loss

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Prototype | Declares a cloning interface (e.g., `clone()`) | Yes |
| ConcretePrototype | Implements cloning by copying its own internal state | Yes |
| Client | Creates new objects by asking a prototype to clone itself | Yes |
| PrototypeRegistry | Stores and retrieves frequently used prototypes by key | No |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Client | Prototype | depends-on (calls clone) | Yes |
| ConcretePrototype | Prototype | implements | Yes |
| Client | PrototypeRegistry | depends-on (lookups) | No |
| PrototypeRegistry | Prototype | aggregates | No |
