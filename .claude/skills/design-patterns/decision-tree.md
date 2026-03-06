# Decision Tree: Code Smell to Pattern Routing

Map observed code smells to candidate patterns. Each entry provides disambiguation guidance to select the right pattern.

---

## Growing Conditional Logic

**Smell:** Expanding `switch`/`if-else` chain selecting between behaviors or algorithms

**Candidates:**
- **Strategy** -- branches represent interchangeable algorithms selected at runtime by the caller
- **State** -- branches represent state-dependent behavior with internal transitions between states
- **Command** -- branches represent discrete operations that could be queued, logged, or undone

**Disambiguate:** If the caller picks the behavior, Strategy. If the object transitions itself, State. If operations need history/undo, Command.

## Tight Coupling to Multiple Dependents

**Smell:** A class directly calls methods on several other classes that react to its changes

**Candidates:**
- **Observer** -- dependents need notification of state changes; one-to-many broadcast
- **Mediator** -- multiple objects interact bidirectionally; centralize coordination to reduce mesh coupling

**Disambiguate:** If communication is one-directional (source -> listeners), Observer. If objects communicate in multiple directions through a hub, Mediator.

## Conditional Object Creation

**Smell:** `switch`/`if-else` selecting which object to instantiate, with construction logic inline

**Candidates:**
- **Factory Method** -- one product type, creation varies by subclass or context
- **Abstract Factory** -- families of related products that must be used together
- **Builder** -- complex object with many optional parts or multi-step construction

**Disambiguate:** If creating one product type with varying implementations, Factory Method. If creating families of related objects, Abstract Factory. If the object has many optional fields or construction steps, Builder.

## Telescoping Constructor

**Smell:** Constructor with many parameters, most optional, callers pass `null` or default placeholders

**Candidates:**
- **Builder** -- fluent step-by-step construction, sets only needed fields

**Disambiguate:** Builder is almost always the right choice here. If the object also has multiple representations, consider combining Builder with Abstract Factory.

## Incompatible Interfaces

**Smell:** Inline conversion between two interfaces -- scattered format translation, unit conversion, or protocol bridging

**Candidates:**
- **Adapter** -- make an existing class work with an interface it wasn't designed for
- **Facade** -- simplify a complex subsystem behind a unified interface

**Disambiguate:** If wrapping one class to match another's interface, Adapter. If simplifying access to multiple subsystem classes, Facade.

## Inheritance Explosion (M x N)

**Smell:** Class hierarchy growing as the product of two or more independent dimensions (e.g., type x platform)

**Candidates:**
- **Bridge** -- separate the dimensions into independent hierarchies composed at runtime
- **Decorator** -- if one dimension adds behavior incrementally rather than being a parallel hierarchy

**Disambiguate:** If both dimensions are true independent hierarchies, Bridge. If one dimension is a stack of optional wrappers, Decorator.

## Complex Subsystem Orchestration

**Smell:** Client code calls many classes in a specific sequence to accomplish a task; coupling to subsystem internals

**Candidates:**
- **Facade** -- provide a simple interface to a complex subsystem
- **Mediator** -- if the subsystem classes also need to communicate with each other

**Disambiguate:** If client needs simplified access, Facade. If subsystem components also coordinate among themselves, Mediator.

## Duplicated Object Setup

**Smell:** Repeated construction of similar objects with minor variations; cloning logic scattered or absent

**Candidates:**
- **Prototype** -- clone pre-configured templates instead of constructing from scratch
- **Factory Method** -- if variations map to distinct subclasses rather than configuration tweaks

**Disambiguate:** If objects differ by configuration/state, Prototype. If objects differ by type/class, Factory Method.

## Adding Behavior Without Subclassing

**Smell:** Subclassing solely to add optional behavior; combinatorial explosion of feature subclasses

**Candidates:**
- **Decorator** -- wrap objects to add behavior dynamically; stack multiple decorators
- **Strategy** -- if the behavior is an interchangeable algorithm, not an additive wrapper
- **Proxy** -- if the added behavior is access control, caching, or lazy loading

**Disambiguate:** If behavior layers stack, Decorator. If behavior swaps, Strategy. If controlling access to the real object, Proxy.

## Traversing a Collection

**Smell:** External code navigates a collection's internal structure directly; iteration logic duplicated

**Candidates:**
- **Iterator** -- encapsulate traversal logic; support multiple simultaneous traversals

**Disambiguate:** Iterator is the standard choice. If elements need processing in different ways during traversal, combine with Visitor.

## Processing Elements of a Heterogeneous Structure

**Smell:** Type-checking (`instanceof`) to perform different operations on elements of a structure

**Candidates:**
- **Visitor** -- define new operations without modifying element classes
- **Strategy** -- if there's only one element type with varying algorithms

**Disambiguate:** If multiple element types need type-specific processing, Visitor. If one type with swappable behavior, Strategy.

## Undo / Replay / History

**Smell:** Need to save and restore object state, or record operations for undo/redo

**Candidates:**
- **Memento** -- capture and restore object state without exposing internals
- **Command** -- record operations as objects; replay or reverse them

**Disambiguate:** If saving state snapshots, Memento. If recording executable operations, Command.

## Request Handling Chain

**Smell:** A request must be processed by one of several handlers; handler selection uses conditionals or hardcoded routing

**Candidates:**
- **Chain of Responsibility** -- pass request along a chain until a handler processes it
- **Command** -- if requests should be parameterized and potentially queued

**Disambiguate:** If handlers are ordered and any one can handle or pass along, Chain of Responsibility. If requests are self-contained executable objects, Command.

## Algorithm with Fixed Steps, Varying Details

**Smell:** Multiple classes implement similar algorithms that share structure but differ in specific steps

**Candidates:**
- **Template Method** -- define the skeleton in a base class; subclasses override specific steps
- **Strategy** -- if the entire algorithm varies, not just individual steps

**Disambiguate:** If the overall structure is fixed and only steps vary, Template Method. If the entire algorithm is swappable, Strategy.

## Shared Fine-Grained Objects

**Smell:** Large number of similar objects consuming excessive memory; objects differ only in a small portion of state

**Candidates:**
- **Flyweight** -- share common state (intrinsic) across objects; pass varying state (extrinsic) as parameters

**Disambiguate:** Flyweight is the standard choice when memory is the bottleneck and objects have separable intrinsic/extrinsic state.

## Tree / Part-Whole Hierarchies

**Smell:** Code treats individual items and groups differently; recursive structures with duplicated handling logic

**Candidates:**
- **Composite** -- treat individual objects and compositions uniformly through a shared interface
- **Decorator** -- if the goal is adding behavior, not representing part-whole hierarchies

**Disambiguate:** If modeling a tree where branches and leaves share operations, Composite. If wrapping to extend behavior, Decorator.

## Controlling Access to an Object

**Smell:** Need for lazy initialization, access control, logging, or caching around an existing object

**Candidates:**
- **Proxy** -- provide a surrogate that controls access to the real object
- **Decorator** -- if the goal is adding new behavior rather than controlling access

**Disambiguate:** If the wrapper controls when/whether the real object is accessed, Proxy. If it adds new behavior, Decorator.

## Global Shared Instance

**Smell:** Multiple parts of the system need exactly one shared instance; initialization order matters

**Candidates:**
- **Singleton** -- ensure a class has only one instance with a global access point

**Disambiguate:** Singleton is the standard choice, but consider whether dependency injection could eliminate the need for global state.
