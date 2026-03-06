# Template Method

## 1. Applicability
- Several classes contain nearly identical algorithms with minor variations in certain steps
- You want to let subclasses extend or override specific steps of an algorithm without changing its overall structure
- You need to consolidate duplicated logic across subclasses into a single place (the abstract class) while allowing controlled variation
- A framework needs to define the skeleton of an operation but delegate specific steps to client code

## 2. Pros/Cons
**Pros:** Eliminates code duplication by pulling shared algorithm structure into a superclass. Clients can override only certain steps of a large algorithm without being affected by changes to other steps. Enforces a consistent algorithm structure across all variants (inversion of control).
**Cons:** Subclasses are tightly coupled to the abstract class's skeleton; changes to the template ripple to all subclasses. Can violate the Liskov Substitution Principle if step overrides alter expected behavior. Maintenance burden grows with the number of steps, especially when the template has many hook methods. Debugging can be difficult because control flow bounces between the superclass template and subclass overrides.

## 3. Relationships
- **Often confused with:** Strategy -- both vary algorithm behavior, but Template Method uses inheritance to vary *parts* of an algorithm at compile time, while Strategy uses composition to swap *entire* algorithms at runtime
- **Combines well with:** Factory Method -- factory methods are often called as steps within a template method; Hook methods in a template can delegate object creation to Factory Method overrides
- **Combines well with:** Strategy -- individual steps of a template method can be delegated to strategy objects for runtime flexibility
- **Alternative to:** Strategy -- prefer Strategy when you need runtime algorithm swapping or want to avoid deep inheritance hierarchies; prefer Template Method when variations are compile-time and share significant structural overlap

## 4. Premature Use
- Applying it when there is only one concrete implementation and no realistic expectation of variants
- Introducing an abstract superclass solely for "future extensibility" when a simple concrete class would suffice
- Using inheritance-based extension when composition (Strategy) would be simpler and more flexible
- Defining numerous hook methods "just in case" subclasses might need them

## 5. Code Smell Triggers
- Multiple subclasses with nearly identical methods differing only in a few lines or steps
- Copy-pasted algorithm logic across sibling classes with slight per-class tweaks
- Repeated conditional blocks (if/switch on type) selecting behavior that could be polymorphic steps
- Superclass methods that call abstract or overridable methods in a fixed sequence
- Framework or library code that forces users to follow a rigid multi-step workflow

## 6. Anti-Pattern Warnings
- Overly deep inheritance chains where each level overrides different template steps, making the call flow unreadable
- Template methods with too many steps (more than 5-7), indicating the algorithm should be decomposed or redesigned
- Requiring subclasses to call `super` in overridden steps to maintain correctness -- this is fragile and error-prone
- Making all steps abstract when most subclasses share the same default behavior -- use hook methods with sensible defaults instead
- Allowing subclasses to override the template method itself, breaking the intended invariant algorithm structure

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| AbstractClass | Declares the template method defining the algorithm skeleton; defines abstract and/or hook steps | Yes |
| Template Method | A concrete method in the abstract class that calls steps in a fixed order | Yes |
| Abstract Step | A step with no default implementation that subclasses must override | No |
| Hook Method | A step with a default (often empty) implementation that subclasses may optionally override | No |
| ConcreteClass | Implements abstract steps and optionally overrides hook methods | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| AbstractClass | Abstract Step / Hook Method | defines and calls | Yes |
| ConcreteClass | AbstractClass | inheritance | Yes |
| ConcreteClass | Abstract Step | implements | Yes |
| ConcreteClass | Hook Method | overrides | No |
| Template Method | Abstract Step / Hook Method | invokes in sequence | Yes |
