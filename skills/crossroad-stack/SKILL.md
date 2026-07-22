---
name: crossroad-stack
description: Use before applying test-driven-development, diagnosing-bugs, or requesting-code-review to detect whether the task targets Java/Spring Boot backend, Angular, React, Next.js, Python, or other stacks, and route to the correct conventions.
---

# Crossroad Stack — Router Frontend/Backend

## Detection Logic
Before applying any engineering skill, identify the stack from the files involved. Where a task matches more than one section's trigger indicators (e.g. a Python project with a GUI import matches both Python Backend and Python Desktop/GUI), the more specific section wins — Python Desktop/GUI overrides Python Backend, not the other way around.

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

### Python Desktop/GUI
Trigger indicators: same as Python Backend, plus a GUI framework import (`tkinter`, `PyQt`/`PySide`, `customtkinter`, `kivy`) or an OS-level GUI dependency (`pystray`, `pywin32` GUI calls, screen/overlay/window-capture APIs).

Apply:
- **Testing**: same as Python Backend (pytest/unittest), plus [references/python.md](../test-driven-development/references/python.md) — automated tests cover logic, not rendering.
- **Human visual verification required before "done"**: automated tests passing does not prove the UI renders correctly (layout, DPI scaling, overlay positioning, tray icon behavior). Launch the app and visually confirm the change before marking the task complete — see `test-driven-development`'s "Before Calling a Cycle Done" checklist.
- **Build/Typecheck**: `mypy .`, plus a packaged-build smoke test when the change touches packaging (PyInstaller hidden-imports for GUI backends are a known failure class — verify the built exe, not just `python main.py`).
- **Debugging**: python tracebacks, logging, pdb (skill `diagnosing-bugs`) — plus DPI-awareness and screen-coordinate bugs are a known class on Windows, worth checking first.

### Mixed Task
If a task spans multiple stacks, apply the relevant conventions to each file and layer independently.
