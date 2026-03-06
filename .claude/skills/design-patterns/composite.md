# Composite

## 1. Applicability
- You need to represent part-whole hierarchies as a uniform tree structure
- Clients should treat individual objects and compositions of objects identically
- You want to allow recursive nesting of elements without type-checking at every level
- The domain naturally forms a tree (e.g., file systems, UI widget trees, org charts, expression trees)

## 2. Pros/Cons
**Pros:** Simplifies client code by eliminating type-checking between leaves and composites; makes it easy to add new component types without modifying existing code (Open/Closed); naturally models recursive structures; supports polymorphic traversal of entire hierarchies.
**Cons:** Can make designs overly general -- hard to restrict which component types a composite may contain; compile-time type safety is weakened since leaf-specific and composite-specific operations share one interface; debugging deep or wide trees can be difficult.

## 3. Relationships
- **Often confused with:** **Decorator** -- both use recursive composition, but Decorator adds responsibilities to a single child while Composite aggregates multiple children to model a whole.
- **Combines well with:** **Iterator** (to traverse composite trees), **Visitor** (to execute operations across heterogeneous nodes without polluting the component interface), **Builder** (to construct complex composite trees step-by-step).
- **Alternative to:** **Chain of Responsibility** when the hierarchy is a simple linear chain rather than a tree; flat collection approaches when nesting is not truly needed.

## 4. Premature Use
- The hierarchy is only one level deep and unlikely to grow -- a simple list suffices
- Leaf and composite behaviors diverge significantly, forcing many no-op or exception-throwing methods on leaves
- You introduce Composite purely for theoretical extensibility when the domain has a fixed, shallow structure
- There is no client code that benefits from treating leaves and composites uniformly

## 5. Code Smell Triggers
- Repeated `instanceof` / type-checking to distinguish containers from individual items
- Parallel collection-management logic (add, remove, iterate) duplicated across several container classes
- Client code that recursively walks a hierarchy using conditional branching on node type
- Methods that manually aggregate results from children with boilerplate at every level
- A "God container" that holds heterogeneous items but lacks a shared abstraction

## 6. Anti-Pattern Warnings
- Declaring leaf-irrelevant operations (e.g., `addChild`, `removeChild`) on the base component just for interface uniformity -- prefer safety over transparency when misuse is dangerous
- Allowing unconstrained composition that creates cycles in the tree, leading to infinite recursion
- Using Composite where the structure is inherently flat, adding unnecessary indirection
- Overloading the component interface with responsibilities that belong in a Visitor or external service
- Neglecting parent references when upward traversal is needed, then retrofitting them later at high cost

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Component | Declares the common interface for all objects in the composition, including default behavior and optionally child-management operations | Yes |
| Leaf | Represents terminal objects with no children; implements Component behavior directly | Yes |
| Composite | Stores child Components; implements Component operations by delegating to children and aggregating results | Yes |
| Client | Interacts with all elements through the Component interface, unaware of whether it holds a Leaf or Composite | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Composite | Component | Aggregation (zero-to-many children) | Yes |
| Leaf | Component | Implements / Extends | Yes |
| Composite | Component | Implements / Extends | Yes |
| Client | Component | Depends on (uses interface) | Yes |
| Component | Composite | Optional parent back-reference | No |
