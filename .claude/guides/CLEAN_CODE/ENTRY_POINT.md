# Clean Code

Use this guide when writing, reviewing, or refactoring code. The detailed patterns live in the other files in this folder. This keeps the main guide short and lets you reuse each guide.

## How to Use This Guide

1. Find the type of work (context) in the table below.
2. Load the linked references in the listed order.
3. Use more than one reference when the task covers many layers or coding styles.

---

## Four contexts and their load order

| Context                      | Apply in order                                      |
| ---------------------------- | --------------------------------------------------- |
| OOP Languages                | SOLID → Separation of Concerns → DRY                |
| Functional / General-Purpose | Separation of Concerns → DRY → KISS                 |
| UI / Component Development   | Atomic Design → Separation of Concerns → DRY → KISS |
| Backend / API                | SOLID → Separation of Concerns → DRY → KISS         |

---

## Reference Index

- [SOLID](./SOLID.md)
- [DRY](./DRY.md)
- [KISS](./KISS.md)
- [Atomic Design](./ATOMIC_DESIGN.md)
- [Separation of Concerns](./SEPARATION_OF_CONCERNS.md)

---

## Universal Rules

These rules always apply, in every context and principle:

1. **Name things after what they do.** If a name needs "and" or "or", the thing does too much.
2. **Test business logic on its own.** It must not need a DB, HTTP, or a UI framework.
3. **Flag violations by principle name** in reviews: "SRP violation", "DRY violation", "KISS violation", etc.
4. **Don't abstract too early.** Only extract shared code after the same code shows up at least twice.
5. **Cross-cutting concerns** (logic used in many places, like auth, logging, validation) belong in middleware/decorators — never inline.
