# Facade

## 1. Applicability
- You need a simplified interface to a complex subsystem with many interdependent classes
- You want to layer a subsystem, providing a single entry point to each level of functionality
- Client code must be decoupled from subsystem internals to reduce compile-time or module-level dependencies
- You are wrapping a poorly designed or legacy API with a cleaner, more focused interface
- Multiple clients duplicate similar orchestration logic across subsystem components

## 2. Pros/Cons
**Pros:**
- Isolates clients from subsystem complexity, reducing the number of objects they interact with
- Promotes weak coupling between subsystems and their consumers
- Does not prevent direct subsystem access when clients need fine-grained control
- Simplifies porting or replacing subsystem internals without affecting client code

**Cons:**
- Can become a "god object" that couples to every class in the subsystem
- Adds an extra layer of indirection that may obscure debugging and tracing
- Risk of accumulating unrelated convenience methods, violating single responsibility

## 3. Relationships
- **Often confused with:** **Adapter** -- Adapter changes an existing interface to match another; Facade defines a new simplified interface over an entire subsystem
- **Often confused with:** **Mediator** -- Mediator coordinates peer objects bidirectionally; Facade provides a unidirectional simplified API without adding new behavior between subsystem classes
- **Combines well with:** **Abstract Factory** -- a facade can serve as the entry point that internally uses an abstract factory to create subsystem objects
- **Combines well with:** **Singleton** -- facades are often singletons since a single access point to a subsystem is usually sufficient
- **Alternative to:** **Mediator** -- when you only need simplified access rather than full bidirectional coordination among peers

## 4. Premature Use
- The subsystem has only two or three classes with a straightforward API
- Clients already interact with a single subsystem class and orchestration is trivial
- Requirements are unstable and the "simplified" interface will churn faster than the subsystem itself
- Adding a facade solely to follow a pattern when direct calls are equally readable

## 5. Code Smell Triggers
- Multiple client modules repeat the same multi-step setup or orchestration sequence across subsystem objects
- Client code imports or depends on a large number of subsystem classes it does not fully use
- Changes to subsystem internals cascade into widespread client-side modifications
- New team members struggle to understand which subsystem classes to call and in what order
- Test setup requires constructing and wiring many subsystem objects just to exercise a single workflow

## 6. Anti-Pattern Warnings
- The facade exposes every subsystem method instead of curating a purposeful subset (transparent facade)
- Business logic migrates into the facade rather than staying in subsystem classes, turning it into a god object
- Multiple facades are created per subsystem without clear audience separation, fragmenting the API
- The facade suppresses or swallows subsystem exceptions, hiding failures from callers
- Subsystem classes are made non-public solely to force facade usage, removing legitimate advanced-use options

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Facade | Provides a unified, higher-level interface that delegates to subsystem objects | Yes |
| Subsystem Classes | Implement subsystem functionality; handle work assigned by the facade | Yes |
| Additional Facade | Optional secondary facade to prevent polluting the primary facade with unrelated features | No |
| Client | Uses the facade instead of calling subsystem objects directly | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Client | Facade | depends-on | Yes |
| Facade | Subsystem Classes | delegates-to | Yes |
| Client | Subsystem Classes | may-bypass | No |
| Additional Facade | Subsystem Classes | delegates-to | No |
