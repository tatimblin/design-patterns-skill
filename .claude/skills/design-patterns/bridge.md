# Bridge

## 1. Applicability
- You want to split a monolithic class that has several variants of some functionality (e.g., working with multiple APIs, platforms, or rendering engines)
- You need to extend a class in two or more independent dimensions (e.g., shape + color, device + remote)
- You want to switch implementations at runtime without recompiling or redeploying dependent code
- You need to hide implementation details from client code entirely, exposing only a stable abstraction
- A class hierarchy is growing exponentially due to combining orthogonal concerns via inheritance

## 2. Pros/Cons
**Pros:**
- Decouples abstraction from implementation so each can vary independently
- Follows Open/Closed Principle: new abstractions and implementations can be added without modifying existing code
- Follows Single Responsibility Principle: high-level logic lives in the abstraction, platform details live in the implementation
- Enables runtime switching of implementations behind a stable interface

**Cons:**
- Increases overall complexity by introducing additional indirection layers
- Requires upfront identification of independent dimensions, which may not be obvious early in a project
- Can obscure the code flow, making debugging harder when abstraction and implementation are in separate hierarchies

## 3. Relationships
- **Often confused with:** Strategy -- both use composition to delegate work, but Bridge is structural (separating orthogonal hierarchies at design time) while Strategy is behavioral (swapping algorithms at runtime)
- **Often confused with:** Adapter -- Adapter makes incompatible interfaces work together after design; Bridge is established up front to let abstraction and implementation evolve separately
- **Combines well with:** Abstract Factory -- the factory can create and configure the correct implementation objects that the bridge abstraction uses
- **Combines well with:** Builder -- a builder can construct complex bridge structures step by step, selecting the right implementation
- **Alternative to:** Multiple inheritance or deep class hierarchies when two concerns are being combined through subclassing

## 4. Premature Use
- Only one implementation exists and there is no realistic prospect of a second
- The abstraction and implementation dimensions are not truly independent and always change together
- The indirection adds complexity to a small module where a simple conditional or single-level inheritance suffices
- The system is a prototype or throwaway code where long-term extensibility is irrelevant

## 5. Code Smell Triggers
- Combinatorial explosion of subclasses from mixing two or more independent concerns (e.g., WindowsCircle, LinuxCircle, WindowsSquare, LinuxSquare)
- Shotgun surgery: adding a new variant in one dimension forces changes across many classes in another dimension
- Parallel inheritance hierarchies that must be kept in sync
- Platform-specific or driver-specific logic is tangled into high-level business logic
- Frequent conditional branches (if/switch) selecting behavior based on a "type" field that represents an implementation variant

## 6. Anti-Pattern Warnings
- Creating a bridge where the "implementation" hierarchy is really just one class with no siblings -- this is needless indirection
- Letting the abstraction leak implementation details, defeating the purpose of the separation
- Allowing the abstraction to depend on concrete implementation classes instead of the implementation interface
- Using Bridge when the two hierarchies are not truly orthogonal, resulting in awkward or unused combinations
- Over-abstracting by introducing multiple bridge layers when a single level of delegation would suffice

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Abstraction | Defines the high-level control interface and holds a reference to an Implementor | Yes |
| RefinedAbstraction | Extends the Abstraction with additional high-level operations | No |
| Implementor | Declares the interface for implementation classes (primitive operations) | Yes |
| ConcreteImplementor | Provides a concrete implementation of the Implementor interface | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Abstraction | Implementor | Composition (holds reference) | Yes |
| RefinedAbstraction | Abstraction | Inheritance | No |
| ConcreteImplementor | Implementor | Inheritance / Interface realization | Yes |
| Client | Abstraction | Depends on | Yes |
| Client | ConcreteImplementor | Creates or receives (but does not depend on Abstraction's use of it) | No |
