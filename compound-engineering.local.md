---
review_agents:
  - design-pattern-advisor
---

## Design Patterns Review Context

When running the `design-pattern-advisor` agent, focus on:
- New classes and services added or significantly modified by the PR
- Code that shows signs of structural complexity (multiple conditionals, God objects, tight coupling)

Ignore: configuration files, migrations, test fixtures, and trivial getter/setter code

---

Note: this file is specific to the compound-engineering plugin (`ce:review`, `ce:work`).
The design-pattern-advisor agent works without this file — copy `.claude/agents/design-pattern-advisor.md`
into any project to enable standalone proactive analysis.
