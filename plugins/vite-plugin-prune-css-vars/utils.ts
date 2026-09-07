import type { PreserveMatcher } from './types';

export function shouldPreserve(
	name: string,
	preserve: ReadonlyArray<PreserveMatcher>
): boolean {
	for (const rule of preserve) {
		if (typeof rule === 'string' && rule === name) {
			return true;
		}

		if (rule instanceof RegExp && rule.test(name)) {
			return true;
		}
	}

	return false;
}
