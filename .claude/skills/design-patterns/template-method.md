# Template Method

## 1. Applicability
- Several classes contain nearly identical algorithms with minor variations in certain steps
- You want to let subclasses extend or override specific steps of an algorithm without changing its overall structure
- You need to consolidate duplicated logic across subclasses into a single place (the abstract class) while allowing controlled variation
- A framework needs to define the skeleton of an operation but delegate specific steps to client code

## 2. Premature Use
- Applying it when there is only one concrete implementation and no realistic expectation of variants
- Introducing an abstract superclass solely for "future extensibility" when a simple concrete class would suffice
- Using inheritance-based extension when composition (Strategy) would be simpler and more flexible
- Defining numerous hook methods "just in case" subclasses might need them

## 3. Code Smell Triggers
- Multiple subclasses with nearly identical methods differing only in a few lines or steps
- Copy-pasted algorithm logic across sibling classes with slight per-class tweaks
- Repeated conditional blocks (if/switch on type) selecting behavior that could be polymorphic steps
- Superclass methods that call abstract or overridable methods in a fixed sequence
- Framework or library code that forces users to follow a rigid multi-step workflow

## 4. Anti-Pattern Warnings
- Overly deep inheritance chains where each level overrides different template steps, making the call flow unreadable
- Template methods with too many steps (more than 5-7), indicating the algorithm should be decomposed or redesigned
- Requiring subclasses to call `super` in overridden steps to maintain correctness -- this is fragile and error-prone
- Making all steps abstract when most subclasses share the same default behavior -- use hook methods with sensible defaults instead
- Allowing subclasses to override the template method itself, breaking the intended invariant algorithm structure

## 5. Structural Characteristics

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
