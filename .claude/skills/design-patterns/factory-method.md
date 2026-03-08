# Factory Method

## 1. Applicability
- A class cannot anticipate the exact type of objects it needs to create
- A class wants its subclasses to specify the objects it creates
- Object creation logic is complex enough to warrant encapsulation away from the client
- You need to return different implementations of an interface based on context or configuration
- A framework or library must delegate instantiation to application-level code

## 2. Premature Use
- Only one concrete product exists with no foreseeable variation — direct instantiation is simpler
- Creation logic is trivial (no configuration, no conditional selection) and fits in a single line
- The indirection of a creator hierarchy adds complexity without any polymorphic benefit
- A simple parameterized factory function covers all variants without needing subclass overrides

## 3. Code Smell Triggers
- Constructors or creation calls duplicated across multiple call sites with similar conditional logic
- A method uses switch/if chains on a type code to decide which class to instantiate
- Client code directly depends on many concrete classes, breaking when new types are added
- Test setup is difficult because concrete product classes are hard-wired into the logic
- A framework superclass needs to create objects whose type only the application subclass knows

## 4. Anti-Pattern Warnings
- Factory method that returns a single concrete type and is never overridden (unnecessary indirection)
- Creator subclasses that duplicate logic differing only in the `new` call (extract shared behavior into the base)
- Factory method that accepts a type parameter and uses a large conditional to select the product (this is a parameterized factory, not a true Factory Method)
- Product objects that hold a back-reference to their creator, coupling product to creator
- Overusing factory methods for every object creation regardless of whether polymorphism is needed

## 5. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Product | Declares the interface for objects the factory method creates | Yes |
| ConcreteProduct | Implements the Product interface with a specific variant | Yes |
| Creator | Declares the factory method, may provide a default implementation | Yes |
| ConcreteCreator | Overrides the factory method to return a specific ConcreteProduct | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Creator | Product | Declares factory method returning Product | Yes |
| ConcreteCreator | Creator | Inherits and overrides factory method | Yes |
| ConcreteCreator | ConcreteProduct | Instantiates | Yes |
| Client | Creator | Calls factory method via base type | No |
