# Visitor

## 1. Applicability
- You need to perform many unrelated operations on objects in a complex structure (e.g., a tree or composite) without polluting their classes.
- The class hierarchy is stable (rarely adds new element types) but you frequently add new operations over those elements.
- You want to accumulate state while traversing a heterogeneous object structure and keep that logic external to the elements.
- Related behaviors are scattered across several classes and you want to centralize them into a single visitor class per operation.

## 2. Premature Use
- Introducing Visitor when the element hierarchy is still changing rapidly — every new element type forces changes in every visitor.
- Using Visitor for a single operation that could be a simple polymorphic method on the element classes.
- Adding Visitor infrastructure when the object structure is flat or homogeneous, providing no benefit over a basic loop.

## 3. Code Smell Triggers
- Repeated type-checking (`instanceof` / `typeof` / type switches) to decide which operation to run on an element.
- Utility classes with long method chains that operate differently depending on the concrete element type.
- A growing number of unrelated methods accumulating on element classes solely to support external consumers.
- Parallel conditional branches across several classes that perform logically related work.
- Serialization, validation, or rendering logic duplicated inside each element class.

## 4. Anti-Pattern Warnings
- **God Visitor** — a single visitor that handles every operation, defeating the purpose of separating concerns.
- **Leaking internals** — elements exposing excessive public state solely to satisfy visitor needs, breaking encapsulation.
- **Deep coupling to structure** — visitors that assume a specific traversal order or structure shape become fragile to structural changes.
- **Visitor for mutable operations** — using visitors to modify elements in place can introduce hidden side effects and ordering bugs.
- **Overuse on volatile hierarchies** — applying Visitor when element types change frequently leads to a maintenance burden that outweighs the benefit.

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Visitor | Declares a visit method for each concrete element type | Yes |
| ConcreteVisitor | Implements each visit method with operation-specific logic | Yes |
| Element | Declares an `accept(visitor)` method | Yes |
| ConcreteElement | Implements `accept` by calling the visitor's corresponding visit method (double dispatch) | Yes |
| ObjectStructure | Holds or traverses elements and exposes them to the visitor | No |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| ConcreteElement | Visitor | Calls `visitor.visit(self)` in `accept` | Yes |
| ConcreteVisitor | ConcreteElement | Implements type-specific logic per element | Yes |
| ObjectStructure | Element | Iterates over and invokes `accept` on elements | No |
| Client | Visitor | Creates ConcreteVisitor and passes it to the structure | Yes |
