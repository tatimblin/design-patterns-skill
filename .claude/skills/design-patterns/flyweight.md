# Flyweight

## 1. Applicability
- An application creates a very large number of similar objects, straining available memory
- Objects contain duplicate state that can be extracted and shared across instances
- Many distinct object groups can be replaced by fewer shared objects once extrinsic state is removed
- Object identity is not important to the application — logically distinct instances can share the same flyweight

## 2. Pros/Cons
**Pros:** Dramatically reduces memory consumption when dealing with massive numbers of fine-grained objects; separates intrinsic (shared, immutable) state from extrinsic (contextual, varying) state, which can clarify data ownership.

**Cons:** Increases code complexity by splitting state into intrinsic and extrinsic parts; callers must compute or supply extrinsic state at every operation, trading CPU time for memory savings; flyweight objects become harder to reason about in isolation because their behavior depends on externally provided context.

## 3. Relationships
- **Often confused with:** **Singleton** — both restrict object creation, but Singleton limits a class to one instance while Flyweight allows many shared instances distinguished by intrinsic state. Also confused with simple caching, which is a broader concern and not inherently structural.
- **Combines well with:** **Composite** — leaf nodes in a Composite tree are prime candidates for flyweights when the tree contains many repeated elements. **Factory Method / Abstract Factory** — a Flyweight Factory manages the pool of shared instances and ensures clients reuse rather than recreate them.
- **Alternative to:** **Object Pool** — when the goal is reusing stateful, mutable objects rather than sharing immutable ones. **Prototype** — when cheap cloning is sufficient and separating intrinsic/extrinsic state adds unwarranted complexity.

## 4. Premature Use
- Applying Flyweight before profiling confirms that object count and memory consumption are actual bottlenecks
- Splitting state prematurely when objects are not numerous enough to justify the added indirection
- Forcing immutability on intrinsic state when the domain genuinely requires mutable shared data, leading to workarounds that erode the pattern's benefits

## 5. Code Smell Triggers
- Millions of near-identical objects allocated in tight loops or large data structures
- High memory pressure or out-of-memory errors traced to fine-grained object creation
- Objects where most fields hold the same values across many instances
- Large collections where each element carries redundant formatting, configuration, or type metadata
- Repeated construction of objects that differ only by a small amount of contextual data

## 6. Anti-Pattern Warnings
- Storing extrinsic state inside the flyweight, breaking shareability and introducing subtle aliasing bugs
- Neglecting thread safety in the flyweight factory when shared across concurrent contexts
- Using Flyweight when object count is low — the indirection cost outweighs any memory benefit
- Making flyweight objects mutable, which corrupts shared state for all clients simultaneously
- Over-fragmenting state so that reassembling a usable object requires passing excessive context through every call

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Flyweight | Declares the interface through which flyweights receive and act on extrinsic state | Yes |
| ConcreteFlyweight | Implements the Flyweight interface and stores intrinsic (shared, immutable) state | Yes |
| UnsharedConcreteFlyweight | A flyweight subclass that cannot be shared; used when some objects must retain full state | No |
| FlyweightFactory | Creates and manages the pool of flyweight objects, ensuring shared instances are reused | Yes |
| Client | Maintains references to flyweights and computes or stores the extrinsic state | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Client | FlyweightFactory | Requests flyweight instances | Yes |
| FlyweightFactory | ConcreteFlyweight | Creates or returns existing shared instances | Yes |
| Client | Flyweight | Supplies extrinsic state at operation time | Yes |
| Client | UnsharedConcreteFlyweight | Holds non-shared instances directly when needed | No |
