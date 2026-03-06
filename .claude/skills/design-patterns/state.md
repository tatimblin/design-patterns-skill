# State

## 1. Applicability
- An object's behavior changes significantly depending on its internal state, leading to large conditionals in multiple methods.
- State-specific logic is duplicated or scattered across methods that all switch on the same status field.
- State transitions follow well-defined rules, and you want those rules expressed declaratively rather than buried in branching logic.
- You need to add new states over time without modifying existing state-specific behavior (Open/Closed Principle).

## 2. Pros/Cons
**Pros:** Eliminates sprawling state-conditional logic; localizes each state's behavior in its own class; makes state transitions explicit and auditable; simplifies adding new states without touching existing ones; pairs naturally with the single-responsibility principle.
**Cons:** Can be overkill when there are only a few states with trivial behavior differences; increases class count, which may hurt discoverability; transition logic can become hard to trace when states trigger their own transitions; shared data between the context and state objects requires careful coordination.

## 3. Relationships
- **Often confused with:** Strategy -- both wrap interchangeable behavior behind a common interface, but State objects typically know about and trigger transitions to sibling states, whereas Strategy objects are stateless and selected externally.
- **Combines well with:** Singleton or Flyweight -- state objects that carry no instance-specific data can be shared across contexts. Also combines with Mediator to orchestrate complex multi-object state coordination.
- **Alternative to:** Large finite-state-machine switch/case blocks; also an alternative to table-driven state machines when behavior per state is complex enough to warrant polymorphism.

## 4. Premature Use
- The object has only two or three states with minimal behavioral differences -- a simple boolean or enum with a short conditional is clearer.
- States are unlikely to grow in number, and the existing conditional logic is easy to read and test.
- The "states" are really just configuration values that do not alter control flow or method behavior.

## 5. Code Smell Triggers
- Multiple methods on the same class contain parallel if/else or switch chains keyed on a status or mode field.
- Adding a new status value forces edits across many methods in the same class.
- Transition guard logic (e.g., "can only move from Draft to Published") is duplicated in several places.
- Methods include blocks of dead or unreachable code for states that do not apply to them.
- A status enum is growing alongside a growing set of conditionals that reference it.

## 6. Anti-Pattern Warnings
- Letting each state class directly mutate the context's internals instead of using a narrow transition interface -- this creates tight coupling and fragile code.
- Encoding transition rules in the context rather than in the states, which re-centralizes the logic the pattern was meant to distribute.
- Creating a "God State" base class that holds shared behavior -- keep the state interface thin and focused.
- Allowing bidirectional dependencies between state classes; prefer states that only know about the context interface and the states they can transition to.
- Using State when a simple map of status-to-callback or a lightweight state-machine library would suffice, adding unnecessary structural complexity.

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Context | Maintains a reference to the current state object, delegates state-dependent behavior to it, and exposes a method for changing the active state. | Yes |
| State (interface) | Declares the interface for all state-specific behavior that the context delegates. | Yes |
| Concrete State | Implements behavior for a particular state and may trigger transitions by replacing the context's current state. | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Context | State | has-a (delegates to current state) | Yes |
| Concrete State | State | implements | Yes |
| Concrete State | Context | calls back (to trigger state transition) | Yes |
| Concrete State | Concrete State | knows-about (target transition state) | No |
