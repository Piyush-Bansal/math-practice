import { describe, expect, it } from 'vitest';

import { pruneUnusedVariables } from '../pruner';

describe('pruneUnusedVariables', () => {
	it('keeps used variables', () => {
		const css = `
			:root {
				--foo: red;
				--bar: blue;
			}
		`;

		const result = pruneUnusedVariables(css, new Set(['--foo']));

		expect(result).toContain('--foo');
		expect(result).not.toContain('--bar');
	});

	it('keeps dependency chains', () => {
		const css = `
			:root {
				--a: var(--b);
				--b: var(--c);
				--c: red;
				--unused: blue;
			}
		`;

		const result = pruneUnusedVariables(css, new Set(['--a']));

		expect(result).toContain('--a');
		expect(result).toContain('--b');
		expect(result).toContain('--c');
		expect(result).not.toContain('--unused');
	});

	it('preserves explicitly preserved variables', () => {
		const css = `
			:root {
				--foo: red;
				--bar: blue;
			}
		`;

		const result = pruneUnusedVariables(css, new Set(), ['--bar']);

		expect(result).not.toContain('--foo');
		expect(result).toContain('--bar');
	});

	it('supports regex preserve rules', () => {
		const css = `
			:root {
				--spacing-1: 4px;
				--spacing-2: 8px;
				--color: red;
			}
		`;

		const result = pruneUnusedVariables(css, new Set(), [/^--spacing-/]);

		expect(result).toContain('--spacing-1');
		expect(result).toContain('--spacing-2');
		expect(result).not.toContain('--color');
	});

	it('removes all unused variables', () => {
		const css = `
			:root {
				--foo: red;
				--bar: blue;
			}
		`;

		const result = pruneUnusedVariables(css, new Set());

		expect(result).not.toContain('--foo');
		expect(result).not.toContain('--bar');
	});

	it('returns css unchanged when no custom properties exist', () => {
		const css = `
			body {
				color: red;
			}
		`;

		expect(pruneUnusedVariables(css, new Set())).toBe(css);
	});

	it('keeps duplicate declarations across media queries', () => {
		const css = `
			:root {
				--bg: red;
			}

			@media (max-width: 768px) {
				:root {
					--bg: blue;
				}
			}
		`;

		const result = pruneUnusedVariables(css, new Set(['--bg']));

		expect(result.match(/--bg/g)?.length).toBe(2);
	});
});
