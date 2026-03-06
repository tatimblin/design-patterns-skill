# Proxy

## 1. Applicability
- **Lazy initialization (virtual proxy):** Defer creation of a heavyweight object until it is actually needed, rather than eagerly at startup.
- **Access control (protection proxy):** Allow only clients with specific credentials or roles to use the real service object.
- **Remote service access (remote proxy):** Represent an object that lives in a different address space, process, or network location.
- **Logging / caching (smart reference):** Intercept requests to perform bookkeeping such as request logging, result caching, or reference counting before forwarding to the real object.

## 2. Pros/Cons
**Pros:**
- Controls access to the service object without clients knowing.
- Works even if the service object is not yet ready or available.
- Introduces new proxies without changing the service or clients (Open/Closed Principle).
- Can manage the lifecycle of the service object independently of the client.

**Cons:**
- Adds an extra layer of indirection, which increases latency.
- Complicates the codebase with additional classes that mirror the service interface.
- Proxy logic can become a hidden dumping ground for cross-cutting concerns, obscuring responsibility.

## 3. Relationships
- **Often confused with:** **Decorator** — both wrap an object behind the same interface, but Proxy manages the lifecycle or access of its subject, whereas Decorator adds behaviour. **Facade** — Facade simplifies a complex subsystem interface; Proxy controls access to a single object with an identical interface.
- **Combines well with:** **Adapter** — an Adapter can change the interface of a remote object while a Proxy controls access to it. **Decorator** — a Proxy can be layered with Decorators when both access control and extra behaviour are needed.
- **Alternative to:** **Facade** — when the goal is merely to simplify rather than control access. **Decorator** — when the goal is to enrich behaviour rather than manage lifecycle or permissions.

## 4. Premature Use
- Wrapping a lightweight, always-available object in a proxy adds complexity with no performance or safety benefit.
- Introducing a caching proxy before profiling confirms that object creation or network calls are an actual bottleneck.
- Using a protection proxy when the runtime already provides adequate access control (e.g., module visibility, framework-level authentication).

## 5. Code Smell Triggers
- Repeated null-checks or "is initialized?" guards scattered across client code before using a heavy resource.
- Multiple callers duplicating the same access-control or permission logic around a shared service.
- Clients manually caching results returned by a service object instead of centralizing the cache.
- Direct remote calls (network, IPC) embedded in business logic rather than hidden behind an abstraction.
- Frequent lazy-loading boilerplate duplicated across different call sites for the same object.

## 6. Anti-Pattern Warnings
- **God proxy:** Packing logging, caching, access control, and lazy init into a single proxy class violates Single Responsibility — split into separate, composable proxies.
- **Interface drift:** Letting the proxy's interface diverge from the real subject breaks substitutability and forces clients to know which implementation they hold.
- **Hidden side-effects:** A proxy that silently transforms requests or responses (beyond its stated purpose) surprises callers and makes debugging difficult.
- **Deep proxy chains:** Stacking multiple proxies without clear tracing leads to opaque call paths and hard-to-diagnose latency.
- **Over-isolation:** Using a remote proxy as a premature distribution boundary can introduce network failure modes that a simple in-process call would avoid.

## 7. Structural Characteristics

### Participant Roles
| Role | Description | Required |
|------|-------------|----------|
| ServiceInterface | Declares the interface shared by the RealService and Proxy so they are interchangeable. | Yes |
| RealService | Contains the core business logic that the proxy controls access to. | Yes |
| Proxy | Holds a reference to the RealService; intercepts client requests, performs its control logic, then delegates to the RealService. | Yes |
| Client | Works with the ServiceInterface, unaware whether it holds a Proxy or the RealService. | Yes |

### Relationships
| From | To | Type | Required |
|------|-----|------|----------|
| Proxy | ServiceInterface | implements | Yes |
| RealService | ServiceInterface | implements | Yes |
| Proxy | RealService | delegates to (has-a) | Yes |
| Client | ServiceInterface | depends on | Yes |
