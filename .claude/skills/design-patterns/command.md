# Command

## 1. Applicability
- You need to parameterize objects with operations, queue operations, or schedule their execution at different times.
- You want to support undo/redo by storing command history and reversing executed operations.
- You need to assemble complex composite operations (macros) from simpler ones.
- You want to decouple the object that invokes an operation from the object that knows how to perform it.
- You need to log changes so they can be reapplied after a system crash (transaction journaling).

## 2. Pros/Cons
**Pros:** Decouples invoker from receiver; enables undo/redo, deferred execution, and operation logging; commands are first-class objects that can be composed, queued, and serialized; adding new commands requires no changes to existing invoker or receiver code (Open/Closed Principle); supports macro recording by composing commands.
**Cons:** Increases overall complexity by introducing a new layer between sender and receiver; each individual operation may require its own concrete command class, leading to class proliferation; undo state management can become non-trivial for commands with complex side effects.

## 3. Relationships
- **Often confused with:** Strategy (both encapsulate behavior in objects, but Strategy describes *how* to do something while Command describes *what* to do and carries its own context); Memento (both relate to undo, but Memento captures state snapshots while Command captures operations).
- **Combines well with:** Memento (store pre-execution state for reliable undo); Composite (assemble macro-commands from leaf commands); Chain of Responsibility (pass a command along a chain of potential handlers); Prototype (clone commands to place copies in history).
- **Alternative to:** Strategy when the goal is deferred or queued execution rather than algorithm selection; direct callback functions or closures in languages that support first-class functions.

## 4. Premature Use
- The operation is simple, always executed immediately, and never needs undo or queuing -- a direct method call suffices.
- There is only one invoker and one receiver with a stable interface, adding no decoupling benefit.
- The language provides first-class functions or closures that already satisfy the parameterization need without a full class hierarchy.

## 5. Code Smell Triggers
- Large switch or if/else blocks that dispatch behavior based on a request type or action string.
- UI handlers or event listeners containing business logic directly instead of delegating to encapsulated operations.
- Undo functionality implemented by saving and restoring entire object state on every change.
- Copy-pasted operation logic across multiple call sites that could be unified in a single command object.
- Methods accepting numerous parameters to control behavioral variations of a single operation.

## 6. Anti-Pattern Warnings
- Creating command objects that directly mutate receiver internals instead of using the receiver's public interface, breaking encapsulation.
- Storing mutable shared state inside command instances, causing unexpected side effects when commands are replayed or undone.
- Implementing undo without capturing sufficient pre-execution state, leading to irreversible or incorrect rollbacks.
- Building a deep command class hierarchy with shared base-class logic, coupling concrete commands together.
- Using Command as a glorified function pointer with no real need for queuing, logging, or undo -- adding complexity for no benefit.

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Command | Declares the interface for executing (and optionally undoing) an operation. | Yes |
| Concrete Command | Binds a receiver to specific actions; implements execute by invoking operations on the receiver. | Yes |
| Invoker | Asks the command to carry out the request; holds and triggers commands without knowing receiver details. | Yes |
| Receiver | Knows how to perform the actual work associated with a request. | Yes |
| Client | Creates concrete command objects and configures them with the appropriate receiver. | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Client | Concrete Command | creates and configures | Yes |
| Client | Receiver | assigns to command | Yes |
| Invoker | Command | triggers execute/undo | Yes |
| Concrete Command | Receiver | delegates work to | Yes |
| Invoker | Command | stores reference | Yes |
