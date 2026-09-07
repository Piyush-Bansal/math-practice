import postcss from 'postcss';

import { buildReachableVariables } from './graph';
import { shouldPreserve } from './utils';

import type { PreserveMatcher } from './types';

export function pruneUnusedVariables(
	css: string,
	used: ReadonlySet<string>,
	preserve: ReadonlyArray<PreserveMatcher> = []
): string {
	if (!css.includes('--')) {
		return css;
	}

	const root = postcss.parse(css);

	const reachable = buildReachableVariables(root, used);

	root.walkDecls((decl) => {
		if (!decl.prop.startsWith('--')) {
			return;
		}

		if (reachable.has(decl.prop)) {
			return;
		}

		if (shouldPreserve(decl.prop, preserve)) {
			return;
		}

		decl.remove();
	});

	return root.toString();
}
