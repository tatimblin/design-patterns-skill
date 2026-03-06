# Chain of Responsibility

## 1. Applicability
- More than one object may handle a request, and the handler is not known in advance
- A request should be passed along a chain of potential handlers until one processes it
- The set of handlers and their order need to be configured dynamically at runtime
- You want to decouple the sender of a request from the specific object that handles it
- Processing logic is organized as a pipeline where each step may transform, filter, or short-circuit

## 2. Pros/Cons
**Pros:** Decouples sender from receiver -- the client does not need to know which object handles the request; handler ordering and composition can be reconfigured at runtime; satisfies Single Responsibility Principle by isolating each handling concern into its own class; satisfies Open/Closed Principle -- new handlers can be added without modifying existing ones

**Cons:** A request may reach the end of the chain with no handler processing it, leading to silent failures; debugging is harder because the path through the chain is determined at runtime; each additional handler adds latency, which can matter in performance-sensitive paths; long chains can be difficult to reason about when handler order is significant

## 3. Relationships
- **Often confused with:** Decorator -- both compose objects in a chain, but Decorator always forwards and augments behavior while Chain of Responsibility may stop forwarding once a handler processes the request
- **Often confused with:** Command -- both decouple sender from receiver, but Command binds a request to a specific invoker while Chain of Responsibility routes it through candidates
- **Combines well with:** Composite -- handlers can be organized as a tree where a request propagates from child to parent (as in UI event bubbling)
- **Combines well with:** Command -- each handler can wrap its processing as a Command for undo/logging capabilities
- **Alternative to:** Large conditional dispatcher (switch/if-else) -- when the branching logic for selecting a handler becomes complex or changes frequently

## 4. Premature Use
- Only one or two handlers exist and the routing logic is trivial -- a direct call or simple conditional is clearer
- The handler for every request type is known at compile time and will not change
- Adding chain infrastructure costs more complexity than the conditional it replaces
- The processing order is irrelevant and all handlers must execute -- a simple list iteration suffices

## 5. Code Smell Triggers
- A method contains a long if/else or switch chain that dispatches to different processing logic based on request type or attributes
- Adding a new processing rule requires modifying an existing monolithic handler function
- Multiple objects could handle a request but the sender hard-codes which one to call
- Validation, authorization, and transformation logic are tangled in a single function
- UI or middleware components pass events up a hierarchy with ad-hoc forwarding logic

## 6. Anti-Pattern Warnings
- Chain with no fallback or default handler, causing unhandled requests to vanish silently
- Handlers that are tightly coupled to each other or assume a specific chain order, defeating the pattern's flexibility
- Circular chains where handlers inadvertently forward back to an earlier handler, causing infinite loops
- Using the pattern for mandatory multi-step processing where every handler must run -- Decorator or Pipeline is more appropriate
- Excessively long chains that degrade performance and make tracing a request's path impractical

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| Handler | Declares the interface for handling requests and optionally defines the successor link | Yes |
| BaseHandler | Abstract class that implements default chaining behavior (forwarding to the next handler) | No |
| ConcreteHandler | Handles requests it is responsible for; forwards unhandled requests to the next handler | Yes |
| Client | Composes the chain and submits requests to the first handler in the chain | No |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| ConcreteHandler | Handler | Implements | Yes |
| ConcreteHandler | BaseHandler | Extends (inherits default chaining) | No |
| Handler | Handler | References next (successor link) | Yes |
| Client | Handler | Sends request to first handler in chain | No |
| Client | ConcreteHandler | Assembles chain by linking handlers | No |
