# Testing Anti-Patterns

Load this when writing/changing tests, adding mocks, or tempted to add a test-only method to production code.

**Core principle:** test what the code does, not what the mock does.

| Anti-pattern | The violation | The fix |
|---|---|---|
| Testing mock behavior | Asserting on a mock's presence/return value instead of real output | Don't mock the thing under test, or assert on the real component's behavior |
| Test-only methods in production | A method like `destroy()`/`reset()` exists only for `afterEach` cleanup | Move it to test utilities; production classes don't carry test-only API surface |
| Mocking without understanding | Mocking a dependency whose side effect the test actually relies on (e.g. a config write) | Before mocking anything, ask what side effects the real method has and whether the test depends on them — mock at the lowest level that preserves them |
| Incomplete mocks | Mock object has only the fields the immediate test happens to use | Mirror the real response/object shape completely — partial mocks hide structural assumptions and pass while integration fails |
| Tests as afterthought | Code shipped, "tests to follow" | TDD means the test exists before the code; there is no "later" |

**Gate before mocking anything:** what does the real method do, does this test depend on any of that, do I understand the dependency well enough to mock only the slow/external part? If unsure, run the real implementation once and observe before adding any mock.

**Gate before adding a method to a production class:** is this method only ever called by tests? If yes, it belongs in test utilities, not here. Does this class actually own the resource/lifecycle the method manages? If no, it's on the wrong class regardless of who calls it.

**Warning signs a mock has gone too far:** mock setup longer than the test body itself, mocking everything "to be safe," the mock is missing methods the real object has, the test breaks the moment the mock changes shape.
