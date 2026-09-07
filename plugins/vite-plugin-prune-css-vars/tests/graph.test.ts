import { describe, expect, it } from 'vitest';
import postcss from 'postcss';

import { buildReachableVariables } from '../graph';

describe('buildReachableVariables', () => {
	it('returns directly used variables', () => {
		const root = postcss.parse(`
			:root {
				--foo: red;
				--bar: blue;
			}
		`);

		const reachable = buildReachableVariables(root, new Set(['--foo']));

		expect(reachable).toEqual(new Set(['--foo']));
	});

	it('follows a dependency chain', () => {
		const root = postcss.parse(`
			:root {
				--a: var(--b);
				--b: var(--c);
				--c: red;
			}
		`);

		const reachable = buildReachableVariables(root, new Set(['--a']));

		expect(reachable).toEqual(new Set(['--a', '--b', '--c']));
	});

	it('handles branching dependencies', () => {
		const root = postcss.parse(`
			:root {
				--a: var(--b) var(--c);
				--b: blue;
				--c: red;
			}
		`);

		const reachable = buildReachableVariables(root, new Set(['--a']));

		expect(reachable).toEqual(new Set(['--a', '--b', '--c']));
	});

	it('handles circular dependencies', () => {
		const root = postcss.parse(`
			:root {
				--a: var(--b);
				--b: var(--a);
			}
		`);

		const reachable = buildReachableVariables(root, new Set(['--a']));

		expect(reachable).toEqual(new Set(['--a', '--b']));
	});

	it('ignores unrelated variables', () => {
		const root = postcss.parse(`
			:root {
				--a: var(--b);
				--b: red;
				--unused: blue;
			}
		`);

		const reachable = buildReachableVariables(root, new Set(['--a']));

		expect(reachable.has('--unused')).toBe(false);
	});

	it('handles multiple entry points', () => {
		const root = postcss.parse(`
			:root {
				--a: var(--b);
				--b: red;
				--x: var(--y);
				--y: blue;
			}
		`);

		const reachable = buildReachableVariables(root, new Set(['--a', '--x']));

		expect(reachable).toEqual(new Set(['--a', '--b', '--x', '--y']));
	});
});
