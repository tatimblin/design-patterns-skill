# Mediator

## 1. Applicability
- Classes communicate with many other classes, forming a tangled web of direct dependencies
- Reusing a component is difficult because it depends on too many other components
- You find yourself creating numerous subclasses just to change interaction behavior between components
- A set of objects needs coordinated behavior, but direct coupling between them would reduce flexibility

## 2. Premature Use
- Only two or three objects interact, and their coupling is simple and stable
- The coordination logic is trivial and would be clearer kept inline
- Components already have a natural hierarchy (parent-child) that handles coordination without a separate mediator

## 3. Code Smell Triggers
- Multiple classes hold direct references to each other and call methods across those references
- Changing one class forces cascading changes in several peer classes
- A group of related UI controls or domain objects duplicate interaction logic
- Integration tests require instantiating many peer objects just to test one interaction
- You see "shotgun surgery" whenever a communication rule changes between collaborators

## 4. Anti-Pattern Warnings
- Letting the mediator accumulate all business logic, turning it into a God Object
- Colleagues that still reference each other directly, bypassing the mediator and breaking the decoupling contract
- Creating a mediator for a single pair of objects where a simple direct call would suffice
- Using a generic event bus as a mediator without clear protocols, leading to invisible and hard-to-debug message flows
- Allowing bidirectional knowledge between the mediator and concrete colleague types, defeating abstraction

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Mediator | Declares the interface for communication between colleagues | Yes |
| Concrete Mediator | Implements coordination logic and maintains references to colleagues | Yes |
| Colleague (Component) | Base type for objects that communicate through the mediator rather than directly | Yes |
| Concrete Colleague | Implements domain behavior; notifies the mediator instead of contacting peers | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Concrete Colleague | Mediator | Notifies via mediator interface | Yes |
| Concrete Mediator | Concrete Colleague | Coordinates and dispatches to colleagues | Yes |
| Colleague | Mediator | Holds a reference to the mediator | Yes |
| Concrete Mediator | Colleague | Maintains registry of known colleagues | Yes |
