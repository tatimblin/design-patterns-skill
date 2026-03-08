# Adapter

## 1. Applicability
- You need to use an existing class whose interface does not match the one your client code expects
- You want to create a reusable class that cooperates with unrelated or unforeseen classes lacking compatible interfaces
- You need to integrate a third-party or legacy component without modifying its source code
- You want to convert data formats or calling conventions between two incompatible subsystems
- You are wrapping multiple existing classes behind a unified interface to decouple client code from vendor-specific APIs

## 2. Premature Use
- The interfaces are already compatible or differ only in trivial naming that a simple alias or delegate method resolves
- You control both sides of the interface and can simply refactor one to match the other
- There is only one integration point and no foreseeable need for swappable implementations
- The "adaptation" is actually adding behavior -- Decorator or middleware is more appropriate

## 3. Code Smell Triggers
- Scattered type casts or manual data-conversion code repeated at multiple call sites
- Wrapper methods that do nothing but translate parameters and forward calls to another object
- Client code riddled with conditional branches to handle different library or API versions
- Utility classes full of static "convert" or "translate" methods bridging two interfaces
- Subclassing a third-party class solely to override methods and match an internal interface

## 4. Anti-Pattern Warnings
- Adapting an interface that is still actively changing, causing constant adapter churn
- Stacking multiple adapters (Adapter wrapping Adapter) instead of designing a single clean translation
- Placing business logic inside the adapter rather than keeping it a pure interface translator
- Creating a "god adapter" that adapts many unrelated methods instead of one focused interface
- Using an adapter when the real problem is a missing domain abstraction

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Target | The interface that the client expects and programs against | Yes |
| Client | Collaborates with objects conforming to the Target interface | Yes |
| Adaptee | An existing class with an incompatible interface that needs adapting | Yes |
| Adapter | Implements the Target interface and wraps the Adaptee, translating calls | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Client | Target | depends-on | Yes |
| Adapter | Target | implements | Yes |
| Adapter | Adaptee | wraps (delegates to) | Yes |
| Client | Adapter | uses (via Target interface) | Yes |
