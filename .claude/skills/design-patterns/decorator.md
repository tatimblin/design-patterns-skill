# Decorator

## 1. Applicability
- You need to add responsibilities to objects dynamically and transparently, without affecting other objects of the same class.
- You want to extend behavior in ways that are impractical or impossible with static inheritance (e.g., combinations would cause a class explosion).
- You need to be able to withdraw or recombine responsibilities at runtime.
- The class you want to extend is sealed, final, or otherwise closed for subclassing.

## 2. Premature Use
- A single fixed extension is needed and will never change -- plain inheritance is simpler and more readable.
- There are only one or two combinations of behavior -- a decorator stack adds indirection with no real benefit.
- The team treats every new behavior as a decorator by default, creating dozens of trivial single-method wrappers.

## 3. Code Smell Triggers
- A class hierarchy has an exponential number of subclasses to cover every combination of optional features.
- Copy-pasted pre/post logic appears across multiple subclasses of the same base.
- Conditional flags or boolean parameters toggle optional behavior on or off inside a single class.
- A method grows large because it bundles cross-cutting concerns (logging, caching, validation) with core logic.
- New feature requests consistently require modifying and retesting an existing class.

## 4. Anti-Pattern Warnings
- Stacking too many decorators makes the call chain opaque and error messages difficult to trace.
- Relying on the concrete type of the wrapped object (downcasting) breaks the transparency decorators depend on.
- Decorators that depend on execution order without making that order explicit create fragile, hard-to-maintain configurations.
- Using decorators to patch over poor base-class design instead of refactoring the component interface.
- Allowing decorators to hold mutable state that leaks across invocations, causing unpredictable side effects.

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Component | Interface or abstract type defining operations that can be decorated | Yes |
| ConcreteComponent | The base object that provides default behavior to be extended | Yes |
| Decorator | Abstract wrapper that holds a reference to a Component and forwards calls | No |
| ConcreteDecorator | Adds or overrides behavior before/after delegating to the wrapped Component | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Decorator | Component | composition (wraps) | Yes |
| Decorator | Component | implements / extends | Yes |
| ConcreteDecorator | Decorator | extends | No |
| ConcreteComponent | Component | implements | Yes |
| Client | Component | depends on (via interface) | Yes |
