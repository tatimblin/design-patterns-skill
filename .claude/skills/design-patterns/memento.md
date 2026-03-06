# Memento

## 1. Applicability
- You need to produce snapshots of an object's state so it can be restored later (undo/redo).
- Direct access to the object's internal fields would violate encapsulation.
- You want to implement checkpointing, transactional rollback, or history navigation.
- The cost of storing full state snapshots is acceptable relative to the complexity of incremental diffing.

## 2. Pros/Cons
**Pros:** Preserves encapsulation boundaries -- the originator alone manages its internal state. Simplifies the originator by offloading history-management responsibility to the caretaker. Enables straightforward undo/redo and rollback mechanics.
**Cons:** Can consume significant memory if mementos are created frequently or state objects are large. Caretakers have no insight into memento contents, making it hard to discard obsolete snapshots intelligently. Languages without visibility controls may struggle to enforce the narrow memento interface.

## 3. Relationships
- **Often confused with:** **Command** -- both support undo, but Command stores the operation (and its inverse) while Memento stores a full state snapshot. Choose Command when operations are easily reversible; choose Memento when computing an inverse is impractical.
- **Combines well with:** **Command** -- a command can store a memento before execution to enable rollback. **Iterator** -- a caretaker can iterate over a history of mementos. **Prototype** -- cloning can serve as a simplified memento mechanism when the full protocol is unnecessary.
- **Alternative to:** **Command** (for undo) when inverse operations are complex or state is opaque. **Serialization/deserialization** when snapshots must remain in-process and type-safe.

## 4. Premature Use
- Adding undo capability before any user or requirement demands it.
- Wrapping objects that are trivially re-computable from inputs -- recomputation is cheaper than snapshots.
- Introducing Memento when a simple copy-on-write or clone suffices without the three-role ceremony.

## 5. Code Smell Triggers
- An object exposes getters for every private field solely so external code can save and restore its state.
- Manual serialization/deserialization scattered across client code to implement rollback.
- Undo logic embedded directly inside the originator, bloating its responsibilities.
- Multiple clients independently caching copies of an object's internals for later restoration.
- History management tangled with business logic instead of being separated into a dedicated caretaker.

## 6. Anti-Pattern Warnings
- Storing mementos indefinitely without eviction leads to unbounded memory growth.
- Letting the caretaker inspect or modify memento internals breaks encapsulation and defeats the pattern's purpose.
- Using mementos for objects with external resource handles (file descriptors, connections) -- restoring state does not restore the resource.
- Assuming mementos are cheap; large or deeply nested object graphs make naive snapshotting expensive.
- Sharing mementos across originators of different types without validation, risking corrupt state restoration.

## 7. Structural Characteristics

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
