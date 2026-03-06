# Answer Key

## order-notifications — Observer

- **Category**: No pattern
- **Expected pattern**: Observer
- **Rationale**: `OrderService` is tightly coupled to every notification channel — adding a new listener means editing the core class. The Observer pattern would let `OrderService` publish an event that independent subscribers (email, SMS, analytics) react to, eliminating direct dependencies.

## payment-processing — Strategy

- **Category**: No pattern
- **Expected pattern**: Strategy
- **Rationale**: `PaymentProcessor` uses a growing `if/else` chain to select payment logic at runtime. Each branch encapsulates a distinct algorithm. The Strategy pattern would extract each payment method into its own class behind a common interface, making the processor open for extension without modification.

## document-export — Factory Method

- **Category**: No pattern
- **Expected pattern**: Factory Method
- **Rationale**: `DocumentExporter.export()` uses a switch to build structurally different artifacts (PDF, HTML, Markdown) inline. Each branch assembles a distinct object with its own construction steps. The Factory Method pattern would delegate creation to format-specific subclasses, isolating each format's assembly logic.

## ui-theme-components — Abstract Factory

- **Category**: Wrong pattern (individual factories)
- **Expected pattern**: Abstract Factory
- **Rationale**: Three standalone factory functions each duplicate theme-switching logic independently, and nothing prevents mixing a dark button with a light checkbox. The Abstract Factory pattern would group component creation into cohesive theme families, guaranteeing that all widgets in a view share the same theme.

## user-profile — Builder

- **Category**: No pattern
- **Expected pattern**: Builder
- **Rationale**: `UserProfile` has an 8-parameter constructor where most fields are optional, forcing callers to pass `null` placeholders. This is the classic telescoping constructor problem. The Builder pattern would provide a fluent API that sets only the fields needed and constructs a valid profile at the end.

## shape-editor — Prototype

- **Category**: Correct pattern
- **Expected pattern**: Prototype
- **Rationale**: `Circle` and `Rectangle` implement `clone()`, and a registry maps names to pre-configured templates. New shapes are created by cloning a prototype and adjusting position. This is a textbook Prototype implementation — the skill should validate it.

## weather-dashboard — Adapter

- **Category**: No pattern
- **Expected pattern**: Adapter
- **Rationale**: Two weather APIs return incompatible formats (`temp_f`/`wind_mph` vs `temperature_celsius`/`wind_kmh`), and the dashboard converts each response inline with scattered arithmetic. The Adapter pattern would wrap each API behind a common `WeatherData` interface, centralizing conversion and making it trivial to add new sources.

## alert-dispatch — Bridge

- **Category**: Wrong pattern (inheritance explosion)
- **Expected pattern**: Bridge
- **Rationale**: Notification type (Alert, Reminder) crossed with delivery channel (Email, SMS) produces four leaf classes with near-identical `send()` bodies. Adding a new type or channel requires N new classes. The Bridge pattern would separate the two dimensions — notification type and channel — into independent hierarchies composed at runtime.

## home-automation — Facade

- **Category**: Correct pattern
- **Expected pattern**: Facade
- **Rationale**: `SmartHome` wraps four complex subsystems (`Lights`, `Thermostat`, `SecuritySystem`, `MusicPlayer`) behind simple high-level methods like `goodMorning()` and `leaveHome()`. This is a clean Facade — the skill should validate it.
