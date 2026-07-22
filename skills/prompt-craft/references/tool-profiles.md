# Tool Profiles

Curated, not exhaustive — these cover real recurring targets. For anything else, use "Unknown Tool" below and actually ask its four questions; don't skip to a generic one-liner because nothing matched.

## Generic LLM / another Claude session
Ask only what's missing: role/persona if any, exact output format, and one concrete example of a good vs. bad response if the task is subjective (tone, style judgment). Put constraints in the first third of the prompt, not buried at the end — models weight early context more heavily.

## Image Generation (Midjourney / Stable Diffusion / similar — key art, covers)
Ask: subject + action, medium/style (photoreal, painterly, specific artist-adjacent style), composition/framing, lighting/mood, aspect ratio, and negative constraints (what to avoid). For a series (e.g. recurring key art for the same project), ask once whether there's a style bible to stay consistent with, then reuse it silently for the rest of that series' prompts instead of re-asking.

## Unknown Tool — the fingerprint, actually asked (not just documented)
Ask these four, one at a time, before drafting anything:
1. **Interface type** — chat/conversational, single structured input, or code/API call?
2. **Input modality** — text only, or does it accept image/audio/file references?
3. **Output modality** — text, image, audio, video, or structured data?
4. **Autonomy level** — one-shot single response, or does it act over multiple steps/tool calls on its own?

These four answers decide interview depth and output shape. Don't force-fit one of the profiles above just because it's convenient — if it doesn't genuinely match, this fallback is the honest path, not a corner to cut.
