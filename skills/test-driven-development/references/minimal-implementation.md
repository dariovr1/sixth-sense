# Minimal Implementation Ladder

Ladder adapted from [ponytail](https://github.com/DietrichGebert/ponytail) (DietrichGebert, MIT License).

Before writing code for the GREEN step, stop at the first rung that holds — don't skip ahead, don't default to the bottom rung out of habit:

1. **Does this need to exist?** If the test can pass without adding anything (YAGNI), don't add it.
2. **Already in this codebase?** Reuse it, don't rewrite it.
3. **Does the standard library do it?** Use it instead of hand-rolling it.
4. **Is it a native platform/language feature?** Use it instead of a library or helper.
5. **Is it an already-installed dependency?** Use it instead of adding a new one or reimplementing it.
6. **Does it fit in one line?** Write the one line.
7. **Only then**: write the minimum new code that makes the test pass.

The ladder runs *after* you understand the problem, not instead of it — read the code the change touches and trace the real flow before picking a rung. Skipping straight to rung 7 out of habit is the same mistake as skipping straight to writing all the tests first: it defeats the point of doing this one step at a time.

## Never Simplify Away
Being lazy about code volume is not the same as being lazy about correctness. These stay, even if nothing in the current test forces them yet:
- Input validation at trust boundaries
- Error handling that prevents data loss
- Security checks
- Basic accessibility
- The user's explicit requests
- Root-cause fixes for bugs — not a patch over the symptom

## Hard Rules
- No abstraction with only one implementation — wait for the second caller.
- No scaffolding "for later" — if the test doesn't need it now, it doesn't exist yet.
- When a rung's answer is ambiguous, prefer deleting code over adding it.
- Of the correct options, the smallest diff wins.
- If you deliberately cut a corner to stay minimal, mark it with a one-line comment naming the trade-off and when to revisit — don't let it look accidental.
