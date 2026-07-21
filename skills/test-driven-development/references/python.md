# TDD Python — pytest, unittest

Use these stack-specific conventions when implementing or debugging Python backend code.

## Conventions

* **Unit/Integration tests**: `pytest` (preferred) or `unittest`. Use fixtures for setup/teardown.
* **Test command**:
  - Run single test: `pytest path/to/test_file.py::test_function_name`
  - Run full suite: `pytest`
* **Typecheck**: `mypy .` or linters like `flake8` — run regularly.
* **Naming**: `test_should_[behavior]_when_[condition]` or `test_[behavior]_[condition]`
* **No test pollution**: Use database cleanups (transaction rollbacks) and reset mock objects between tests.
