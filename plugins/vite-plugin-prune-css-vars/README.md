# vite-plugin-prune-css-vars

A Vite development plugin that removes unused CSS custom properties from compiled stylesheets by analysing how Sass aliases are used throughout the project.

The plugin exists to solve a problem that PurgeCSS cannot: determining which CSS variables are actually reachable from the Sass variables used by the application.

---

# Motivation

This plugin was written to support a large design token system built around CSS custom properties and Sass aliases.

Example:

```scss
:root {
	--spacing-4: 1rem;
	--height-4: var(--spacing-4);
	--comp-size-l: var(--height-4);
}

$spacing-4: var(--spacing-4);
$height-4: var(--height-4);
$comp-size-l: var(--comp-size-l);
```

Components never reference CSS variables directly.

Instead they consume Sass aliases.

```scss
.button {
	height: $comp-size-l;
}
```

After Sass compilation the browser only sees:

```css
.button {
	height: var(--comp-size-l);
}
```

Unfortunately PurgeCSS only knows that `--comp-size-l` is used.

It has no understanding that

```
--comp-size-l
        │
        ▼
--height-4
        │
        ▼
--spacing-4
```

must all remain.

Without dependency analysis, intermediate variables are removed and the remaining variables become invalid.

This plugin solves that problem.

---

# Design Goals

The implementation follows a few simple principles.

- Development only.
- Zero runtime cost.
- Analyse source code instead of compiled CSS.
- Preserve dependency chains.
- Optimise for simplicity over micro-optimisations.
- Avoid caches unless profiling proves they are beneficial.
- Small, composable modules with a single responsibility.

---

# How It Works

The plugin analyses the project before pruning CSS variables.

```
Project
    │
    ▼
scanFiles()
    │
    ▼
buildAliasMap()
    │
    ▼
collectUsedVariables()
    │
    ▼
transform()
    │
    ▼
pruneUnusedVariables()
```

## 1. Scan the project

Every `.scss`, `.sass` and `.svelte` file is read.

No parsing happens at this stage.

The result is simply:

```ts
[
	{
		file: '...',
		source: '...'
	}
];
```

---

## 2. Build the alias map

Alias definitions are extracted.

Example:

```scss
$foo: var(--foo);
$bar: var(--bar);
```

becomes

```
foo → --foo
bar → --bar
```

Files containing alias definitions are remembered so they are not scanned for usages.

---

## 3. Collect used variables

Every remaining source file is scanned for Sass variables.

Example

```scss
.button {
	color: $foo;
}
```

becomes

```
Used CSS variables

--foo
```

Only the CSS custom properties are stored.

---

## 4. Transform CSS

Whenever Vite transforms a stylesheet containing custom properties

```css
:root {
	--foo: red;
	--bar: blue;
}
```

the plugin determines which variables are reachable.

Unused variables are removed before the stylesheet continues through Vite.

---

# Dependency Graph

The plugin constructs a dependency graph from CSS variables.

Example

```css
--comp-size-l: var(--height-4);
--height-4: var(--spacing-4);
--spacing-4: 1rem;
```

becomes

```
--comp-size-l
        │
        ▼
--height-4
        │
        ▼
--spacing-4
```

The graph is traversed using an iterative depth-first search.

If

```
--comp-size-l
```

is used,

then

```
--height-4
```

and

```
--spacing-4
```

are automatically preserved.

Circular references are also handled correctly.

---

# Plugin Lifecycle

```
Vite starts

      │

      ▼

dirty = true

      │

      ▼

analyseProject()

      │

      ▼

used variables computed

      │

      ▼

transform()

      │

      ▼

unused variables removed

      │

      ▼

HMR update

      │

      ▼

dirty = true

      │

      ▼

next transform triggers a new analysis
```

The project is only analysed when required.

Multiple transforms during the same update reuse the previous analysis.

---

# Project Structure

```
analysis.ts
```

Coordinates the analysis pipeline.

Responsibilities:

- Scan project files.
- Build alias map.
- Collect used variables.

---

```
scanner.ts
```

Reads project source files.

Responsibilities:

- Resolve include/exclude globs.
- Read file contents.

No parsing occurs here.

---

```
parser.ts
```

Parses Sass source.

Responsibilities:

- Build alias map.
- Identify alias definition files.
- Collect used CSS variables.

---

```
graph.ts
```

Builds and traverses dependency graphs.

Responsibilities:

- Parse CSS variable dependencies.
- Expand reachable variables.

---

```
pruner.ts
```

Prunes unused CSS custom properties.

Responsibilities:

- Parse CSS.
- Compute reachable variables.
- Remove unused declarations.

---

```
utils.ts
```

Shared helper utilities.

Currently contains preservation logic.

---

```
index.ts
```

Vite integration.

Responsibilities:

- Handle HMR.
- Trigger analysis.
- Transform stylesheets.

---

# Usage

```ts
import pruneCssVars from './plugins/vite-plugin-prune-css-vars';

pruneCssVars({
	debug: true
});
```

The plugin should only run during development.

---

# Options

| Option     | Default                               | Description                             |
| ---------- | ------------------------------------- | --------------------------------------- |
| `include`  | `src/**/*.{scss,sass,svelte}`         | Files analysed by the plugin.           |
| `exclude`  | `node_modules`, `.svelte-kit`, `dist` | Files ignored during analysis.          |
| `preserve` | `[]`                                  | Variables that should never be removed. |
| `debug`    | `false`                               | Prints analysis timing information.     |

---

# Development

Run the development server.

```bash
pnpm dev
```

Run the test suite.

```bash
pnpm test
```

The plugin only runs while the Vite development server is active.

Production builds are unaffected.

---

# Automated Tests

The project currently contains tests covering:

- Preservation rules.
- Alias parsing.
- Alias usage detection.
- Dependency graph traversal.
- Circular dependencies.
- Branching dependency graphs.
- CSS pruning.
- Preserve rules.
- Responsive declarations.
- End-to-end project analysis.

These tests exist primarily to protect future refactoring.

---

# Limitations

The plugin assumes Sass aliases follow this format:

```scss
$foo: var(--foo);
```

Other alias styles are ignored.

The plugin analyses static source files.

It does not evaluate Sass functions or runtime-generated variable names.

The plugin only removes unused CSS custom properties.

Unused Sass variables are intentionally left untouched.

The plugin is designed for development.

Production optimisation should continue to be handled by PurgeCSS or similar tooling.

---

# Lessons Learned

Several implementation ideas were explored and ultimately discarded.

## AST caching

Initially the plugin cached parsed PostCSS trees.

Although technically correct, the added complexity produced almost no measurable performance improvement.

The implementation is now simpler and reparses stylesheets when required.

---

## Dependency expansion

The original implementation only preserved directly referenced variables.

This failed for hierarchical token systems.

Building a dependency graph proved significantly simpler and more reliable.

---

## HMR

Invalidating Vite modules manually introduced unnecessary complexity.

A simple `dirty` flag combined with lazy reanalysis produced the same behaviour with much less code.

---

## Testing

Automated tests immediately caught a regression introduced during cleanup.

Although the bug was only a few lines long, it caused every file to become an alias definition file, resulting in zero detected usages.

The test suite paid for itself before the plugin was finished.

---

## Simplicity

Several opportunities for optimisation were deliberately rejected.

The plugin favours code that is easy to understand over code that is marginally faster.

Most operations occur only during development, making maintainability the higher priority.

---

# Future Ideas

Potential future improvements include:

- Incremental project analysis.
- File dependency graph.
- Alias diagnostics.
- Analysis statistics.
- CLI interface.
- Source map support.
- Visual dependency graph generation.

These ideas are intentionally deferred until a real need emerges.

Premature optimisation has repeatedly proven less valuable than maintaining a simple, understandable implementation.
