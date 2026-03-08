# Composite

## 1. Applicability
- You need to represent part-whole hierarchies as a uniform tree structure
- Clients should treat individual objects and compositions of objects identically
- You want to allow recursive nesting of elements without type-checking at every level
- The domain naturally forms a tree (e.g., file systems, UI widget trees, org charts, expression trees)

## 2. Premature Use
- The hierarchy is only one level deep and unlikely to grow -- a simple list suffices
- Leaf and composite behaviors diverge significantly, forcing many no-op or exception-throwing methods on leaves
- You introduce Composite purely for theoretical extensibility when the domain has a fixed, shallow structure
- There is no client code that benefits from treating leaves and composites uniformly

## 3. Code Smell Triggers
- Repeated `instanceof` / type-checking to distinguish containers from individual items
- Parallel collection-management logic (add, remove, iterate) duplicated across several container classes
- Client code that recursively walks a hierarchy using conditional branching on node type
- Methods that manually aggregate results from children with boilerplate at every level
- A "God container" that holds heterogeneous items but lacks a shared abstraction

## 4. Anti-Pattern Warnings
- Declaring leaf-irrelevant operations (e.g., `addChild`, `removeChild`) on the base component just for interface uniformity -- prefer safety over transparency when misuse is dangerous
- Allowing unconstrained composition that creates cycles in the tree, leading to infinite recursion
- Using Composite where the structure is inherently flat, adding unnecessary indirection
- Overloading the component interface with responsibilities that belong in a Visitor or external service
- Neglecting parent references when upward traversal is needed, then retrofitting them later at high cost

## 5. Structural Characteristics

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
