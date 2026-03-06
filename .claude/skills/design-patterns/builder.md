# Builder

## 1. Applicability
- Object construction requires many parameters, several of which are optional
- Same construction process must create different representations of an object
- Object must be constructed step-by-step or in a specific order
- Constructor telescoping (many overloaded constructors) is emerging
- Immutable objects need complex assembly before final creation

## 2. Pros/Cons
**Pros:** Construct objects step-by-step, reuse same construction code for varied representations, isolate complex construction logic from business logic, produce immutable objects cleanly
**Cons:** Increased code complexity due to multiple new classes, requires creating a separate builder for each product type, builder must be kept in sync when product fields change

## 3. Relationships
- **Often confused with:** Abstract Factory (both construct complex objects, but Builder assembles step-by-step while Abstract Factory returns a product in one call)
- **Combines well with:** Composite (builders can construct recursive tree structures), Bridge (director class acts as abstraction while builders act as implementations)
- **Alternative to:** Telescoping constructors, large parameter objects, Abstract Factory when step-by-step construction is not needed

## 4. Premature Use
- Object has few required fields and no optional fields — a simple constructor suffices
- Only one representation of the product ever exists — a factory method or constructor is simpler
- Construction steps never vary in order or composition across callers

## 5. Code Smell Triggers
- Constructor with more than 4-5 parameters, many of which are nullable or defaulted
- Multiple constructor overloads that delegate to one "master" constructor
- Complex object initialization scattered across client code with many setter calls after construction
- Repeated near-identical object setup code across multiple call sites
- Need to enforce that an object is immutable once fully constructed

## 6. Anti-Pattern Warnings
- Builder that exposes every field — effectively a mutable copy of the product with no construction logic
- Skipping the Director when a consistent build sequence is used in multiple places (duplicates orchestration)
- Builder with required `build()` validation that should have been compile-time guarantees (consider staged/typestate builder)
- Using Builder for objects with 1-2 fields — adds ceremony with no benefit
- Allowing partial builds that produce invalid objects — `build()` must enforce invariants

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Builder | Declares step-by-step construction interface | Yes |
| ConcreteBuilder | Implements construction steps; holds the product being assembled | Yes |
| Product | The complex object under construction | Yes |
| Director | Encapsulates a particular construction sequence using the Builder interface | No |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Director | Builder | Uses (delegates construction steps) | No |
| ConcreteBuilder | Product | Creates and assembles | Yes |
| Client | ConcreteBuilder | Instantiates and configures | Yes |
| Client | Director | Optionally delegates build orchestration | No |
