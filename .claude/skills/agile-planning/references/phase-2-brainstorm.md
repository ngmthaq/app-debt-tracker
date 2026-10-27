# Phase 2 — Brainstorm

Make the input clear with the user before you split anything. Brainstorming is a two-way talk.

## 2a. Ask clarifying questions first

Check if the input answers all of these questions. If not, **ask the user**. Do not make up answers:

- Who are the users (personas)?
- What problem or business need does this solve?
- What result or metric should get better?
- Are there known limits (deadline, compliance, platform, existing product areas)?
- Is anything clearly out of scope?
- For a `user story`: are the acceptance criteria clear?

**STOP and wait** until the user answers every question. If the answers bring new questions, ask again.

## 2b. Look at the codebase (read-only)

If the work changes an existing product, look at the code to learn the affected areas: pages, modules, APIs, and data. Use real paths. Do not make up files. Never edit files.

You need these facts in Phase 3 to write real tasks, and in Phase 4 to estimate.

## 2c. Write the analysis

Show this summary. Then ask for approval before Phase 3:

```md
## 📋 Analysis

**Title:** <title>
**Type:** epic | user story

### Problem

<3–5 sentences: the user problem or business need>

### Desired Outcome

<what success looks like, and which metrics should get better>

### Target Users / Personas

<who this is for, and what each persona wants to do>

### Scope

<bullet list of what is in scope. Write it as value for users>

### Out of Scope / Assumptions

<bullet list of assumptions, and things clearly left out>

### Constraints

<non-functional limits: performance, security, accessibility, data privacy, compliance, platform, deadline>

### Affected Areas in the Codebase

<real paths or modules from 2b, or "new product area — no code yet">

### Risks / Open Questions

<anything still unclear, and who must answer it>
```

Then ask: _"Is this analysis correct? Anything to fix before I break down the work?"_

Do not go to Phase 3 while any open question is still open.
