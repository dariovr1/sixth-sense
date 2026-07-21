---
name: crossroad-stack
description: Use before applying test-driven-development, diagnosing-bugs, or requesting-code-review to detect whether the task targets Java/Spring Boot backend, Angular, React, Next.js, Python, or other stacks, and route to the correct conventions.
---

# Crossroad Stack — Router Frontend/Backend

## Detection Logic
Before applying any engineering skill, identify the stack from the files involved:

### Java / Spring Boot Backend
Trigger indicators: `.java` files, `build.gradle`, `build.gradle.kts`, `src/main/java`, `application.yml`, `application.properties`, `pom.xml`.

Apply:
- **Testing**: JUnit 5 + Testcontainers (see `test-driven-development` skill, [references/java.md](../test-driven-development/references/java.md))
- **Build/Typecheck**: `./gradlew build`, `./gradlew compileJava`
- **Debugging**: Java stack traces, Spring context, bean wiring (skill `diagnosing-bugs`)
- **Conventions**: package-by-feature, constructor injection, record DTO, Virtual Threads

### Frontend (Angular / React / Next.js / HTML / CSS / TS / JS)
Trigger indicators: `.ts`, `.tsx`, `.js`, `.jsx`, `.html` templates, `.css`/`.scss`/`.tailwind` stylesheets, `angular.json`, `tsconfig.json`, `package.json`, `next.config.js`, `vite.config.ts`.

Apply:
- **Testing**: Jasmine/Karma, Jest, or Vitest (see `test-driven-development` skill, [references/angular.md](../test-driven-development/references/angular.md) or [references/react.md](../test-driven-development/references/react.md))
- **Build/Typecheck**: `npm run build`, `ng build`, `npx tsc --noEmit`
- **Debugging**: Browser console, Component lifecycle, State managers, React/Next rendering hook logs
- **Conventions**: standalone components, signals/hooks, lazy loading, OnPush, functional components

### Python Backend
Trigger indicators: `.py` files, `requirements.txt`, `pyproject.toml`, `Pipfile`, `setup.py`.

Apply:
- **Testing**: pytest or unittest (see `test-driven-development` skill, [references/python.md](../test-driven-development/references/python.md))
- **Build/Typecheck**: `mypy .`
- **Debugging**: python tracebacks, logging, pdb (skill `diagnosing-bugs`)
- **Conventions**: PEP 8, type hints, virtual environments (venv/poetry)

### Mixed Task
If a task spans multiple stacks, apply the relevant conventions to each file and layer independently.
