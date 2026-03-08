# Memento

## 1. Applicability
- You need to produce snapshots of an object's state so it can be restored later (undo/redo).
- Direct access to the object's internal fields would violate encapsulation.
- You want to implement checkpointing, transactional rollback, or history navigation.
- The cost of storing full state snapshots is acceptable relative to the complexity of incremental diffing.

## 2. Premature Use
- Adding undo capability before any user or requirement demands it.
- Wrapping objects that are trivially re-computable from inputs -- recomputation is cheaper than snapshots.
- Introducing Memento when a simple copy-on-write or clone suffices without the three-role ceremony.

## 3. Code Smell Triggers
- An object exposes getters for every private field solely so external code can save and restore its state.
- Manual serialization/deserialization scattered across client code to implement rollback.
- Undo logic embedded directly inside the originator, bloating its responsibilities.
- Multiple clients independently caching copies of an object's internals for later restoration.
- History management tangled with business logic instead of being separated into a dedicated caretaker.

## 4. Anti-Pattern Warnings
- Storing mementos indefinitely without eviction leads to unbounded memory growth.
- Letting the caretaker inspect or modify memento internals breaks encapsulation and defeats the pattern's purpose.
- Using mementos for objects with external resource handles (file descriptors, connections) -- restoring state does not restore the resource.
- Assuming mementos are cheap; large or deeply nested object graphs make naive snapshotting expensive.
- Sharing mementos across originators of different types without validation, risking corrupt state restoration.

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Originator | Creates a memento containing a snapshot of its current internal state and can restore its state from a memento. | Yes |
| Memento | Stores the originator's internal state. Provides a narrow (ideally opaque) interface to everyone except the originator. | Yes |
| Caretaker | Manages memento lifecycle (requesting, holding, and passing back mementos) without examining or modifying their contents. | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Originator | Memento | creates / reads | Yes |
| Caretaker | Memento | stores / passes back | Yes |
| Caretaker | Originator | requests snapshot / triggers restore | Yes |
