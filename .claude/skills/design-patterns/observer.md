# Observer

## 1. Applicability
- Changes in one object's state must be reflected in other objects, and the set of dependents is unknown or changes dynamically
- An object should notify other objects without making assumptions about who or how many those objects are
- A publish-subscribe relationship is needed where subscribers can be added or removed at runtime
- You need to decouple a core domain object from the components that react to its state changes
- Event-driven communication is required between loosely coupled components

## 2. Premature Use
- When the number of dependents is fixed and known at compile time -- direct method calls are simpler and more traceable
- When the subject has only one observer and that relationship will never change
- When synchronous, deterministic ordering of reactions is critical and the indirection of Observer adds unnecessary complexity
- When the system is small enough that the coupling Observer removes would not cause maintenance problems

## 3. Code Smell Triggers
- An object manually calls update methods on several other objects whenever its state changes
- Adding a new dependent requires editing the source object's notification logic
- Multiple classes poll another object's state on a timer or cycle to detect changes
- Scattered, duplicated "if state changed, then notify X" blocks across methods
- A class maintains a hard-coded list of collaborators it pushes state updates to

## 4. Anti-Pattern Warnings
- Forgetting to deregister observers, causing memory leaks and ghost notifications to destroyed objects
- Fat notification payloads that send the entire subject state when observers only need a subset (push model bloat)
- Allowing observers to modify the subject during notification, triggering re-entrant or cascading update storms
- Using Observer where a simple callback or event handler would suffice, adding unnecessary abstraction
- Creating deep observer chains (A notifies B, B notifies C...) making the system hard to reason about and debug

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Subject | Maintains a list of observers and provides methods to attach, detach, and notify them | Yes |
| Observer | Defines an updating interface for objects that should be notified of subject changes | Yes |
| ConcreteSubject | Stores state of interest and sends notifications when state changes | Yes |
| ConcreteObserver | Implements the Observer interface to keep its state consistent with the subject's | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Subject | Observer | Maintains a collection of; notifies via update interface | Yes |
| ConcreteSubject | Subject | Inherits / implements | Yes |
| ConcreteObserver | Observer | Inherits / implements | Yes |
| ConcreteObserver | ConcreteSubject | Reads state from (pull) or receives state via notification (push) | Yes |
