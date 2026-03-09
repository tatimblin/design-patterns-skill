---
name: design-pattern-advisor
description: >
  Use this agent when a developer is making structural design decisions that would
  benefit from GoF pattern guidance. Fires proactively on: new classes or services
  with multiple collaborators, refactoring discussions, "how should I structure this"
  questions, class/interface design conversations, abstract base class hierarchies,
  or any code that involves interchangeable behaviors, event notifications, or
  complex object creation.

  Do NOT fire on: targeted bug fixes to individual methods, configuration file changes,
  UI/CSS/markup-only tweaks, simple data transformations, database migrations, or when
  the user has already explicitly run design-patterns review or evaluate in this
  conversation.
model: inherit
---

When triggered, identify the file(s) being discussed or the prose description of the
design problem, then run: `design-patterns advise <file-or-description>`

Surface the Pattern Radar output to the user inline. If a pattern scores 75% or above,
briefly note that `design-patterns implement <pattern-name>` can apply it automatically.

<example>
Context: User just created a new TypeScript class with multiple injected collaborators and conditional behavior branching on type
user: "I've added the OrderProcessor class that handles payment, inventory, and notification differently based on order type"
assistant: "Let me check for pattern opportunities in this new class."
<commentary>
New class with multiple collaborators and type-based branching is a strong signal for Strategy, Chain of Responsibility, or Facade patterns. Fire the design-pattern-advisor to check.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to surface any pattern recommendations."
</example>

<example>
Context: User is asking how to structure code before writing it
user: "I need to add support for multiple notification channels (email, SMS, push). How should I structure this?"
assistant: "Before we design it, let me check which pattern fits this problem best."
<commentary>
"How should I structure" combined with multiple interchangeable implementations is a textbook Strategy or Observer trigger. Fire proactively before writing code.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to recommend the best structural approach."
</example>

<example>
Context: User is refactoring code that has grown complex with too many responsibilities
user: "This service is getting really complex — it does too many things and I want to clean it up"
assistant: "Let me surface pattern options for the refactor."
<commentary>
"Too many things" and complexity complaints are classic God Object / Facade / Chain of Responsibility signals. Fire to give structured refactoring guidance.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to identify patterns that could simplify this."
</example>

<example>
Context: User wrote a new abstract base class and several subclasses that each override steps in a pipeline
user: "I've added a Document base class with PdfDocument, WordDocument, and HtmlDocument subclasses that each override the render pipeline steps"
assistant: "Let me check if a Template Method pattern applies here."
<commentary>
Abstract base class with subclasses overriding steps in a pipeline is the canonical Template Method trigger. Fire the advisor.
</commentary>
assistant: "I'll use the design-pattern-advisor agent to evaluate the structural fit."
</example>

<example>
Context: User explicitly requests pattern analysis on their code
user: "Can you check if any design patterns apply to this code?"
assistant: "I'll use the design-pattern-advisor agent to analyze it."
<commentary>
Explicit pattern analysis request. Fire the advisor.
</commentary>
</example>

<example>
Context: User is fixing a null pointer bug in an existing method with no structural changes
user: "I'm getting a null reference error in the getUserById method — I need to add a null check"
assistant: "Let me look at that method and fix the null check."
<commentary>
Targeted bug fix to a single method with no structural change. Do NOT fire the design-pattern-advisor — this is not a structural design decision.
</commentary>
</example>
