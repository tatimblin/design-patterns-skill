# Iterator

## 1. Applicability
- The collection has a complex internal structure (tree, graph, composite) that you want to hide from clients.
- You need multiple independent traversal strategies over the same collection without bloating its interface.
- You want a uniform way to traverse different collection types polymorphically.
- Client code should work with elements without knowing or depending on the concrete collection class.

## 2. Premature Use
- The collection is a simple list or array whose built-in enumeration is sufficient.
- Only one traversal order will ever be needed and the language already provides it.
- Adding an iterator abstraction when the collection type is unlikely to change or be swapped.

## 3. Code Smell Triggers
- Client code uses index arithmetic or pointer manipulation to walk a collection's internals.
- Traversal logic is duplicated across multiple clients of the same data structure.
- A collection class exposes structural details (child pointers, bucket arrays) solely for traversal purposes.
- Switching between traversal strategies (depth-first vs. breadth-first) requires changing client code.
- A complex aggregate forces callers to understand its storage layout before they can read elements.

## 4. Anti-Pattern Warnings
- Allowing mutation of the collection through the iterator, turning a read traversal into a hidden write path.
- Creating a "fat iterator" that accumulates filtering, mapping, and sorting -- these concerns belong in separate decorators or pipelines.
- Exposing the iterator's internal cursor or position index, re-coupling clients to the collection's structure.
- Returning a snapshot-based iterator for large collections when a lazy, streaming approach would be more appropriate.
- Nesting iterator creation inside tight loops without reuse, leading to excessive object allocation.

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Iterator | Declares the interface for accessing and traversing elements (next, hasNext, current). | Yes |
| ConcreteIterator | Implements the Iterator interface and tracks the current traversal position. | Yes |
| Aggregate (Collection) | Declares an interface for creating an Iterator object. | Yes |
| ConcreteAggregate | Implements the Aggregate interface and returns a ConcreteIterator instance. | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| ConcreteAggregate | ConcreteIterator | creates | Yes |
| ConcreteIterator | ConcreteAggregate | references (to access elements) | Yes |
| Client | Iterator | depends on (interface only) | Yes |
| Client | Aggregate | depends on (to obtain iterator) | Yes |
