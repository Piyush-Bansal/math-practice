import { describe, expect, it } from 'vitest';

import { shouldPreserve } from '../utils';

describe('shouldPreserve', () => {
	it('returns true for an exact string match', () => {
		expect(shouldPreserve('--foo', ['--foo'])).toBe(true);
	});

	it('returns false when the variable is not preserved', () => {
		expect(shouldPreserve('--foo', ['--bar'])).toBe(false);
	});

	it('matches regular expressions', () => {
		expect(shouldPreserve('--spacing-4', [/^--spacing-/])).toBe(true);
	});

	it('returns false when no regex matches', () => {
		expect(shouldPreserve('--spacing-4', [/^--color-/])).toBe(false);
	});

	it('works with mixed string and regex rules', () => {
		expect(shouldPreserve('--color-primary', ['--foo', /^--color-/])).toBe(
			true
		);
	});

	it('returns false for an empty preserve list', () => {
		expect(shouldPreserve('--foo', [])).toBe(false);
	});
});
