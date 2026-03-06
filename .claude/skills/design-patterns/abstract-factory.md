# Abstract Factory

## 1. Applicability
- Code must create families of related objects (e.g., UI widgets for a theme) without coupling to their concrete classes
- The system needs to enforce that objects from the same family are used together and never mixed
- You want to expose only interfaces for product creation, hiding the concrete implementations from client code
- The set of product families is expected to grow, and new families should be addable without modifying existing client code

## 2. Pros/Cons
**Pros:**
- Guarantees compatibility among products created by the same factory
- Extracts product creation into one place, making concrete classes easy to swap
- Satisfies the Open/Closed Principle: new families can be introduced without changing existing code
- Decouples client code from concrete product classes, depending only on abstractions

**Cons:**
- Increases overall complexity by introducing many new interfaces and classes
- Adding a new product type to the abstract factory interface forces changes across all concrete factories
- Can be overkill when there is only one product family or families rarely change

## 3. Relationships
- **Often confused with:** Factory Method -- Abstract Factory uses a set of factory methods internally, but it creates entire families rather than a single product; Factory Method is a single method, Abstract Factory is an object
- **Combines well with:** Singleton -- concrete factories are often singletons since only one instance per family is needed; Prototype -- factories can use prototyping internally to avoid subclassing for each product
- **Alternative to:** Builder -- when the construction focus is on step-by-step assembly of a complex object rather than returning complete family-consistent products immediately

## 4. Premature Use
- There is only one product family with no realistic prospect of adding another
- Product objects are unrelated and do not need cross-family consistency guarantees
- The number of product types changes frequently, making the abstract interface unstable and costly to maintain

## 5. Code Smell Triggers
- Conditional logic (switch/if-else) selects which concrete class to instantiate based on a configuration or environment value
- Client code creates related objects from multiple classes and manually ensures they belong to the same family
- Swapping a product family requires shotgun surgery: changes scattered across many files
- Concrete class names appear directly in client code, creating tight coupling to specific implementations
- Parallel class hierarchies exist for related products but lack a unified creation mechanism

## 6. Anti-Pattern Warnings
- Factory creates products that are unrelated and have no family consistency requirement -- this is misuse, not a family
- Abstract factory interface grows to dozens of creation methods, becoming a god factory -- split into smaller focused factories
- Concrete factories contain business logic beyond object creation -- factories should only create, not orchestrate
- Every new product type forces changes to all factory implementations, indicating the interface boundary was drawn too broadly
- Factory is used to create a single product type -- this is Factory Method, not Abstract Factory

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| AbstractFactory | Declares creation methods for each abstract product type | Yes |
| ConcreteFactory | Implements creation methods to produce products of a single family | Yes |
| AbstractProduct | Declares an interface for a type of product object | Yes |
| ConcreteProduct | Implements the abstract product interface for a specific family | Yes |
| Client | Uses only AbstractFactory and AbstractProduct interfaces | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Client | AbstractFactory | Depends on (for creation calls) | Yes |
| Client | AbstractProduct | Depends on (uses product interfaces) | Yes |
| ConcreteFactory | AbstractFactory | Implements | Yes |
| ConcreteProduct | AbstractProduct | Implements | Yes |
| ConcreteFactory | ConcreteProduct | Creates (instantiates) | Yes |
| Client | ConcreteFactory | Must not reference directly | Yes |
| Client | ConcreteProduct | Must not reference directly | Yes |
