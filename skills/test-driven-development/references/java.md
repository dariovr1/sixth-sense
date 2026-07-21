# TDD Java — Spring Boot, Gradle, JUnit 5

Use these stack-specific conventions when implementing or debugging Java backend code.

## Conventions

* **Unit tests**: JUnit 5 + Mockito. Use `@ExtendWith(MockitoExtension.class)`. Prefer constructor injection for testability.
* **Integration tests**: `@SpringBootTest` + Testcontainers for real database/messaging dependencies. Tag with `@Tag("integration")`.
* **Test command**:
  - Run single test: `./gradlew test --tests "PackageName.ClassName.testMethodName"`
  - Run full suite: `./gradlew test` (unit), `./gradlew test -PincludeTags=integration` (integration)
* **Typecheck**: `./gradlew compileJava compileTestJava` — run regularly between cycles.
* **Naming**: `should_[behavior]_when_[condition]` — e.g. `should_return_404_when_user_not_found`.
* **No test pollution**: Every test is independent. No shared state between tests. Use `@BeforeEach` for setup.
